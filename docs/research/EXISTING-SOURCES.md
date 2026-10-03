> Current numerical review: [Primary-agent personal audit, October 3, 2026](PERSONAL-AUDIT.md). The older findings below remain historical and are superseded where they differ.

# Existing assessment source receipts

Checked on October 2, 2026 for the local v2 demo. This pass adds explicit evidence records for the six existing tests. Original `site/research.json` and `site/app.js` were read; neither was edited by this research task.

The machine-readable result is `site/evidence-existing.json`. Each record carries its method, score/task, population, sample, cutoff, locator, date, and evidence status where available. A null field means that detail was not established. “Source-checked” means the cited claim was inspected; it does not mean independent clinical validation or inspection of every manual page.

## Publisher and review receipts

| Test | Public source inspected | Locator and source date |
|---|---|---|
| PPVT-5 | [Pearson product overview](https://www.pearsonassessments.com/store/en/usd/p/100001984.html) | Overview and product description; page undated. Product release 2018 and recommended citation 2019 remain distinct. |
| PPVT-5 | [Pearson By the Numbers](https://www.pearsonclinical.co.uk/content/dam/school/global/clinical/uk-clinical/assets/ppvt-5/PPVT5-EVT3-By-the-Numbers-Infographic.pdf) | PDF pp. 1–2, footer December 2019. Rendered p. 2 inspected. |
| PPVT-5 | [Canivez review](https://www.ux1.eiu.edu/~glcanivez/Adobe%20pdf/Publications-Papers/Canivez%20%282021%29%20Buros%20MMY%20PPVT-5%20Review.pdf) | Printed pp. 525–526, PDF pp. 3–4, 2021. Scanned pages rendered and visually read. |
| CELF-5 | [Pearson U.S. product overview](https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Speech-%26-Language/Clinical-Evaluation-of-Language-Fundamentals-%7C-Fifth-Edition/p/100000705) | Overview; page undated; test edition Fall 2013. |
| CELF-5 | [Pearson technical infographic](https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/celf-5/8439-A_CELF-5_Infographic_Hr_f.jpg) | Reliability, Validity and Demographics panels; image undated; downloaded image visually inspected. |
| CELF-5 | [Determining severity](https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/celf-5/celf-5-determining-the-severity-of-a-lang-disorder.pdf) | PDF p. 3, footer May 2013. |
| PLS-5 | [Pearson U.S. English product overview](https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Speech-%26-Language/Preschool-Language-Scales-%7C-Fifth-Edition/p/100000233?Community=CA_MedOT_AI_Screen&pid=PLS-5) | Overview/FAQs; page undated; English edition 2011. |
| PLS-5 | [Pearson brochure](https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/pls5/pls-5-brochure.pdf) | PDF pp. 2–6, footer March 2019. |
| PLS-5 | [Castilleja publisher presentation, public mirror](https://manuals.plus/m/add3c5a8e25b0608b417b0f2a04baf8cc9e441fb974190bb85c42622f20b5a30.pdf) | Slides 6, 30, 41–45. Author/publisher are identified in the document. Undated prepublication deck; inherited ©2007 slide-master footer is not treated as its publication date. Last slide advertises April 2011 prepublication pricing. |
| PLS-5 | [LEADERSproject manual review](https://bpb-us-w2.wpmucdn.com/edblogs.columbia.edu/dist/e/748/files/2015/05/PLS5-English-finaldraft-2dgptop.pdf) | Review pp. 5–10. Document date not established; May 2015 upload path is not a publication date. [Current landing page](https://leadersproject.org/en/page/pls-5-english) is dated November 11, 2025, which does not date the older PDF. |
| GFTA-3 | [Pearson U.S. product overview](https://www.pearsonassessments.com/store/usd/p/100001202.html) | Overview, Features and Research FAQ; page undated; edition 2015. |
| GFTA-3 | [Pearson technical infographic](https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/gfta-3/gfta-3-infographic.pdf) | Single-page PDF, footer March 2019; rendered page visually inspected. |
| GFTA-3 | [Pearson edition comparison](https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/gfta-3/GFTA-2-GFTA-3-Comp-FLY.pdf) | GFTA-3 Test Format column; source publication date not established. |
| KLPA-3 | [Pearson U.S. product overview](https://www.pearsonassessments.com/store/en/usd/p/100001242.html) | Overview and Features; page undated; edition 2015. |
| KLPA-3 | [Pearson technical infographic](https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/klpa/klpa-3-technical-summary.pdf) | Single-page PDF, footer April 2019; rendered page visually inspected. |
| CAAP-2 | [PRO-ED product overview](https://proedinc.com/products-15000.html) | Age/time, target tasks and reliability paragraph; page undated, test ©2014. |
| CAAP-2 | [Johnson publisher training](https://gsa.memberclicks.net/assets/documents/2014-Convention/Handouts/clint%20johnson%20handout%20-%20caap.pdf) | PDF pp. 2, 4–5; GSHA 2014, Super Duper employee presenter. |

## Retained data and supported changes

- PPVT-5: retain the publisher overall and retest summaries. The review supplies a method-specific split-half estimate, which can fill the former unknown method. Keep the two retest summaries visibly separate. The publisher's last validity table reports negative predictive power; it cannot supply a specificity value.
- CELF-5: retain internal consistency, Core/Index retest, norms and cutoff-80 accuracy. Replace the former missing-rater label with the four named inter-scorer coefficients in the infographic. The brief sources omit validation sample size.
- PLS-5: retain the current product-page time for filtering while noting the different brochure range. Preserve inherited internal consistency rather than pretending its aggregation matches the review. The detailed publisher inter-rater table and the review agree, while the deck's earlier overview differs. Retest sample counts differ between the prepublication deck and review. Accuracy age labels also differ within/across those sources.
- GFTA-3: retain existing numbers. Add task/sex details and the publisher's bilingual-norm inclusion criteria. The diagnostic table explicitly applies to Sounds-in-Words; adjacent group-difference age labels do not supply table-specific validation sample details.
- KLPA-3: retain its alpha, rater, norms and accuracy values. Flag the retest panel's word/sentence labels as unresolved. The nearby ages 4:0–8:11 label accompanies the clinical mean-difference study, so it is not silently attached to diagnostic accuracy.
- CAAP-2: retain age/time/norms. Replace the generic rater range with the training's task-specific coefficients. Retest significance is retained as significance, with no invented coefficient. Concurrent correlations are not sensitivity/specificity.

## Unknowns and inherited evidence

No complete examiner or technical manual was inspected in this pass. The PLS-5 [Buzhardt study](https://doi.org/10.1177/0014402920938003), p. 81, remains an inherited quotation of manual estimates from the prior audit; its intervention results are not an independent diagnostic validation. PPVT-5's exact picture-selection description remains inherited from the original 2019 training-handout audit.

Unresolved manual checks: PPVT source aggregation differences; PLS internal-consistency aggregation, source sample differences and exact accuracy-age range; KLPA retest labels; GFTA/KLPA/CELF validation sample sizes and table-specific ages. No accessible independent CAAP-2 accuracy study was established by the targeted search; CAAP-1 estimates were not imported.

Temporary source downloads and renders were placed outside the deliverable in `/tmp/slp-existing-evidence`. The JSON was checked for parseability, allowed status values, source references and the six required assessment IDs. No public repository or deployment was changed.

