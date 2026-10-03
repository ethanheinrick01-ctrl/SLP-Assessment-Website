> Current numerical review: [Primary-agent personal audit, October 3, 2026](PERSONAL-AUDIT.md). The older findings below remain historical and are superseded where they differ.

# Local build research review

Prepared October 2, 2026 (America/Chicago). This is a local review copy. The public repository and GitHub Pages demo have not been changed.

## What is ready to try

- **11 assessments:** the six accepted entries plus TNL-2, OASES, WAB-R, CLQT+, and CADL-3.
- **ASHA context:** seven Practice Portal / Evidence Map topics, with selective evaluation considerations beside relevant results and saved shortlists.
- **Evidence records:** every displayed statistic can open its method, edition/task, population, sample, cutoff, source location, date checked, and unresolved differences.
- **Planning workflow:** search an assessment, filter by clinical area/age/purpose/time, save multiple candidates, choose two to compare, and prepare a source-linked brief.
- **Windows-inspired interface:** compact sidebar, restrained dark surfaces, fewer introductory elements, consistent tables and dialog layouts.

A shortlist is an organizational tool. It does not certify that an assessment is appropriate for a particular client or constitute a completed evaluation.

## What ASHA contributes

ASHA informs the evaluation context: case history, communication in everyday settings, language and dialect, hearing information, observation, language sampling, dynamic assessment, and participation where relevant. Each topic links directly to its Practice Portal and Evidence Map.

The publisher supplies edition and administration specifications. Publisher technical summaries, original research, and independent manual reviews supply different kinds of statistical evidence. An ASHA link beside a test does not mean ASHA endorsed the test, the website, or its numbers. Evidence Map landing pages were verified; their entire study databases were not audited.

## The distinctions to review first

| Entry | What the build displays | What LSU/manual review needs to settle |
|---|---|---|
| PPVT-5 | Publisher overall .97 and retest .88; review split-half .94–.98 and retest mean .84 are separated. | Exact aggregation differences and diagnostic accuracy with matched population/cutoff. |
| CELF-5 | Internal consistency .75–.98, Core/Index retest .83–.90, four scorer coefficients .91–.99, publisher accuracy .97/.97 at cutoff 80. | Validation sample size and table-specific group details omitted from the public summaries. |
| PLS-5 | Internal consistency .80–.97 retained with its source limits; retest .86–.95; scorer measures separated; .83/.80 accuracy at cutoff 85 flagged. | Public sources disagree on accuracy ages, samples, and aggregation. The group-selection/reference-standard concerns in the independent review remain. |
| GFTA-3 | Words/sentences and sex-specific alpha values, task-specific retest, publisher accuracy .91/.81 at cutoff 85. | Exact accuracy sample and age group. Bilingual inclusion does not establish validity for every language background. |
| KLPA-3 | Overall alpha .94 female/.95 male, age-level ranges, rater .96–1.00. | The public retest graphic uses word/sentence labels that need manual reconciliation. |
| CAAP-2 | Inventory rater 1.00 / checklist >.99; clinical focus, norms and time. | Retest p < .01 is significance, not a reliability coefficient. No matched accuracy pair was verified. |
| TNL-2 | Alpha .81 comprehension/.87 production reported by primary research; item agreement 90.65–93.84%. | Publisher product page and current catalog conflict on minimum age 4 versus 5. Check the applicable manual for a 4-year-old. |
| OASES | Historical adult development alpha .92–.97; adult retest .90–.97 in n14 over 10–14 days. | Current S/T/A form-specific evidence. The 2006 adult results cannot be assigned to every present form or translation. |
| WAB-R | AQ administration-mode concordance .942 in a small PPA study; 77%/64% accuracy at AQ 93.7 in 171 acute-stroke patients. | These are study-specific results, not universal reliability or accuracy. Verify current same-mode manual coefficients and local population fit. |
| CLQT+ | Criterion-based cognitive/language profile, administration pathways, age/time and development samples. | No exact coefficient or matched accuracy pair was verified in the inspected public official sources. |
| CADL-3 | Publisher alpha .94 and retest .94; norms include 115 adults with neurogenic communication disorders. | Retest sample/interval/method are not reported on that page. n115 is the norm sample and is not automatically the retest sample. |

Missing values stay explicit rather than being made up or represented as zero. The interface can look complete while documenting the limits of the available evidence.

## How LSU data can replace a value

1. Identify the edition, form, language and task/score first.
2. Update the record's value and source IDs together; keep the manual page/table locator.
3. Preserve the method, population, sample, cutoff and review date. A new number without these details is not a complete replacement.
4. Reconcile conflicting public summaries, or retain both with an explanation if they describe different analyses.
5. Update any compact display fields in the assessment record, then run `python3 tests/validate-data.py` and check the card, comparison, receipt, and exported brief in the browser.

No private manuals, answer keys, patient information, or class packet files are included. When faculty materials arrive, store their source locations locally and decide separately which claims may appear in a public demo.

## Read the source receipts

- [Existing six assessments](EXISTING-SOURCES.md)
- [Five added assessments](EXPANSION-SOURCES.md)
- [ASHA guidance and study context](ASHA-SOURCES.md)
- [All source links](SOURCE-REGISTER.md)

## Data files

- `site/research.json`: original three-test, 24-question research retained.
- `site/evidence-existing.json`: detailed evidence records and corrections for the original six entries.
- `site/expanded-assessments.json`: added assessment records and their evidence.
- `site/asha-guidance.json`: topic guidance, source links, and a separately labeled research card.

Source dates are recorded only when established. An undated webpage is not assigned a date from its copyright footer, URL path, or test release year. The check date is separate from publication and edition dates.
