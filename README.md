# Marcus Aurelius: Emperor, Stoic, Citizen

A standalone primary-source assignment for an introductory Roman history course. Students make eight interpretive choices, defend them with evidence from a verified C. R. Haines dossier, and download one PDF for normal course submission.

**Live app:** https://chlodomer.github.io/marcus-aurelius-stoic-citizen/

## Open the local preview

The simplest reliable preview is to serve the folder locally:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/` in a browser. There is no build step and no student installation.

For a permanent class link, upload the folder to a static host such as GitHub Pages. Keep `index.html`, `styles.css`, `src/`, `vendor/`, and `Marcus Aurelius.pdf` together.

## What the app does

- Three short onboarding screens, including a practice quotation interaction.
- Eight braided questions: every student addresses the same themes, while each choice opens a different writing prompt.
- A scan-checked Haines source dossier with search, book filters, pointer text selection, and keyboard quotation buttons.
- Automatic browser saving after meaningful changes.
- A review screen that identifies incomplete answers or missing evidence.
- Offline PDF generation through a locally bundled copy of jsPDF.
- A complete plain-text backup if PDF generation fails.

## Student data

The site has no server, user account, analytics, or automated grading. Name, student ID, choices, responses, and source selections are stored only in the current browser’s local storage. Nothing leaves the device until the student uploads the downloaded submission through the course system.

Private browsing, clearing browser data, or switching devices can remove or hide saved progress. Students should use one ordinary browser on one device and download the final submission before the deadline.

## Source provenance

The in-app dossier is drawn from Marcus Aurelius, *The Communings with Himself*, translated by C. R. Haines (1916). The local scan is `Marcus Aurelius.pdf`. Wikisource helped locate candidate passages; displayed text, citations, and focused keyboard excerpts were checked against the scan. See `docs/SOURCE-VERIFICATION.md` for the audit map.

## Verification

Run the automated checks from this folder:

```bash
node --test tests/*.test.js
```

Before assigning the work, complete one pilot submission in each browser your students commonly use. In particular, check mobile text selection in Safari and Chrome because text-selection behavior is partly controlled by the browser and operating system.

The vendored PDF library is jsPDF 4.2.1. Its license is included at `vendor/jspdf-LICENSE.txt`.
