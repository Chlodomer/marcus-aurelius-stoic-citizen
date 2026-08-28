(function (root, factory) {
  const logic = factory();
  if (typeof module === 'object' && module.exports) module.exports = logic;
  else root.MarcusLogic = logic;
})(typeof self !== 'undefined' ? self : this, function () {
  const STORAGE_KEY = 'marcus-aurelius-book-4-assignment-v2';

  function blankAnswer() {
    return {
      choiceId: '',
      prompt: '',
      response: '',
      evidence: [],
      completed: false,
      savedAt: null
    };
  }

  function createInitialState(now = new Date().toISOString()) {
    const answers = {};
    for (let index = 1; index <= 8; index += 1) answers[`q${index}`] = blankAnswer();
    return {
      version: 2,
      screen: 'title',
      onboardingStep: 0,
      currentQuestion: 1,
      questionPhase: 'choice',
      sourceOpen: false,
      sourceTab: 'source',
      student: { name: '', id: '' },
      answers,
      startedAt: now,
      updatedAt: now,
      completedAt: null
    };
  }

  function getBranch(questionId, choiceId, questions) {
    const question = questions.find((item) => item.id === questionId);
    if (!question || !question.branches[choiceId]) return null;
    return question.branches[choiceId];
  }

  function getSourcePrompt(question, answer) {
    if (answer && answer.prompt) return answer.prompt;
    const branch = question && answer && question.branches[answer.choiceId];
    return branch
      ? branch.prompt
      : 'Choose an interpretation on the question screen to see your tailored source challenge.';
  }

  function normalizeWhitespace(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function insertEvidence({ response, cursorStart, cursorEnd, selectedText, citation, metadata = {}, now = new Date().toISOString() }) {
    const beforeRaw = String(response || '').slice(0, cursorStart);
    const afterRaw = String(response || '').slice(cursorEnd);
    const before = beforeRaw.replace(/\s+$/, '');
    const after = afterRaw.replace(/^\s+/, '');
    const quote = `“${normalizeWhitespace(selectedText)}” (${citation})`;
    const leftJoin = before && !/[\s(“]$/.test(before) ? ' ' : '';
    const rightJoin = after && !/^[.,;:!?)]/.test(after) ? ' ' : '';
    const nextResponse = `${before}${leftJoin}${quote}${rightJoin}${after}`;
    return {
      response: nextResponse,
      cursor: (before + leftJoin + quote).length,
      evidenceRecord: {
        id: `${metadata.questionId || 'q'}-${metadata.passageId || 'passage'}-${Date.parse(now) || now}`,
        originalText: normalizeWhitespace(selectedText),
        citation,
        passageId: metadata.passageId || '',
        questionId: metadata.questionId || '',
        addedAt: now
      }
    };
  }

  function searchPassages(passages, query = '', book = 'all') {
    const needle = normalizeWhitespace(query).toLocaleLowerCase();
    return passages.filter((passage) => {
      const bookMatches = book === 'all' || passage.book === book;
      const haystack = `${passage.citation} ${passage.title} ${passage.text}`.toLocaleLowerCase();
      return bookMatches && (!needle || haystack.includes(needle));
    });
  }

  function passageExcerpt(text, maxWords = 70) {
    const normalized = normalizeWhitespace(text);
    const sentence = normalized.match(/^.*?[.!?](?:\s|$)/);
    const candidate = sentence ? sentence[0].trim() : normalized;
    const words = candidate.split(' ');
    if (words.length <= maxWords) return candidate;
    return `${words.slice(0, maxWords).join(' ')}…`;
  }

  function wordCount(value) {
    const normalized = normalizeWhitespace(value);
    return normalized ? normalized.split(' ').length : 0;
  }

  function validateQuestion(question, answer) {
    const errors = [];
    if (!answer || !answer.choiceId) errors.push({ code: 'choice', message: 'Choose an interpretation.' });
    if (!answer || wordCount(answer.response) < question.minimumWords) {
      errors.push({ code: 'response', message: `Write at least ${question.minimumWords} words.` });
    }
    const uniqueEvidence = new Set((answer && answer.evidence || []).map((item) => item.passageId || item.citation || item.id)).size;
    if (!answer || uniqueEvidence < question.evidenceRequirement) {
      const count = question.evidenceRequirement;
      errors.push({ code: 'evidence', message: `Add ${count} source quotation${count === 1 ? '' : 's'}.` });
    }
    return { valid: errors.length === 0, errors, wordCount: wordCount(answer && answer.response) };
  }

  function getCompletion(state, questions) {
    const missing = [];
    let completed = 0;
    for (const question of questions) {
      const answer = state.answers[question.id];
      const validation = validateQuestion(question, answer);
      if (answer && answer.completed && validation.valid) completed += 1;
      else missing.push({ questionId: question.id, number: question.number, title: question.title, errors: validation.errors });
    }
    return { completed, total: questions.length, percent: Math.round((completed / questions.length) * 100), missing };
  }

  function sanitizeFilename(value) {
    return String(value || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^[._-]+|[._-]+$/g, '')
      .replace(/-+/g, '-') || 'student';
  }

  function submissionFilename(student) {
    return `marcus-aurelius-book-4-${sanitizeFilename(student.id)}-${sanitizeFilename(student.name)}.pdf`;
  }

  function startAssignment(state) {
    state.screen = 'onboarding';
    state.onboardingStep = 0;
    return state;
  }

  function advanceOnboarding(state) {
    state.onboardingStep = Math.min(2, Number(state.onboardingStep || 0) + 1);
    return state;
  }

  function finishOnboarding(state, student) {
    const name = normalizeWhitespace(student && student.name);
    const id = normalizeWhitespace(student && student.id);
    if (!name || !id) return { ok: false, error: 'Enter your full name and student ID.' };
    state.student = { name, id };
    state.screen = 'question';
    state.currentQuestion = 1;
    state.questionPhase = 'choice';
    return { ok: true };
  }

  function completeQuestion(state, question, now = new Date().toISOString()) {
    const answer = state.answers[question.id];
    const validation = validateQuestion(question, answer);
    if (!validation.valid) return { ok: false, validation };
    answer.completed = true;
    answer.savedAt = now;
    if (question.number < 8) {
      state.currentQuestion = question.number + 1;
      state.questionPhase = 'choice';
      state.screen = 'question';
    } else {
      state.screen = 'review';
      state.completedAt = now;
    }
    return { ok: true, validation };
  }

  function saveState(state, storage) {
    const target = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!target) return { ok: false, error: 'Browser storage is unavailable.' };
    try {
      state.updatedAt = new Date().toISOString();
      target.setItem(STORAGE_KEY, JSON.stringify(state));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'This browser could not save your progress.' };
    }
  }

  function loadState(storage) {
    const target = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!target) return null;
    try {
      const raw = target.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.version !== 2 || !parsed.answers) return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function clearState(storage) {
    const target = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (target) target.removeItem(STORAGE_KEY);
  }

  return {
    STORAGE_KEY,
    blankAnswer,
    createInitialState,
    getBranch,
    getSourcePrompt,
    insertEvidence,
    searchPassages,
    passageExcerpt,
    wordCount,
    validateQuestion,
    getCompletion,
    sanitizeFilename,
    submissionFilename,
    startAssignment,
    advanceOnboarding,
    finishOnboarding,
    completeQuestion,
    saveState,
    loadState,
    clearState
  };
});
