(function (root, factory) {
  const exporter = factory(
    typeof module === 'object' && module.exports ? require('./logic.js') : root.MarcusLogic
  );
  if (typeof module === 'object' && module.exports) module.exports = exporter;
  else root.MarcusExport = exporter;
})(typeof self !== 'undefined' ? self : this, function (logic) {
  function choiceFor(question, answer) {
    return question.choices.find((choice) => choice.id === answer.choiceId) || { label: 'No choice saved' };
  }

  function buildDocumentSections(state, content) {
    const questions = content.questions.map((question) => {
      const answer = state.answers[question.id] || logic.blankAnswer();
      const choice = choiceFor(question, answer);
      return {
        number: question.number,
        theme: question.theme,
        title: question.title,
        choice: choice.label,
        prompt: answer.prompt || '',
        response: answer.response || '',
        evidence: (answer.evidence || []).map((item) => ({
          text: item.originalText,
          citation: item.citation
        }))
      };
    });
    return {
      assignmentTitle: content.title,
      student: { ...state.student },
      startedAt: state.startedAt,
      completedAt: state.completedAt || new Date().toISOString(),
      questions,
      path: questions.map((question) => `Q${question.number}: ${question.choice}`)
    };
  }

  function buildSubmissionText(state, content) {
    const document = buildDocumentSections(state, content);
    const lines = [
      document.assignmentTitle.toUpperCase(),
      content.subtitle,
      '',
      `Student: ${document.student.name}`,
      `Student ID: ${document.student.id}`,
      `Started: ${new Date(document.startedAt).toLocaleString()}`,
      `Completed: ${new Date(document.completedAt).toLocaleString()}`,
      '',
      'SUBMISSION'
    ];
    for (const question of document.questions) {
      lines.push(
        '',
        `QUESTION ${question.number} — ${question.title}`,
        `Theme: ${question.theme}`,
        `Interpretive choice: ${question.choice}`,
        `Tailored prompt: ${question.prompt}`,
        '',
        'Response:',
        question.response || '[No response saved]'
      );
      if (question.evidence.length) {
        lines.push('', 'Original source selections:');
        for (const evidence of question.evidence) lines.push(`- “${evidence.text}” (${evidence.citation})`);
      }
    }
    lines.push('', 'INTERPRETIVE PATH', ...document.path.map((item) => `- ${item}`));
    return lines.join('\n');
  }

  function downloadSubmissionPdf(state, content, JsPdfConstructor) {
    const JsPdf = JsPdfConstructor || (typeof window !== 'undefined' && window.jspdf && window.jspdf.jsPDF);
    if (!JsPdf) throw new Error('The PDF generator did not load. Use the plain-text backup below.');
    const document = buildDocumentSections(state, content);
    const pdf = new JsPdf({ unit: 'pt', format: 'a4', compress: true });
    const page = { width: 595.28, height: 841.89, left: 54, right: 54, top: 64, bottom: 54 };
    const bodyWidth = page.width - page.left - page.right;
    let y = page.top;
    let pageNumber = 1;

    function footer() {
      pdf.setDrawColor(180, 90, 60);
      pdf.setLineWidth(0.7);
      pdf.line(page.left, page.height - 38, page.width - page.right, page.height - 38);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Marcus Aurelius: Meditations, Book IV', page.left, page.height - 23);
      pdf.text(String(pageNumber), page.width - page.right, page.height - 23, { align: 'right' });
    }

    function nextPage() {
      footer();
      pdf.addPage();
      pageNumber += 1;
      y = page.top;
    }

    function ensure(height) {
      if (y + height > page.height - page.bottom) nextPage();
    }

    function paragraph(text, options = {}) {
      const size = options.size || 10.5;
      const leading = options.leading || size * 1.45;
      const indent = options.indent || 0;
      pdf.setFont(options.font || 'helvetica', options.style || 'normal');
      pdf.setFontSize(size);
      const lines = pdf.splitTextToSize(String(text || ''), bodyWidth - indent);
      const after = options.after == null ? 7 : options.after;
      const totalHeight = lines.length * leading + after;
      if (options.keepTogether && totalHeight <= page.height - page.top - page.bottom) ensure(totalHeight);
      pdf.setTextColor(...(options.color || [35, 35, 40]));
      for (const line of lines) {
        ensure(leading);
        pdf.text(line, page.left + indent, y);
        y += leading;
      }
      y += after;
    }

    pdf.setFillColor(11, 16, 34);
    pdf.rect(0, 0, page.width, 198, 'F');
    pdf.setTextColor(245, 247, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(25);
    pdf.text('MARCUS AURELIUS', page.left, 82);
    pdf.setFontSize(15);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Meditations, Book IV', page.left, 108);
    pdf.setTextColor(124, 140, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('INTERPRETIVE PRIMARY-SOURCE ASSIGNMENT', page.left, 142);
    y = 240;
    paragraph(`Student: ${document.student.name}`, { font: 'helvetica', style: 'bold', size: 11, after: 3 });
    paragraph(`Student ID: ${document.student.id}`, { font: 'helvetica', size: 10, after: 3 });
    paragraph(`Completed: ${new Date(document.completedAt).toLocaleString()}`, { font: 'helvetica', size: 10, after: 18 });
    paragraph('This submission preserves the student’s interpretive choices, tailored prompts, written responses, and original in-app source selections.', { style: 'italic', size: 11, color: [65, 65, 70], after: 22 });

    for (const question of document.questions) {
      ensure(92);
      pdf.setDrawColor(124, 140, 255);
      pdf.setLineWidth(1.2);
      pdf.line(page.left, y, page.width - page.right, y);
      y += 20;
      paragraph(`QUESTION ${question.number}  /  ${question.theme.toUpperCase()}`, { font: 'helvetica', style: 'bold', size: 8.5, color: [73, 88, 191], after: 2 });
      paragraph(question.title, { style: 'bold', size: 17, color: [20, 22, 28], after: 5 });
      paragraph(`Interpretive choice: ${question.choice}`, { font: 'helvetica', style: 'bold', size: 10, after: 8 });
      paragraph(`Tailored prompt: ${question.prompt}`, { style: 'italic', size: 10, color: [70, 70, 76], after: 11 });
      paragraph(question.response || '[No response saved]', { size: 11, leading: 16.5, after: 12 });
      if (question.evidence.length) {
        ensure(56);
        paragraph('ORIGINAL SOURCE SELECTIONS', { font: 'helvetica', style: 'bold', size: 8, color: [73, 88, 191], after: 3 });
        for (const evidence of question.evidence) {
          paragraph(`“${evidence.text}” (${evidence.citation})`, { style: 'italic', size: 9.5, indent: 12, color: [72, 72, 78], after: 6, keepTogether: true });
        }
      }
      y += 10;
    }

    ensure(130);
    pdf.setDrawColor(124, 140, 255);
    pdf.line(page.left, y, page.width - page.right, y);
    y += 24;
    paragraph('INTERPRETIVE PATH', { font: 'helvetica', style: 'bold', size: 9, color: [73, 88, 191], after: 8 });
    for (const item of document.path) paragraph(item, { font: 'helvetica', size: 10, indent: 12, after: 2 });
    footer();

    const filename = logic.submissionFilename(document.student);
    pdf.save(filename);
    return filename;
  }

  function downloadPlainText(state, content) {
    if (typeof document === 'undefined') return null;
    const blob = new Blob([buildSubmissionText(state, content)], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = logic.submissionFilename(state.student).replace(/\.pdf$/, '.txt');
    link.click();
    URL.revokeObjectURL(link.href);
    return link.download;
  }

  return { buildDocumentSections, buildSubmissionText, downloadSubmissionPdf, downloadPlainText };
});
