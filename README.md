# SLP · Sift. Learn. Plan.

An age-coverage atlas and figure-first spec sheet for speech-language pathology assessments. Twenty standardized tests, 325 evidence records, and a source behind every number.

## Live demo

https://ethanheinrick01-ctrl.github.io/SLP-Assessment-Website/

## What it does

- **Atlas.** Every assessment on one axis, grouped by clinical family, with a layer picker for age coverage, diagnostic accuracy, reliability, cutoff, time, and norm sample. Enter a client's age and the tests that do not cover it dim; filter by clinical area, purpose, administration time, family, or search.
- **Spec sheet.** Each test leads with its figures: age range, administration time, reliability on a .70–1.00 meter, norm sample size, and sensitivity/specificity bars. Every figure opens its evidence record (method, population, sample, cutoff, page location, date checked, cited sources).
- **Profile, compare, shortlist, brief.** A dossier per test, a side-by-side comparison on shared scales, a saved shortlist, and HTML/Markdown/print exports with numbered sources.
- **Evidence ledger.** All 325 records and their sources, with ASHA Practice Portal and Evidence Map context for seven clinical areas.
- Light and dark themes. Fonts (Newsreader, Public Sans, IBM Plex Mono) are bundled locally under the SIL OFL; the site runs offline.

## Run locally

```sh
python3 serve.py --port 8804
```

Open http://127.0.0.1:8804/docs/. No dependencies, accounts, or API keys. GitHub Pages serves the static files in `docs` from the `main` branch.

Data check: `python3 tests/validate-data.py`. Syntax check (if Node is installed): `node --check docs/data.js docs/app.js`.

## Files

- `docs/index.html`, `docs/styles.css` — page and theme (dark-first with a full light theme; clinical-family palette validated for color-vision deficiency in both modes).
- `docs/data.js` — catalog assembly, evidence helpers, ASHA guidance matching, brief exports.
- `docs/app.js` — atlas chart, spec sheet, profile dossier, evidence records, comparison, ledger, shortlist.
- `docs/*.json` — assessment and guidance data. `docs/research/` — source registers and the October 3, 2026 audit.
- `docs/assets/fonts/` — bundled fonts and licenses.

## Evidence and limits

An educational proof of concept prepared for LSU faculty review; not an LSU- or ASHA-endorsed resource. A source check confirms what a source reports and does not establish clinical suitability. Figures keep their edition, sample, method, and population context; missing values stay missing and source disagreements stay visible. No protected test items, examiner manuals, norm tables, or patient data are included.

Created by Ethan Heinrick.
