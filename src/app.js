(function () {
  'use strict';

  const content = window.MarcusContent;
  const logic = window.MarcusLogic;
  const exporter = window.MarcusExport;
  const root = document.getElementById('main-content');
  const liveRegion = document.getElementById('live-region');
  const storageWarning = document.getElementById('storage-warning');
  let state = logic.loadState() || logic.createInitialState();
  let selectionCandidate = null;
  let responseCursor = { start: 0, end: 0 };
  let sourceQuery = '';
  let sourceBook = 'all';
  let validationErrors = [];
  let identityError = '';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function announce(message) {
    liveRegion.textContent = '';
    window.setTimeout(() => { liveRegion.textContent = message; }, 10);
  }

  function persist() {
    const result = logic.saveState(state);
    if (!result.ok) {
      storageWarning.hidden = false;
      storageWarning.textContent = `${result.error} Keep this tab open and download your work before leaving.`;
    }
  }

  function visualField(theme) {
    return `<aside class="visual-panel visual--${escapeHtml(theme)}" aria-hidden="true"></aside>`;
  }

  function footer() {
    return `
      <footer class="app-footer">
        <span>Your work stays in this browser until you download it.</span>
        <button class="button button--text button--danger" type="button" data-action="start-over">Start over</button>
      </footer>`;
  }

  function topbar() {
    const completion = logic.getCompletion(state, content.questions);
    const questionNumber = state.screen === 'question' ? state.currentQuestion : completion.completed;
    const shownPercent = state.screen === 'review' || state.screen === 'download'
      ? completion.percent
      : Math.round((Math.max(0, questionNumber - 1) / 8) * 100);
    return `
      <header class="topbar">
        <div class="brand-small">Marcus Aurelius<br>Emperor · Stoic · Citizen</div>
        <div class="progress-wrap" aria-label="Assignment progress: ${shownPercent}%">
          <div class="progress-labels"><span>Question ${Math.min(questionNumber || 1, 8)} of 8</span><span>${shownPercent}% complete</span></div>
          <div class="progress-track"><span class="progress-fill" style="--progress:${shownPercent}%"></span></div>
        </div>
        <div class="top-actions">
          ${state.screen === 'question' ? '<button class="button button--ghost button--small" type="button" data-action="open-source" aria-haspopup="dialog">⌕ <span>Source Library</span></button>' : ''}
        </div>
      </header>`;
  }

  function renderTitle() {
    root.innerHTML = `
      <div class="app-shell">
        <section class="title-screen">
          <div class="title-copy">
            <p class="eyebrow">Interpretive primary-source assignment</p>
            <h1 class="display-title">Marcus Aurelius:<br>Emperor, Stoic,<br>Citizen</h1>
            <p class="title-subtitle">Read a private philosophical notebook against the public burdens of Roman rule.</p>
            <div class="title-meta"><span>${content.duration}</span><span>Eight questions</span><span>One PDF submission</span></div>
            <div class="title-actions">
              <button class="button button--primary" type="button" data-action="start">Start assignment</button>
              <a class="button button--ghost" href="Marcus Aurelius.pdf" target="_blank" rel="noopener">Open complete scan</a>
            </div>
            <p class="privacy-note">No account is needed. Progress is saved automatically on this device; no student data is sent from the app.</p>
          </div>
          ${visualField('title')}
        </section>
        ${footer()}
      </div>`;
  }

  function onboardingProgress() {
    return `<div class="onboarding-steps" aria-label="Onboarding step ${state.onboardingStep + 1} of 3">
      ${[0, 1, 2].map((index) => `<span class="${index === state.onboardingStep ? 'is-active' : index < state.onboardingStep ? 'is-complete' : ''}"></span>`).join('')}
    </div>`;
  }

  function renderOnboarding() {
    const step = state.onboardingStep;
    const item = content.onboarding[step];
    let example = '';
    if (step === 0) {
      example = `<div class="onboarding-example"><p class="eyebrow">The pattern</p><h2>Choose → defend → test</h2><p>A choice opens a tailored writing prompt. Later questions ask you to complicate your first interpretation and name what the source cannot prove.</p></div>`;
    } else if (step === 1) {
      example = `
        <div class="onboarding-example">
          <p class="eyebrow">Practice once</p>
          <p id="practice-source" class="practice-source">For we have come into being for co-operation, as have the feet, the hands, the eyelids, the rows of upper and lower teeth.</p>
          <p class="field-hint">Select a few words above, then use the button. In the assignment, the citation is attached automatically.</p>
          <button class="button button--ghost button--small" type="button" data-action="practice-use">Use selected words</button>
          <textarea id="practice-result" class="practice-result" aria-label="Practice response" placeholder="Your practice quotation will appear here."></textarea>
        </div>`;
    } else {
      example = `
        <form class="identity-card" id="identity-form">
          <p class="eyebrow">Submission identity</p>
          <div class="field"><label for="student-name">Full name</label><input id="student-name" name="name" autocomplete="name" value="${escapeHtml(state.student.name)}" required></div>
          <div class="field"><label for="student-id">Student ID</label><input id="student-id" name="id" inputmode="numeric" autocomplete="off" value="${escapeHtml(state.student.id)}" required></div>
          <p class="field-hint">Use the same details expected by your course submission system. The final PDF filename will include both.</p>
          ${identityError ? `<p class="inline-error" role="alert">${escapeHtml(identityError)}</p>` : ''}
        </form>`;
    }
    root.innerHTML = `
      <div class="app-shell">
        <section class="onboarding-shell">
          ${onboardingProgress()}
          <div class="onboarding-card">
            <div>
              <p class="eyebrow">Before you begin · ${step + 1} of 3</p>
              <h1>${escapeHtml(item.title)}</h1>
              <p class="onboarding-copy">${escapeHtml(item.body)}</p>
              ${step === 2 ? '<p class="privacy-note">Closing or refreshing this page will not erase saved progress on this device. Private browsing or clearing browser data may remove it.</p>' : ''}
            </div>
            ${example}
          </div>
          <div class="onboarding-actions">
            <button class="button button--ghost" type="button" data-action="onboarding-back">${step === 0 ? 'Return to title' : 'Back'}</button>
            <button class="button button--primary" type="button" data-action="onboarding-next">${step === 2 ? 'Begin Question 1' : 'Continue'}</button>
          </div>
        </section>
      </div>`;
  }

  function routeLine() {
    return `<div class="route-line" aria-label="Path through eight questions">${content.questions.map((question) => {
      const answer = state.answers[question.id];
      const classes = [answer.completed ? 'is-complete' : '', question.number === state.currentQuestion ? 'is-current' : ''].filter(Boolean).join(' ');
      return `<span class="${classes}" title="Question ${question.number}"></span>`;
    }).join('')}</div>`;
  }

  function anchorMarkup(question) {
    const passage = content.passages.find((item) => item.id === question.anchor[0]);
    const excerpt = passage.text.length > 520 ? `${passage.text.slice(0, 517).replace(/\s+\S*$/, '')}…` : passage.text;
    return `
      <div class="anchor-block">
        <blockquote>“${escapeHtml(excerpt)}”</blockquote>
        <div class="anchor-cite">${escapeHtml(passage.citation)} · Haines translation</div>
        ${question.anchor.length > 1 ? `<div class="anchor-more">This question also provides ${question.anchor.slice(1).map((id) => content.passages.find((p) => p.id === id).citation).join(', ')} in the Source Library.</div>` : ''}
      </div>`;
  }

  function priorEvidenceMarkup() {
    if (state.currentQuestion !== 8) return '';
    const prior = content.questions.slice(0, 7).flatMap((question) => (state.answers[question.id].evidence || []).map((evidence) => ({ ...evidence, from: question.number })));
    if (!prior.length) return '<div class="prior-evidence"><h3>Earlier evidence</h3><p class="field-hint">No earlier source selections were saved. You can still cite passages you used by opening the Source Library.</p></div>';
    return `<div class="prior-evidence"><h3>Reuse earlier evidence</h3><p class="field-hint">These buttons insert a quotation you already selected. They do not create a new source hunt.</p><div class="evidence-chips">${prior.map((evidence, index) => `<button class="evidence-chip" type="button" data-action="reuse-evidence" data-prior-index="${index}" title="${escapeHtml(evidence.originalText)}">Q${evidence.from} · ${escapeHtml(evidence.citation)}</button>`).join('')}</div></div>`;
  }

  function renderQuestion() {
    const question = content.questions[state.currentQuestion - 1];
    const answer = state.answers[question.id];
    const branch = answer.choiceId ? question.branches[answer.choiceId] : null;
    const selectedChoice = question.choices.find((choice) => choice.id === answer.choiceId);
    const isResponse = state.questionPhase === 'response';
    const evidenceMet = answer.evidence.length >= question.evidenceRequirement;
    const phaseMarkup = isResponse ? `
      <div class="branch-prompt">
        <p class="eyebrow">Your source challenge · ${escapeHtml(selectedChoice ? selectedChoice.label : '')}</p>
        <p>${escapeHtml(branch ? branch.prompt : '')}</p>
      </div>
      <div class="field">
        <label for="response">Your response</label>
        <textarea id="response" data-question="${question.id}" placeholder="Make a claim, use exact evidence, and explain your reasoning.">${escapeHtml(answer.response)}</textarea>
        <div class="response-meta">
          <span id="word-count">${logic.wordCount(answer.response)} / ${question.minimumWords} minimum words</span>
          <span class="evidence-status ${evidenceMet ? 'is-met' : ''}">${question.evidenceRequirement ? `${answer.evidence.length} / ${question.evidenceRequirement} source quotation${question.evidenceRequirement === 1 ? '' : 's'}` : question.number === 8 ? 'Reuse at least two earlier passages in your synthesis' : 'Anchor passage supplied'}</span>
        </div>
      </div>
      ${priorEvidenceMarkup()}
      ${validationErrors.length ? `<ul class="validation-list" role="alert">${validationErrors.map((error) => `<li>${escapeHtml(error.message)}</li>`).join('')}</ul>` : ''}
      <div class="question-actions">
        <button class="button button--text" type="button" data-action="back-to-choice">Back to choice</button>
        <div class="question-actions-right">
          <button class="button button--ghost" type="button" data-action="open-source">Open Source Library</button>
          <button class="button button--primary" type="button" data-action="save-question">${question.number === 8 ? 'Save and review' : 'Save and continue'}</button>
        </div>
      </div>` : `
      <fieldset class="choice-list">
        <legend class="sr-only">Choose an interpretation</legend>
        ${question.choices.map((choice) => `
          <label class="choice-card ${answer.choiceId === choice.id ? 'is-selected' : ''}">
            <input type="radio" name="choice" value="${choice.id}" ${answer.choiceId === choice.id ? 'checked' : ''}>
            <span class="choice-mark" aria-hidden="true"></span>
            <span><span class="choice-title">${escapeHtml(choice.label)}</span><span class="choice-description">${escapeHtml(choice.description)}</span></span>
          </label>`).join('')}
      </fieldset>
      ${validationErrors.length ? `<ul class="validation-list" role="alert">${validationErrors.map((error) => `<li>${escapeHtml(error.message)}</li>`).join('')}</ul>` : ''}
      <div class="question-actions">
        ${question.number > 1 ? '<button class="button button--text" type="button" data-action="previous-question">Previous question</button>' : '<span></span>'}
        <button class="button button--primary" type="button" data-action="continue-question" ${answer.choiceId ? '' : 'disabled'}>Continue to source challenge</button>
      </div>`;

    root.innerHTML = `
      <div class="app-shell">
        ${topbar()}
        <section class="question-layout">
          ${visualField(question.art)}
          <article class="question-panel">
            <div class="question-kicker"><span>Question ${question.number} of 8</span><span>${escapeHtml(question.theme)}</span></div>
            <h1>${escapeHtml(question.title)}</h1>
            ${question.inferenceLabel ? `<span class="context-label">Context, not source testimony</span>` : ''}
            <p class="question-context">${escapeHtml(question.context)}</p>
            ${anchorMarkup(question)}
            ${phaseMarkup}
            ${routeLine()}
          </article>
        </section>
        ${footer()}
        ${state.sourceOpen ? sourceLibraryMarkup(question, answer) : ''}
      </div>`;
    if (isResponse) restoreResponseCursor();
  }

  function sourceLibraryMarkup(question, answer) {
    const results = logic.searchPassages(content.passages, sourceQuery, sourceBook);
    const sourceActive = state.sourceTab !== 'response';
    return `
      <section class="source-overlay" role="dialog" aria-modal="true" aria-labelledby="source-title">
        <header class="source-header">
          <h2 id="source-title">Source Library</h2>
          <p>Verified excerpts from C. R. Haines’s 1916 translation · passage text checked against the local scan</p>
          <button class="button button--ghost button--small" type="button" data-action="close-source">Close</button>
        </header>
        <div class="source-tabs" aria-label="Source Library views">
          <button class="${sourceActive ? 'is-active' : ''}" type="button" data-action="source-tab" data-tab="source">Source</button>
          <button class="${!sourceActive ? 'is-active' : ''}" type="button" data-action="source-tab" data-tab="response">Response</button>
        </div>
        <div class="source-grid">
          <div class="source-browser ${sourceActive ? 'is-active' : ''}">
            <div class="source-tools">
              <input id="source-search" type="search" value="${escapeHtml(sourceQuery)}" placeholder="Search the verified dossier" aria-label="Search source passages">
              <select id="source-book" aria-label="Filter by book">
                <option value="all" ${sourceBook === 'all' ? 'selected' : ''}>All books</option>
                ${['I','II','III','IV','VI','X'].map((book) => `<option value="${book}" ${sourceBook === book ? 'selected' : ''}>Book ${book}</option>`).join('')}
              </select>
            </div>
            <div class="source-results">
              ${results.length ? results.map((passage) => `
                <article class="passage-card" data-passage-id="${passage.id}">
                  <div class="passage-heading"><h3>${escapeHtml(passage.title)}</h3><span class="passage-ref">${escapeHtml(passage.citation)}</span></div>
                  <div class="passage-text" tabindex="0" data-selectable="${passage.id}">${escapeHtml(passage.text)}</div>
                  ${passage.note ? `<p class="passage-note"><strong>Editorial note:</strong> ${escapeHtml(passage.note)}</p>` : ''}
                  <div class="passage-footer"><span>Scan p. ${escapeHtml(passage.scanPage)}</span><button class="button button--ghost button--small" type="button" data-action="add-passage" data-passage-id="${passage.id}">Add quotation</button></div>
                </article>`).join('') : '<p>No passages match this search. Try a shorter term or choose another book.</p>'}
            </div>
          </div>
          <div class="source-response ${!sourceActive ? 'is-active' : ''}">
            <p class="eyebrow">Question ${question.number} · Your source challenge</p>
            <div class="source-prompt">${escapeHtml(logic.getSourcePrompt(question, answer))}</div>
            <div class="field"><label for="source-response-text">Response</label><textarea id="source-response-text">${escapeHtml(answer.response)}</textarea></div>
            <div class="response-meta"><span id="source-word-count">${logic.wordCount(answer.response)} words</span><span>${answer.evidence.length} saved source selection${answer.evidence.length === 1 ? '' : 's'}</span></div>
            <button class="button button--primary button--wide" type="button" data-action="close-source">Return to question</button>
          </div>
        </div>
        <div id="selection-menu" class="selection-menu" hidden>
          <span id="selection-preview">Selected source wording</span>
          <button class="button button--ember button--small" type="button" data-action="use-selection">Use in response</button>
        </div>
      </section>`;
  }

  function renderReview() {
    const completion = logic.getCompletion(state, content.questions);
    const complete = completion.missing.length === 0;
    root.innerHTML = `
      <div class="app-shell">
        ${topbar()}
        <section class="review-shell">
          <header class="review-header">
            <div><p class="eyebrow">Review before download</p><h1>Your submission</h1></div>
            <div class="identity-summary"><strong>${escapeHtml(state.student.name)}</strong><br>Student ID: ${escapeHtml(state.student.id)}</div>
          </header>
          <p class="review-status ${complete ? '' : 'is-incomplete'}">${complete ? 'All eight questions are complete. Read through your work before creating the PDF.' : `${completion.missing.length} question${completion.missing.length === 1 ? '' : 's'} still need attention.`}</p>
          <div class="review-list">
            ${content.questions.map((question) => {
              const answer = state.answers[question.id];
              const choice = question.choices.find((item) => item.id === answer.choiceId);
              const validation = logic.validateQuestion(question, answer);
              return `<article class="review-item">
                <div class="review-item-header"><div><p class="eyebrow">Question ${question.number} · ${escapeHtml(question.theme)}</p><h2>${escapeHtml(question.title)}</h2><div class="review-choice">${escapeHtml(choice ? choice.label : 'No choice saved')}</div></div><button class="button button--ghost button--small" type="button" data-action="edit-question" data-question="${question.number}">Edit</button></div>
                <p class="review-response">${escapeHtml(answer.response || 'No response saved.')}</p>
                ${answer.evidence.length ? `<ul class="review-evidence">${answer.evidence.map((evidence) => `<li>“${escapeHtml(evidence.originalText)}” (${escapeHtml(evidence.citation)})</li>`).join('')}</ul>` : ''}
                ${validation.valid ? '' : `<ul class="validation-list">${validation.errors.map((error) => `<li>${escapeHtml(error.message)}</li>`).join('')}</ul>`}
              </article>`;
            }).join('')}
          </div>
          <div class="review-actions">
            <button class="button button--ghost" type="button" data-action="edit-question" data-question="8">Return to Question 8</button>
            <button class="button button--primary" type="button" data-action="go-download" ${complete ? '' : 'disabled'}>Continue to download</button>
          </div>
        </section>
        ${footer()}
      </div>`;
  }

  function renderDownload() {
    const fallback = exporter.buildSubmissionText(state, content);
    root.innerHTML = `
      <div class="app-shell">
        ${topbar()}
        <section class="download-shell">
          <p class="eyebrow">Final step</p>
          <h1>Download your submission</h1>
          <div class="download-card">
            <h2>One PDF, ready to upload</h2>
            <p>The PDF includes your identity, all eight choices, tailored prompts, responses, original source selections, and complete interpretive path.</p>
            <p class="field-hint">Expected filename: ${escapeHtml(logic.submissionFilename(state.student))}</p>
            <div class="download-actions">
              <button class="button button--primary" type="button" data-action="download-pdf">Download submission</button>
              <button class="button button--ghost" type="button" data-action="back-review">Back to review</button>
            </div>
            <div class="emergency-box">
              <h3>If PDF download fails</h3>
              <p class="field-hint">Download or copy this complete plain-text backup, then contact the instructor before the deadline.</p>
              <div class="download-actions"><button class="button button--ghost button--small" type="button" data-action="download-text">Download text backup</button><button class="button button--ghost button--small" type="button" data-action="copy-text">Copy text backup</button></div>
              <textarea id="fallback-text" readonly>${escapeHtml(fallback)}</textarea>
            </div>
          </div>
        </section>
        ${footer()}
      </div>`;
  }

  function render() {
    validationErrors = [];
    if (state.screen === 'title') renderTitle();
    else if (state.screen === 'onboarding') renderOnboarding();
    else if (state.screen === 'question') renderQuestion();
    else if (state.screen === 'review') renderReview();
    else if (state.screen === 'download') renderDownload();
    else { state.screen = 'title'; renderTitle(); }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function currentQuestion() { return content.questions[state.currentQuestion - 1]; }
  function currentAnswer() { return state.answers[currentQuestion().id]; }

  function updateChoice(choiceId) {
    const question = currentQuestion();
    const answer = currentAnswer();
    const branch = question.branches[choiceId];
    answer.choiceId = choiceId;
    answer.prompt = branch.prompt;
    answer.completed = false;
    persist();
    renderQuestion();
  }

  function updateResponse(value, cursorStart, cursorEnd) {
    const answer = currentAnswer();
    answer.response = value;
    answer.completed = false;
    responseCursor = { start: cursorStart == null ? value.length : cursorStart, end: cursorEnd == null ? value.length : cursorEnd };
    persist();
    const word = document.getElementById('word-count') || document.getElementById('source-word-count');
    if (word) word.textContent = `${logic.wordCount(value)}${word.id === 'word-count' ? ` / ${currentQuestion().minimumWords} minimum words` : ' words'}`;
  }

  function captureCursor(textarea) {
    if (!textarea) return;
    responseCursor = { start: textarea.selectionStart, end: textarea.selectionEnd };
  }

  function restoreResponseCursor() {
    const textarea = document.getElementById('response');
    if (!textarea) return;
    const position = Math.min(responseCursor.start, textarea.value.length);
    textarea.setSelectionRange(position, Math.min(responseCursor.end, textarea.value.length));
  }

  function addEvidence(selectedText, passage) {
    const answer = currentAnswer();
    const result = logic.insertEvidence({
      response: answer.response,
      cursorStart: responseCursor.start,
      cursorEnd: responseCursor.end,
      selectedText,
      citation: passage.citation,
      metadata: { passageId: passage.id, questionId: currentQuestion().id }
    });
    answer.response = result.response;
    answer.evidence.push(result.evidenceRecord);
    answer.completed = false;
    responseCursor = { start: result.cursor, end: result.cursor };
    selectionCandidate = null;
    persist();
    announce(`Quotation from ${passage.citation} added to your response.`);
    renderQuestion();
    if (state.sourceOpen) {
      state.sourceTab = 'response';
      renderQuestion();
      const textarea = document.getElementById('source-response-text');
      if (textarea) { textarea.focus(); textarea.setSelectionRange(result.cursor, result.cursor); }
    }
  }

  function priorEvidenceList() {
    return content.questions.slice(0, 7).flatMap((question) => (state.answers[question.id].evidence || []).map((evidence) => ({ ...evidence, from: question.number })));
  }

  function handleAction(action, target) {
    if (action === 'start') {
      logic.startAssignment(state); persist(); render();
    } else if (action === 'start-over') {
      if (window.confirm('Erase all saved work for this assignment on this device? This cannot be undone.')) {
        logic.clearState(); state = logic.createInitialState(); render(); announce('Saved work erased.');
      }
    } else if (action === 'onboarding-back') {
      if (state.onboardingStep === 0) state.screen = 'title'; else state.onboardingStep -= 1;
      persist(); render();
    } else if (action === 'onboarding-next') {
      if (state.onboardingStep < 2) { logic.advanceOnboarding(state); persist(); render(); }
      else {
        const form = document.getElementById('identity-form');
        const data = new FormData(form);
        const result = logic.finishOnboarding(state, { name: data.get('name'), id: data.get('id') });
        if (!result.ok) { identityError = result.error; renderOnboarding(); }
        else { identityError = ''; persist(); render(); }
      }
    } else if (action === 'practice-use') {
      const selection = window.getSelection();
      const source = document.getElementById('practice-source');
      const selected = selection && source && source.contains(selection.anchorNode) ? selection.toString().trim() : '';
      const result = document.getElementById('practice-result');
      if (selected) { result.value = `“${selected}” (II.1)`; announce('Practice quotation inserted.'); }
      else { announce('Select words in the practice passage first.'); }
    } else if (action === 'continue-question') {
      if (!currentAnswer().choiceId) { validationErrors = [{ message: 'Choose an interpretation before continuing.' }]; renderQuestion(); return; }
      state.questionPhase = 'response'; persist(); renderQuestion();
      const textarea = document.getElementById('response'); if (textarea) textarea.focus();
    } else if (action === 'back-to-choice') {
      captureCursor(document.getElementById('response'));
      state.questionPhase = 'choice'; persist(); renderQuestion();
    } else if (action === 'previous-question') {
      if (state.currentQuestion > 1) { state.currentQuestion -= 1; state.questionPhase = state.answers[`q${state.currentQuestion}`].choiceId ? 'response' : 'choice'; persist(); renderQuestion(); }
    } else if (action === 'save-question') {
      const textarea = document.getElementById('response');
      if (textarea) updateResponse(textarea.value, textarea.selectionStart, textarea.selectionEnd);
      const savedNumber = currentQuestion().number;
      const result = logic.completeQuestion(state, currentQuestion());
      if (!result.ok) { validationErrors = result.validation.errors; renderQuestion(); }
      else { persist(); render(); announce(`Question ${savedNumber} saved.`); }
    } else if (action === 'open-source') {
      const textarea = document.getElementById('response'); if (textarea) captureCursor(textarea);
      state.sourceOpen = true; state.sourceTab = 'source'; persist(); renderQuestion();
      const search = document.getElementById('source-search'); if (search) search.focus();
    } else if (action === 'close-source') {
      const textarea = document.getElementById('source-response-text');
      if (textarea) updateResponse(textarea.value, textarea.selectionStart, textarea.selectionEnd);
      state.sourceOpen = false; persist(); renderQuestion();
      const response = document.getElementById('response'); if (response) response.focus();
    } else if (action === 'source-tab') {
      const textarea = document.getElementById('source-response-text');
      if (textarea) updateResponse(textarea.value, textarea.selectionStart, textarea.selectionEnd);
      state.sourceTab = target.dataset.tab; persist(); renderQuestion();
    } else if (action === 'add-passage') {
      const passage = content.passages.find((item) => item.id === target.dataset.passageId);
      addEvidence(passage.keyboardExcerpt || logic.passageExcerpt(passage.text), passage);
    } else if (action === 'use-selection' && selectionCandidate) {
      addEvidence(selectionCandidate.text, selectionCandidate.passage);
    } else if (action === 'reuse-evidence') {
      const evidence = priorEvidenceList()[Number(target.dataset.priorIndex)];
      const passage = content.passages.find((item) => item.id === evidence.passageId) || { id: evidence.passageId, citation: evidence.citation };
      addEvidence(evidence.originalText, passage);
    } else if (action === 'edit-question') {
      state.screen = 'question'; state.currentQuestion = Number(target.dataset.question); state.questionPhase = 'response'; persist(); render();
    } else if (action === 'go-download') {
      state.screen = 'download'; persist(); render();
    } else if (action === 'back-review') {
      state.screen = 'review'; persist(); render();
    } else if (action === 'download-pdf') {
      try { const filename = exporter.downloadSubmissionPdf(state, content); announce(`${filename} downloaded.`); }
      catch (error) { announce(error.message); storageWarning.hidden = false; storageWarning.textContent = error.message; }
    } else if (action === 'download-text') {
      exporter.downloadPlainText(state, content); announce('Plain-text backup downloaded.');
    } else if (action === 'copy-text') {
      const text = exporter.buildSubmissionText(state, content);
      navigator.clipboard.writeText(text).then(() => announce('Plain-text backup copied.')).catch(() => {
        const box = document.getElementById('fallback-text'); box.focus(); box.select(); announce('Select and copy the highlighted backup text.');
      });
    }
  }

  root.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-action]');
    if (actionTarget) handleAction(actionTarget.dataset.action, actionTarget);
  });

  root.addEventListener('change', (event) => {
    if (event.target.name === 'choice') updateChoice(event.target.value);
    if (event.target.id === 'source-book') { sourceBook = event.target.value; renderQuestion(); }
  });

  root.addEventListener('input', (event) => {
    if (event.target.id === 'response' || event.target.id === 'source-response-text') {
      updateResponse(event.target.value, event.target.selectionStart, event.target.selectionEnd);
    }
    if (event.target.id === 'source-search') {
      sourceQuery = event.target.value;
      const cursor = event.target.selectionStart;
      renderQuestion();
      const search = document.getElementById('source-search'); if (search) { search.focus(); search.setSelectionRange(cursor, cursor); }
    }
  });

  root.addEventListener('select', (event) => {
    if (event.target.id === 'response' || event.target.id === 'source-response-text') captureCursor(event.target);
  });

  root.addEventListener('keyup', (event) => {
    if (event.target.id === 'response' || event.target.id === 'source-response-text') captureCursor(event.target);
  });

  root.addEventListener('mouseup', () => {
    if (!state.sourceOpen) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const text = selection.toString().trim();
    const element = selection.anchorNode && selection.anchorNode.parentElement && selection.anchorNode.parentElement.closest('[data-selectable]');
    if (!text || !element) return;
    const passage = content.passages.find((item) => item.id === element.dataset.selectable);
    selectionCandidate = { text, passage };
    const menu = document.getElementById('selection-menu');
    const preview = document.getElementById('selection-preview');
    if (menu && preview) { preview.textContent = `${text.slice(0, 50)}${text.length > 50 ? '…' : ''} (${passage.citation})`; menu.hidden = false; }
  });

  window.addEventListener('beforeunload', persist);
  render();
})();
