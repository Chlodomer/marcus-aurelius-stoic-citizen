const test = require('node:test');
const assert = require('node:assert/strict');

const content = require('../src/content.js');
const logic = require('../src/logic.js');

test('the assignment contains eight braided questions with three branches each', () => {
  assert.equal(content.questions.length, 8);
  for (const question of content.questions) {
    assert.equal(question.choices.length, 3);
    assert.equal(Object.keys(question.branches).length, 3);
  }
});

test('initial state creates one empty answer per question', () => {
  const state = logic.createInitialState('2026-08-24T10:00:00.000Z');
  assert.equal(Object.keys(state.answers).length, 8);
  assert.equal(state.screen, 'title');
  assert.equal(state.startedAt, '2026-08-24T10:00:00.000Z');
  assert.deepEqual(state.student, { name: '', id: '' });
});

test('branch lookup returns the prompt tied to a choice', () => {
  const branch = logic.getBranch('q6', 'no-rejection', content.questions);
  assert.match(branch.prompt, /does not reject war/i);
});

test('source library supplies guidance when opened before a choice is made', () => {
  const question = content.questions[0];
  const prompt = logic.getSourcePrompt(question, { choiceId: '', prompt: '' });
  assert.equal(prompt, 'Choose an interpretation on the question screen to see your tailored source challenge.');
});

test('evidence is inserted at the active selection and preserves an audit record', () => {
  const result = logic.insertEvidence({
    response: 'Marcus duty.',
    cursorStart: 7,
    cursorEnd: 11,
    selectedText: 'as Antoninus, is Rome; as a man, the world',
    citation: 'VI.44',
    metadata: { passageId: 'vi-44', questionId: 'q3' },
    now: '2026-08-24T10:10:00.000Z'
  });

  assert.equal(
    result.response,
    'Marcus “as Antoninus, is Rome; as a man, the world” (VI.44).'
  );
  assert.equal(result.evidenceRecord.originalText, 'as Antoninus, is Rome; as a man, the world');
  assert.equal(result.evidenceRecord.passageId, 'vi-44');
  assert.equal(result.evidenceRecord.questionId, 'q3');
});

test('source search is case-insensitive and can be filtered by book', () => {
  const all = logic.searchPassages(content.passages, 'CAESARIFIED');
  const filtered = logic.searchPassages(content.passages, 'common', 'IV');
  assert.equal(all[0].citation, 'VI.30');
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((passage) => passage.book === 'IV'));
});

test('keyboard quotation fallback uses a manageable exact excerpt', () => {
  const text = 'First sentence is exact. Second sentence should not be inserted unless the first is too short.';
  assert.equal(logic.passageExcerpt(text), 'First sentence is exact.');
});

test('every source passage supplies a focused keyboard quotation that matches the scan-checked text', () => {
  for (const passage of content.passages) {
    assert.ok(passage.keyboardExcerpt, `${passage.citation} needs a keyboard excerpt`);
    assert.ok(passage.text.includes(passage.keyboardExcerpt), `${passage.citation} excerpt must be exact`);
  }
});

test('question validation reports missing choice, response length, and evidence separately', () => {
  const question = content.questions.find((item) => item.id === 'q2');
  const result = logic.validateQuestion(question, {
    choiceId: '',
    prompt: '',
    response: 'Too short.',
    evidence: []
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.errors.map((error) => error.code), ['choice', 'response', 'evidence']);
});

test('a two-passage challenge does not count the same passage twice', () => {
  const question = content.questions.find((item) => item.id === 'q4');
  const answer = {
    choiceId: 'deliberation',
    prompt: question.branches.deliberation.prompt,
    response: Array(100).fill('word').join(' '),
    evidence: [
      { passageId: 'i-16', originalText: 'one', citation: 'I.16' },
      { passageId: 'i-16', originalText: 'two', citation: 'I.16' }
    ]
  };
  const result = logic.validateQuestion(question, answer);
  assert.equal(result.valid, false);
  assert.equal(result.errors.at(-1).code, 'evidence');
});

test('the final synthesis requires two reused or newly inserted passages', () => {
  assert.equal(content.questions[7].evidenceRequirement, 2);
});

test('completion advances only for fully valid saved questions', () => {
  const state = logic.createInitialState('2026-08-24T10:00:00.000Z');
  const q1 = content.questions[0];
  state.answers.q1 = {
    choiceId: 'justice',
    prompt: q1.branches.justice.prompt,
    response: Array(45).fill('word').join(' '),
    evidence: [],
    completed: true
  };
  const completion = logic.getCompletion(state, content.questions);
  assert.equal(completion.completed, 1);
  assert.equal(completion.percent, 13);
  assert.equal(completion.missing.length, 7);
});

test('filename sanitation removes unsafe characters and preserves useful identity', () => {
  assert.equal(logic.sanitizeFilename(' 123/45: Fox, Yaniv '), '123-45-Fox-Yaniv');
  assert.equal(logic.submissionFilename({ id: '123/45', name: 'Fox, Yaniv' }), 'marcus-aurelius-123-45-Fox-Yaniv.pdf');
});

test('onboarding advances to the first question only after valid identity', () => {
  const state = logic.createInitialState('2026-08-24T10:00:00.000Z');
  logic.startAssignment(state);
  logic.advanceOnboarding(state);
  logic.advanceOnboarding(state);
  const blocked = logic.finishOnboarding(state, { name: '', id: '' });
  assert.equal(blocked.ok, false);
  const finished = logic.finishOnboarding(state, { name: 'Julia Domna', id: '24680' });
  assert.equal(finished.ok, true);
  assert.equal(state.screen, 'question');
  assert.equal(state.currentQuestion, 1);
  assert.deepEqual(state.student, { name: 'Julia Domna', id: '24680' });
});

test('saving a valid question reconverges at the next shared theme', () => {
  const state = logic.createInitialState('2026-08-24T10:00:00.000Z');
  state.screen = 'question';
  state.answers.q1 = {
    ...state.answers.q1,
    choiceId: 'justice',
    prompt: content.questions[0].branches.justice.prompt,
    response: Array(45).fill('word').join(' ')
  };
  const result = logic.completeQuestion(state, content.questions[0], '2026-08-24T10:20:00.000Z');
  assert.equal(result.ok, true);
  assert.equal(state.answers.q1.completed, true);
  assert.equal(state.currentQuestion, 2);
  assert.equal(state.questionPhase, 'choice');
});

test('state round-trips through browser storage', () => {
  const values = new Map();
  const storage = {
    setItem: (key, value) => values.set(key, value),
    getItem: (key) => values.get(key) || null,
    removeItem: (key) => values.delete(key)
  };
  const state = logic.createInitialState('2026-08-24T10:00:00.000Z');
  state.student.name = 'Julia Domna';
  assert.equal(logic.saveState(state, storage).ok, true);
  assert.equal(logic.loadState(storage).student.name, 'Julia Domna');
  logic.clearState(storage);
  assert.equal(logic.loadState(storage), null);
});
