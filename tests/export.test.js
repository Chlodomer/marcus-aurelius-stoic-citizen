const test = require('node:test');
const assert = require('node:assert/strict');

const content = require('../src/content.js');
const logic = require('../src/logic.js');
const exporter = require('../src/export.js');

function completeState() {
  const state = logic.createInitialState('2026-08-24T10:00:00.000Z');
  state.student = { name: 'Julia Domna', id: '24680' };
  state.completedAt = '2026-08-24T11:10:00.000Z';
  for (const question of content.questions) {
    const choice = question.choices[0];
    state.answers[question.id] = {
      choiceId: choice.id,
      prompt: question.branches[choice.id].prompt,
      response: `Response for question ${question.number}.`,
      evidence: question.evidenceRequirement
        ? [{ originalText: `Evidence ${question.number}`, citation: question.anchor.length ? content.passages.find((p) => p.id === question.anchor[0]).citation : 'I.14' }]
        : [],
      completed: true,
      savedAt: state.completedAt
    };
  }
  return state;
}

test('plain-text submission includes identity, every prompt, responses, evidence, and path', () => {
  const text = exporter.buildSubmissionText(completeState(), content);
  assert.match(text, /Julia Domna/);
  assert.match(text, /Student ID: 24680/);
  assert.equal((text.match(/QUESTION \d —/g) || []).length, 8);
  assert.match(text, /Tailored prompt:/);
  assert.match(text, /Evidence 4/);
  assert.match(text, /INTERPRETIVE PATH/);
});

test('document sections expose all eight questions to the PDF renderer', () => {
  const sections = exporter.buildDocumentSections(completeState(), content);
  assert.equal(sections.questions.length, 8);
  assert.equal(sections.student.name, 'Julia Domna');
  assert.equal(sections.questions[7].title, 'The Commodus Problem');
  assert.equal(sections.path.length, 8);
});

