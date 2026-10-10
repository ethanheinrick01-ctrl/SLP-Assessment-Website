# SLP · Sift. Learn. Plan.

A local website for speech-language pathology assessment research, comparison, and planning. It opens with an age-coverage atlas of every assessment on one axis, follows with a spec sheet where each test leads with its figures (age, time, reliability on a .70–1.00 meter, norm sample, sensitivity/specificity), and keeps an evidence record behind every number.

## What is included

- 25 assessment profiles covering language, early language, speech and apraxia, Spanish editions, adult communication, and fluency.
- 398 structured evidence records, 122 linked publisher/research/review sources, and seven ASHA guidance areas.
- The Atlas: enter a client's age and the chart shows which assessments cover it; filter by clinical area, purpose, time, family, or search. Dimmed bars stay visible so coverage gaps are obvious.
- A saved shortlist and a side-by-side comparison that puts both tests' reliability and accuracy on the same scales.
- Light and dark themes (toggle in the header; follows the system by default).
- Detailed evidence panels and source receipts, plus HTML/Markdown exports and printable PDF briefs through your browser.
- All website code, data, local fonts, font licenses, and research audit notes.

## Run the website

You need Python 3 and a modern browser. No installation of JavaScript packages, account, paid API, or build step is required.

1. Extract this ZIP and open a terminal in its extracted folder.
2. Run:

   ```sh
   python3 serve.py --port 8804
   ```

3. Open **http://127.0.0.1:8804/site/** in your browser.
4. Press **Ctrl+C** in the terminal to stop the server.

If that port is occupied, choose another number in the command and browser address. The server binds only to your computer. Run the server instead of double-clicking index.html: the website loads its JSON data through HTTP.

The core website and fonts are included locally. Opening external publisher and research links requires internet access.

## Saved information

The shortlist and comparison selection are saved in your browser under the key `slp-shortlist-v2`; the theme choice under `slp-theme`. Different browser profiles, hostnames, or ports may have separate saved state. This package does not contain your browser's saved shortlist or other personal browser information.

## Research and limits

The primary agent personally reviewed sources for all assessments on October 3, 2026, and re-audited every unreported figure on October 10, 2026 (`research/HOLE-AUDIT-2026-10-10.md`). See `research/PERSONAL-AUDIT.md` for the running audit; it supersedes older research notes where stated.

This is an educational reference and planning tool. It does not replace examiner manuals or establish clinical suitability by itself. Reported figures retain their edition, sample, method, and population context where available. Some source conflicts and unavailable details remain explicitly marked. Publisher pages and product availability can change after the audit date.

No protected test items, examiner manuals, norm conversion tables, patient data, or private course packets are included.

## Files

- `site/index.html` — main page.
- `site/styles.css` — layout, typography (Newsreader, Public Sans, IBM Plex Mono), light and dark themes, and clinical-family colors.
- `site/data.js` — catalog assembly, evidence helpers, ASHA guidance matching, and brief exports.
- `site/app.js` — the interface: atlas chart, spec sheet, profile dossier, evidence records, comparison, ledger, shortlist.
- `site/*.json` — assessment and guidance data.
- `site/assets/` — favicon, local fonts (SIL OFL), and their licenses/source information in `assets/fonts/SOURCES.md`.
- `research/` — source registers and audit notes linked by the website.
- `serve.py` — Python standard-library local server.
- `tests/validate-data.py` — data consistency and known clinical-context checks.

Optional data check from the package folder:

```sh
python3 tests/validate-data.py
```

If Node.js is already installed, you can also check JavaScript syntax with `node --check site/data.js site/app.js`. Node.js is not required to run the website.

This is a portable copy of the completed local redesign. It has not been published or deployed by packaging it.
