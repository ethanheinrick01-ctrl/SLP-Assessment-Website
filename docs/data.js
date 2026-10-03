// data.js — catalog assembly, evidence helpers, ASHA guidance, and brief exports.
// The interface lives in app.js. Keep storage key slp-shortlist-v2 stable.

const DOMAINS = [
  ["speech-sound", "Speech sound / articulation"],
  ["receptive", "Receptive language"],
  ["expressive", "Expressive language"],
  ["vocabulary", "Vocabulary"],
  ["phonology", "Phonology"],
  ["apraxia", "Motor speech / apraxia"],
  ["developmental", "Early development"],
  ["narrative", "Narrative language"], ["fluency", "Fluency / stuttering"],
  ["aphasia", "Aphasia"], ["cognition", "Cognitive communication"], ["functional", "Functional communication"]
];

const PURPOSES = [
  ["diagnostic", "Diagnostic evaluation"],
  ["comprehensive", "Broad profile"],
  ["supplemental", "Focused measure"], ["impact", "Participation / impact"]
];

const PREVIEW_TESTS = [
  {
    id: "GFTA-3",
    name: "Goldman-Fristoe Test of Articulation, Third Edition",
    scope: "Speech sound production",
    domains: ["speech-sound"],
    purposes: ["diagnostic", "supplemental"],
    ageMin: 24,
    ageMax: 263,
    age: "2:0–21:11",
    timeMin: 5,
    timeMax: 15,
    time: "5–15 min",
    focus: "Production of consonants in words and connected speech, plus intelligibility and stimulability information.",
    reliability: ".94–.97 internal consistency",
    retest: ".92 words · .91 sentences",
    accuracy: "91% sensitivity / 81% specificity · cutoff 85 · Sounds-in-Words",
    norms: "N = 1,500 · ages 2–21 · 39 U.S. states",
    author: "Ronald Goldman and Macalyne Fristoe",
    publisher: "Pearson", edition: "Third edition · 2015",
    administration: "Individual. Sounds-in-Words takes 5–15 minutes; additional tasks take extra time.",
    materials: "Manual, stimulus book, and record form; digital options available.",
    qualification: "Pearson Level B",
    technical: {label: "Pearson technical summary · p. 1", url: "https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/gfta-3/gfta-3-infographic.pdf#page=1"},
    language: "Dialect-sensitive scoring for several American English dialects and English influenced by other languages.",
    evidence: "Publisher technical summary · checked September 17, 2026",
    source: {
      label: "Pearson · GFTA-3 overview",
      url: "https://www.pearsonassessments.com/store/usd/p/100001202.html"
    }
  },
  {
    id: "KLPA-3",
    name: "Khan-Lewis Phonological Analysis, Third Edition",
    scope: "Phonological processes",
    domains: ["speech-sound", "phonology"],
    purposes: ["diagnostic", "supplemental"],
    ageMin: 24,
    ageMax: 263,
    age: "2:0–21:11",
    timeMin: 10,
    timeMax: 30,
    time: "10–30 min",
    focus: "Analyzes GFTA-3 responses to determine whether phonological processes contribute to a speech sound disorder.",
    reliability: ".94 females / .95 males · overall alpha",
    retest: ".92–.93 · publisher summary",
    accuracy: "93% sensitivity / 83% specificity · cutoff 85 · publisher estimates",
    norms: "N = 1,500 · ages 2–21 · 39 U.S. states",
    author: "Linda M. L. Khan and Nancy P. Lewis",
    publisher: "Pearson", edition: "Third edition · 2015",
    administration: "Analyzes the GFTA-3 response sample; it is not a separate picture-naming test.",
    materials: "GFTA-3 responses, analysis form, Sound Change Booklet, and manual; digital scoring available.",
    qualification: "Pearson Level B",
    technical: {label: "Pearson technical summary · p. 1", url: "https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/klpa/klpa-3-technical-summary.pdf#page=1"},
    language: "Interpretation depends on the speech sample and the language or dialect represented.",
    evidence: "Publisher technical summary · checked September 17, 2026",
    source: {
      label: "Pearson · KLPA-3 overview",
      url: "https://www.pearsonassessments.com/store/en/usd/p/100001242.html"
    }
  },
  {
    id: "CAAP-2",
    name: "Clinical Assessment of Articulation and Phonology, Second Edition",
    scope: "Articulation and phonology",
    domains: ["speech-sound", "phonology"],
    purposes: ["diagnostic", "supplemental"],
    ageMin: 30,
    ageMax: 143,
    age: "2:6–11:11",
    timeMin: 15,
    timeMax: 20,
    time: "15–20 min",
    focus: "An individual assessment of articulation and phonological processes for children.",
    reliability: ">.99 inter-rater agreement",
    retest: "Significant at p < .01; coefficient not given in publisher handout",
    accuracy: "Not specified in the cited publisher sources",
    norms: "N = 1,486 · U.S. children · 2013 Census targets",
    author: "Wayne A. Secord and JoAnn S. Donohue",
    publisher: "PRO-ED · originally Super Duper Publications", edition: "Second edition · ©2014",
    administration: "Individual. Articulation Inventory: 15–20 minutes. Sentence task for ages 5 and older.",
    materials: "Examiner’s manual, stimulus easel, articulation forms, and phonological process forms.",
    qualification: "Restricted product; publisher qualification policy applies.",
    technical: {label: "PRO-ED catalog · p. 84", url: "https://publications.proedsoftware.com/view/1000385236/84/"},
    retestSource: {label: "Publisher training · p. 2", url: "https://gsa.memberclicks.net/assets/documents/2014-Convention/Handouts/clint%20johnson%20handout%20-%20caap.pdf#page=2"},
    language: "Full language and dialect guidance requires the examiner’s manual.",
    evidence: "Publisher catalog and training · checked September 17, 2026",
    source: {
      label: "PRO-ED · CAAP-2 overview",
      url: "https://proedinc.com/products-15000.html"
    }
  }
];

const state = {
  domains: new Set(),
  purposes: new Set(),
  selected: [],
  compareIds: [],
  guidance: [],
  ageMonths: null,
  maxTime: null,
  query: "",
  category: "all",
  layout: "list",
  view: "library",
  catalog: []
};

const CLINICAL_FIT = {
  "PPVT-5": {internal:"Method not specified in the publisher’s .97 overall summary",overall:".97 · publisher overall summary",rater:"Not reported in cited summaries",response:"Point to a picture or say its number; no picture naming.",population:"English used most often; 2.6% of norm sample bilingual.",limit:"Vocabulary only; use within a broader language evaluation.",accuracyContext:"Multiple clinical groups and cutoffs; a matched accuracy pair is not available in cited summaries."},
  "CELF-5": {internal:".75–.98 · across tests",overall:"See method-specific estimates",rater:"Not reported in cited summaries",response:"Point, follow directions, repeat or formulate sentences; reading/writing depends on subtests.",population:"U.S. English edition; 2,380 students in 47 states.",limit:"English scores alone cannot establish disorder in multilingual students.",accuracyContext:"Cutoff 80 (−1.33 SD) · publisher language-disorder validation study; not a universal estimate."},
  "PLS-5": {internal:".80–.97 · split-half",overall:"See method-specific estimates",rater:"Not reported in cited summaries",response:"Point, use objects, or speak; selected early items allow observation/caregiver report.",population:"U.S. English edition; English-primary norm sample.",limit:"Translating items does not preserve English norms.",accuracyContext:"Cutoff 85 (−1 SD) · language-disorder group, ages 3:11–7:11; group-selection concerns noted in review."},
  "GFTA-3": {internal:".94–.97 · alpha across tasks and sex groups",overall:"See method-specific estimates",rater:"Not reported in cited technical summary",response:"Produce speech in words and sentences.",population:"U.S. sample, ages 2–21; dialect-sensitive scoring.",limit:"Speech production measure; additional tasks extend the quoted word-task time.",accuracyContext:"Cutoff 85 (−1 SD) · Sounds-in-Words · publisher speech-sound-disorder validation estimates."},
  "KLPA-3": {internal:".94 females / .95 males · overall alpha",overall:"See method-specific estimates",rater:".96–1.00 · core processes",response:"Uses the existing GFTA-3 speech sample.",population:"U.S. normative sample of 1,500, ages 2–21.",limit:"Requires GFTA-3 responses; assesses phonological processes.",accuracyContext:"Cutoff 85 (−1 SD) · publisher validation estimates; summary does not identify the accuracy-table sample’s age range."},
  "CAAP-2": {internal:"Not reported in cited publisher sources",overall:"See method-specific estimates",rater:">.99 · inter-rater agreement",response:"Picture naming; sentence repetition for ages 5 and older.",population:"U.S. children; sample aligned with 2013 Census targets.",limit:"Published overview does not provide a diagnostic-accuracy pair.",accuracyContext:"Matched sensitivity, specificity, cutoff, and validation group not supplied in cited sources."}
};

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[character]));
}

function sourceLink(source, label) {
  if (!source?.url) return `<span class="source-link offline">${escapeHTML(label || "Course manual")} · offline</span>`;
  return `<a class="source-link" href="${escapeHTML(source.url)}" title="${escapeHTML(source.label || source.reference || label || "Original source")}" target="_blank" rel="noopener noreferrer">${escapeHTML(label || "Open source")} ${uiIcon("external")}</a>`;
}

function verifiedCatalog(research) {
  const configs = {
    "PPVT-5": {
      scope: "Receptive vocabulary",
      domains: ["receptive", "vocabulary"],
      purposes: ["supplemental"],
      ageMin: 30, ageMax: null, age: "2:6–90+",
      timeMin: 10, timeMax: 15, time: "10–15 min",
      reliability: ".97 overall",
      retest: ".88 publisher summary; independent review reports mean .84",
      accuracy: "Matched sensitivity/specificity pair not confirmed publicly",
      norms: "N = 2,720",
      publisher: "Pearson", edition: "Fifth edition · 2018 release, cited 2019",
      sourceIndex: 3
    },
    "CELF-5": {
      scope: "Broad school-age language",
      domains: ["receptive", "expressive"],
      purposes: ["diagnostic", "comprehensive"],
      ageMin: 60, ageMax: 263, age: "5:0–21:11",
      timeMin: 30, timeMax: 45, time: "30–45 min · core",
      reliability: ".75–.98 internal consistency",
      retest: ".83–.90 for Core and Index scores",
      accuracy: ".97 sensitivity / .97 specificity · cutoff 80",
      norms: "N = 2,380",
      publisher: "Pearson", edition: "Fifth edition · 2013",
      sourceIndex: 1
    },
    "PLS-5": {
      scope: "Early receptive and expressive language",
      domains: ["receptive", "expressive"],
      purposes: ["diagnostic", "comprehensive"],
      ageMin: 0, ageMax: 95, age: "Birth–7:11",
      timeMin: 45, timeMax: 60, time: "45–60 min",
      reliability: ".80–.97 split-half summary",
      retest: ".86–.95 across AC, EC, and Total Language",
      accuracy: ".83 sensitivity / .80 specificity · cutoff 85 · LD group",
      norms: "N = 1,400",
      publisher: "Pearson", edition: "Fifth edition · 2011 · U.S. English",
      sourceIndex: 4
    }
  };
  return research.assessments.map(assessment => {
    const config = configs[assessment.id];
    return {
      ...config,
      id: assessment.id,
      name: assessment.questions[0].answer.split(" (")[0],
      focus: assessment.questions[7].answer,
      language: assessment.questions[15].answer,
      evidence: "Full 24-field source audit",
      verified: true,
      assessment,
      source: assessment.sources[config.sourceIndex]
    };
  });
}

function matches(test) {
  const domainMatch = !state.domains.size || test.domains.some(domain => state.domains.has(domain));
  const purposeMatch = !state.purposes.size || test.purposes.some(purpose => state.purposes.has(purpose));
  const ageMatch = state.ageMonths === null || (state.ageMonths >= test.ageMin && (test.ageMax == null || state.ageMonths <= test.ageMax));
  const timeMatch = state.maxTime === null || test.timeMax != null && test.timeMax <= state.maxTime;
  return domainMatch && purposeMatch && ageMatch && timeMatch;
}

function reasonFor(test) {
  const reasons = [];
  if (state.domains.size) {
    const matched = test.domains.find(domain => state.domains.has(domain));
    reasons.push(DOMAINS.find(([value]) => value === matched)?.[1]);
  }
  if (state.ageMonths !== null) reasons.push(`covers age ${Math.floor(state.ageMonths / 12)}:${String(state.ageMonths % 12).padStart(2, "0")}`);
  if (state.maxTime !== null) reasons.push(`quoted task ≤ ${state.maxTime} min`);
  return reasons.length ? reasons.join(" · ") : test.scope;
}

const FAMILIES = [
  ["all", "All assessments"],
  ["language", "Language & vocabulary"],
  ["early", "Early language"],
  ["speech", "Speech & apraxia"],
  ["spanish", "Spanish editions"],
  ["adult", "Adult communication"],
  ["fluency", "Fluency"]
];

function testFamily(test) {
  if (test.id.endsWith("-Spanish")) return "spanish";
  if (["PLS-5", "REEL-4", "Bayley-III"].includes(test.id)) return "early";
  if (test.domains.includes("fluency")) return "fluency";
  if (test.domains.some(d => ["aphasia", "cognition", "functional"].includes(d))) return "adult";
  if (test.domains.includes("speech-sound")) return "speech";
  return "language";
}

const STATUS = {
  "source-checked": {cls: "checked", label: "Source-checked"},
  conflicting: {cls: "differs", label: "Sources differ"},
  "not-reported": {cls: "gaps", label: "Not reported"},
  inherited: {cls: "inherited", label: "Carried forward"}
};

function recordStatus(test, key) { const record = test.records.find(r => r.key === key); return STATUS[record?.status] || STATUS["not-reported"]; }

function testStatus(test) {
  const conflicting = test.records.some(r => r.status === "conflicting");
  return conflicting ? {cls: "differs", label: "Sources differ"} : {cls: "checked", label: "Source-checked"};
}

function familyOf(test) { const family = testFamily(test); return {family, label: FAMILIES.find(([id]) => id === family)[1]}; }

function reliabilityKeyFor(test) { return test.reliabilityRecordKey || (test.id === "CAAP-2" ? "rater" : ["PPVT-5","WAB-R"].includes(test.id) ? "overall" : "internal"); }

function reliabilityValueFor(test) { return ["OASES","CADL-3"].includes(test.id) ? test.internal : test.reliability; }

function longDate(iso) { return iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", {month:"long",day:"numeric",year:"numeric"}) : ""; }

function activeSummary() {
  const parts = [];
  if (state.domains.size) parts.push([...state.domains].map(value => DOMAINS.find(item => item[0] === value)?.[1]).join(" or "));
  if (state.purposes.size) parts.push([...state.purposes].map(value => PURPOSES.find(item => item[0] === value)?.[1]).join(" or "));
  if (state.ageMonths !== null) parts.push(`age ${Math.floor(state.ageMonths / 12)}:${String(state.ageMonths % 12).padStart(2, "0")}`);
  if (state.maxTime !== null) parts.push(`≤ ${state.maxTime} min`);
  return parts.length ? parts.join(" · ") : "Showing the full index";
}

function saveSelection() {
  try { localStorage.setItem("slp-shortlist-v2", JSON.stringify({selected:state.selected,compareIds:state.compareIds})); } catch { toast("Browser storage is unavailable. Your shortlist is available for this visit."); }
}

function toast(message) { const element = document.querySelector("#toast"); element.textContent = message; element.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => element.hidden = true, 3500); }

function toggleSelected(id) {
  if (state.selected.includes(id)) { state.selected = state.selected.filter(x => x !== id); state.compareIds = state.compareIds.filter(x => x !== id); }
  else state.selected.push(id);
  saveSelection(); renderCatalog();
}

function toggleComparison(id) {
  if (state.compareIds.includes(id)) state.compareIds = state.compareIds.filter(x => x !== id);
  else {
    if (state.compareIds.length >= 2) { toast("Remove one test from comparison before choosing another."); return; }
    if (!state.selected.includes(id)) state.selected.push(id);
    state.compareIds.push(id);
  }
  saveSelection(); renderCatalog();
}

const COMPARE_ROWS = [
  ["Clinical focus", "scope"],
  ["Age range", "age"],
  ["Administration time", "time"],
  ["Internal consistency", "internal"],
  ["Test–retest", "retest"],
  ["Inter-rater / scorer agreement", "rater"],
  ["Other reliability summary", "overall"],
  ["Diagnostic accuracy", "accuracy"],
  ["Normative sample", "norms"],
  ["Language and dialect", "language"],
  ["Evidence status", "evidence"]
];

function metricSources(test, key) {
  const record = test.records.find(r => r.key === key);
  if (record) return record.source_ids.map(id => test.sources.find(source => source.id === id)).filter(Boolean);
  return [test.source].filter(Boolean);
}

function metricProof(test, key, compact = false) {
  const record = test.records.find(r => r.key === key);
  const sources = metricSources(test,key);
  const role = [...new Set(sources.map(source => source.type || "publisher"))].map(sourceRole).join(" / ");
  if (compact) return `${record ? `<button type="button" class="receipt-link" data-test="${test.id}" data-receipt="${key}">Evidence record</button>` : ""} ${sources[0] ? sourceLink(sources[0],"Source") : ""}`;
  return `${record ? `<button type="button" class="receipt-link" data-test="${test.id}" data-receipt="${key}">${escapeHTML(role || "Evidence")} · record</button>` : ""} ${sources.map(source => sourceLink(source,shortSourceLabel(source))).join(" ")}`;
}

function sourceRole(type) { return ({publisher:"Publisher data",research:"Research study",review:"Independent review",manual:"Manual reference",asha:"ASHA guidance"})[type] || "Source"; }

function shortSourceLabel(source) {
  const label=source.label || "Source";
  if(source.type==="publisher") {
    const owner=/Pearson/i.test(label)?"Pearson":/PRO-ED/i.test(label)?"PRO-ED":/OASES|Stuttering Therapy/i.test(label)?"Developer":"Publisher";
    const kind=/infographic|technical|psychometric/i.test(label)?"data":/brochure/i.test(label)?"brochure":/training|Castilleja/i.test(label)?"training":/catalog/i.test(label)?"catalog":"overview";
    return `${owner} ${kind}`;
  }
  if(source.type==="review") return /Canivez/i.test(label)?"Canivez review":/LEADERS/i.test(label)?"LEADERSproject review":"Independent review";
  return label.includes(" · ") ? label.split(" · ")[0] : label.length>40 ? "Research study" : label;
}

const loadJSON = name => fetch(name).then(response => { if (!response.ok) throw new Error(`${name} unavailable`); return response.json(); });

Promise.all([loadJSON("research.json"),loadJSON("expanded-assessments.json"),loadJSON("evidence-existing.json"),loadJSON("asha-guidance.json")])
.then(([research,expanded,evidence,guidance]) => {
  const base = [...verifiedCatalog(research),...PREVIEW_TESTS].map(test=>({...test,...CLINICAL_FIT[test.id]}));
  state.catalog = [...base.map(test=>attachEvidence(test,evidence.assessments.find(item=>item.id===test.id))),...expanded.assessments.map(test=>attachEvidence(test,test))];
  state.guidance = guidance.guidance;
  try { const saved=JSON.parse(localStorage.getItem("slp-shortlist-v2") || "{}"); state.selected=[...new Set(saved.selected || [])].filter(id=>state.catalog.some(t=>t.id===id)); state.compareIds=[...new Set(saved.compareIds || [])].filter(id=>state.selected.includes(id)).slice(0,2); } catch { /* Invalid stored state starts empty. */ }
  init();
})
.catch(error => { document.querySelector("#atlas-rows").innerHTML='<div class="empty-state"><strong>The assessment data could not load.</strong><span>Open this build through its local preview server.</span></div>'; console.error(error); });

function attachEvidence(test, data) {
  const corrections=data?.corrections || {};
  const sources=data?.sources || [];
  const records=data?.records || [];
  test={...test,...corrections,sources,records};
  test.source = sources.find(s=>s.type === "publisher") || sources[0] || test.source;
  const checkedDates = [...new Set(records.map(r => r.checked_on).filter(Boolean))].sort();
  const checkedDate = checkedDates.at(-1);
  const checkedLabel = checkedDate ? new Date(`${checkedDate}T12:00:00`).toLocaleDateString("en-US", {month:"long",day:"numeric",year:"numeric"}) : "see dated records";
  test.evidence = `Public-source review · ${checkedLabel} · see method and source`;
  test.records = test.records.map(record => ({...record,source_ids:record.source_ids || []}));
  if (test.id === "PLS-5") test.accuracyContext = "Cutoff 85 (−1 SD) · publisher labels the language-disorder group 3:0–7:11; the review labels it 3:11–7:11. Age labels require reconciliation; group-selection concerns remain.";
  if (!test.verified) test.technical = test.source;
  // Older worksheet sources remain attached to the original 24-field profile.
  return test;
}

function relevantGuidance(domains, tests = null) {
  const topicMatches = (g, selectedDomains) => {
    if (g.id === "asha-aphasia") return selectedDomains.includes("aphasia");
    if (["asha-executive-function","asha-adult-tbi"].includes(g.id)) return selectedDomains.includes("cognition");
    if (g.id === "asha-functional-aac") return selectedDomains.includes("functional");
    return g.domains.some(d=>selectedDomains.includes(d));
  };
  const matches = g => topicMatches(g,domains);
  const appropriate = (g,test) => {
    if (g.id === "asha-functional-aac" && test.id === "OASES") return false;
    if (["asha-spoken-language","asha-speech-sound"].includes(g.id) && test.domains.some(d=>["aphasia","cognition"].includes(d))) return false;
    if (["asha-aphasia","asha-adult-tbi"].includes(g.id) && test.ageMax != null && test.ageMax < 216) return false;
    return topicMatches(g,test.domains);
  };
  return state.guidance.filter(g => matches(g) && (!tests || tests.some(test=>appropriate(g,test))) && (tests || state.ageMonths === null || !["asha-aphasia","asha-adult-tbi"].includes(g.id) || state.ageMonths >= 216));
}

function guidanceHTML(g, compact=false) {
  return `<article class="asha-panel"><div class="asha-panel-heading"><h3>${escapeHTML(g.title)}</h3><span class="asha-label">ASHA guidance</span></div><p>${escapeHTML(g.summary)}</p><div class="asha-links">${sourceLink(g.portal,"Practice Portal")}${g.evidence_map ? sourceLink(g.evidence_map,"Evidence Map") : ""}</div>${g.notes?.length ? `<p class="guidance-scope">${escapeHTML(g.notes[0])}</p>` : ""}${!compact ? `<ul class="guidance-components">${g.components.map(c=>`<li><strong>${escapeHTML(c.label)}</strong><span>${escapeHTML(c.description)}</span></li>`).join("")}</ul>` : ""}</article>`;
}

function coverageHTML(tests) {
  const domains=[...new Set(tests.flatMap(t=>t.domains))],guides=relevantGuidance(domains,tests);
  const gaps=[];
  if (domains.includes("vocabulary") && !tests.some(t=>t.purposes.includes("comprehensive"))) gaps.push("The shortlist includes a vocabulary measure, but no broad language profile. Other language abilities remain outside that measure’s scope.");
  if (domains.includes("fluency") && tests.every(t=>t.purposes.includes("impact"))) gaps.push("The shortlist captures the impact of stuttering. Direct measures of speech behavior and speech samples are additional information to consider.");
  if (domains.includes("aphasia") && !domains.includes("functional")) gaps.push("Everyday communication and participation are not represented by a dedicated functional measure in this shortlist.");
  return `<div class="coverage-heading"><h2>What else belongs in the evaluation?</h2><p>These are planning prompts from the scope of your shortlist and the cited guidance. A test selection does not demonstrate that these areas have been assessed.</p></div>${gaps.length ? `<ul class="coverage-gaps">${gaps.map(g=>`<li>${escapeHTML(g)}</li>`).join("")}</ul>` : ""}<div class="guidance-grid">${guides.map(g=>guidanceHTML(g)).join("")}</div>`;
}

function selectedTests() { return state.selected.map(id=>state.catalog.find(t=>t.id===id)).filter(Boolean); }

function briefDate() {
  const date=new Date(), options={timeZone:"America/Chicago"}, parts=new Intl.DateTimeFormat("en-US",{...options,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(date);
  const part=type=>parts.find(p=>p.type===type).value;
  return {display:new Intl.DateTimeFormat("en-US",{...options,dateStyle:"long"}).format(date),iso:`${part("year")}-${part("month")}-${part("day")}`};
}

function briefHTML() {
  const tests=selectedTests(), comparison=state.compareIds.map(id=>state.catalog.find(t=>t.id===id)).filter(Boolean), refs=new Map();
  function cite(test,key) { return metricSources(test,key).map(source=>{ const id=source.url || source.id; if (!refs.has(id)) refs.set(id,{number:refs.size+1,source}); const ref=refs.get(id); return source.url ? `<sup><a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">[${ref.number}]</a></sup>` : `<sup>[${ref.number}]</sup>`; }).join(" "); }
  function context(test,key) {
    const record=test.records.find(r=>r.key===key); if(!record) return "";
    const details=[record.method,record.subtest,record.population,record.sample_size != null ? `Sample: ${record.sample_size}` : "Sample not stated",record.cutoff != null ? `Cutoff: ${record.cutoff}` : "",record.locator ? `Location: ${record.locator}` : "",`Checked ${record.checked_on}`].filter(Boolean).map(escapeHTML).join(" · ");
    return `${record.status==="conflicting"?`<small class="brief-conflict">Sources differ. ${escapeHTML(record.note || "See the evidence details.")}</small>`:""}<details class="brief-record"><summary>Method & population</summary><small>${details}</small>${record.note?`<small>${escapeHTML(record.note)}</small>`:""}<small>Evidence status: ${escapeHTML(record.status)}</small></details>`;
  }
  const guides=relevantGuidance([...new Set(tests.flatMap(t=>t.domains))],tests);
  const summary=`<table class="brief-summary"><thead><tr><th>Assessment / focus</th><th>Age & time</th><th>Key consideration</th></tr></thead><tbody>${tests.map(t=>`<tr><th>${t.id}<small>${escapeHTML(t.scope)}</small></th><td>${escapeHTML(t.age)} ${cite(t,"age")}<br>${escapeHTML(t.time)} ${cite(t,"time")}</td><td>${escapeHTML(t.limit)} ${cite(t,"limit")}</td></tr>`).join("")}</tbody></table>`;
  const rows=COMPARE_ROWS.filter(([,key])=>["internal","retest","rater","accuracy","norms"].includes(key) || key==="overall" && comparison.some(t=>["PPVT-5","WAB-R"].includes(t.id)));
  const table=comparison.length===2 ? `<section class="brief-comparison"><h2>Compare ${comparison.map(t=>t.id).join(" and ")}</h2><table><thead><tr><th>Measure</th>${comparison.map(t=>`<th>${t.id}</th>`).join("")}</tr></thead><tbody>${rows.map(([label,key])=>`<tr><th>${label}</th>${comparison.map(t=>`<td>${escapeHTML(t[key])} ${cite(t,key)}${key==="accuracy"?`<p>${escapeHTML(t.accuracyContext)}</p>`:""}${context(t,key)}</td>`).join("")}</tr>`).join("")}</tbody></table></section>` : "";
  const remaining=tests.filter(test=>comparison.length!==2 || !state.compareIds.includes(test.id));
  const savedEvidence=remaining.length ? `<section class="brief-comparison"><h2>Saved assessment evidence</h2>${remaining.map(test=>`<article><h3>${test.id}</h3><dl>${["internal","overall","retest","rater","accuracy","norms",...test.records.filter(record=>["reliability-summary","mode-agreement","alternate-form","accuracy-selected","accuracy-adjusted","accuracy-manual"].includes(record.key)).map(record=>record.key)].map(key=>{const record=test.records.find(r=>r.key===key);return `<dt>${escapeHTML(record?.label || key)}</dt><dd>${escapeHTML(test[key] || record?.value || "Not reported")} ${cite(test,key)}${key==="accuracy"?`<p>${escapeHTML(test.accuracyContext)}</p>`:""}${context(test,key)}</dd>`;}).join("")}</dl></article>`).join("")}</section>` : "";
  return `<header class="brief-heading"><h1>SLP assessment shortlist</h1><p>${escapeHTML(briefDate().display)} · ${tests.length} assessments · ${escapeHTML(activeSummary())}</p></header>${summary}${table}${savedEvidence}<section class="brief-guidance"><h2>Additional information to consider</h2>${guides.map(g=>`<p><strong>${escapeHTML(g.title)}:</strong> ${g.components.map(c=>escapeHTML(c.label)).join("; ")}. ${sourceLink(g.portal,"ASHA guidance")}</p>`).join("")}</section><section class="brief-references"><h2>Sources</h2><ol>${[...refs.values()].map(ref=>`<li>${sourceLink(ref.source,ref.source.label)}</li>`).join("")}</ol></section><footer>Educational planning brief. Figures retain source, method, and population limits. LSU/faculty review is pending. Detailed evidence records are available in the local website and Markdown export.</footer>`;
}

function metricProofForExport(test,key) {
  const record=test.records.find(r=>r.key===key);
  return `<div class="export-source">${metricSources(test,key).map(s=>sourceLink(s,s.label)).join(" ")}${record ? `<small>${escapeHTML(record.method || "Method not specified")} · ${escapeHTML(record.population || "Population not specified")} · N: ${escapeHTML(record.sample_size ?? "not stated")} · cutoff: ${escapeHTML(record.cutoff ?? "not stated")} · ${escapeHTML(record.locator || "source text")} · checked ${escapeHTML(record.checked_on)}</small>` : ""}</div>`;
}

function openBrief() { document.querySelector("#brief-content").innerHTML=briefHTML(); document.querySelector("#brief-dialog").showModal(); }

function briefMarkdown() {
  const lines=["# SLP assessment shortlist","",`Prepared ${briefDate().display}. Local review build.`,`Finder context: ${activeSummary()}`,""];
  selectedTests().forEach(test=>{ lines.push(`## ${test.id}: ${test.scope}`,"",test.focus,""); ["age","time","internal","overall","retest","rater","accuracy","norms",...test.records.filter(record=>["reliability-summary","mode-agreement","alternate-form","accuracy-selected","accuracy-adjusted","accuracy-manual"].includes(record.key)).map(record=>record.key)].forEach(key=>{ const record=test.records.find(r=>r.key===key); lines.push(`- ${record?.label || key}: ${test[key] || record?.value || "Not reported"}`); if(record) lines.push(`  Method: ${record.method || "Not specified"}; task/score: ${record.subtest || "Not specified"}; population: ${record.population || "Not specified"}; sample: ${record.sample_size ?? "Not specified"}; cutoff: ${record.cutoff ?? "Not specified"}; location: ${record.locator || "Not specified"}; checked: ${record.checked_on}; status: ${record.status}. ${record.note || ""}`); metricSources(test,key).forEach(source=>lines.push(`  Source: [${source.label}](${source.url || ""})`)); }); lines.push(`- Consider: ${test.limit}`,""); });
  lines.push("## Additional information to consider",""); relevantGuidance([...new Set(selectedTests().flatMap(t=>t.domains))],selectedTests()).forEach(g=>{lines.push(`### ${g.title}`,g.summary,`[ASHA Practice Portal](${g.portal.url})`,...g.components.map(c=>`- ${c.label}: ${c.description}`),"");});
  lines.push("Educational planning brief; faculty/LSU review has not yet been completed."); return lines.join("\n");
}

function downloadBrief(format) {
  const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SLP assessment shortlist</title><style>body{font:16px/1.5 system-ui,sans-serif;margin:40px auto;padding:0 24px;max-width:1000px;color:#142234}h1{font-size:30px}h2{font-size:22px}section{padding:18px 0;border-bottom:1px solid #ccd4de}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccd4de;padding:12px;vertical-align:top;text-align:left}a{color:#0869bd}dt{font-weight:700}dd{margin:0 0 12px}small{display:block}footer{margin-top:24px}.guidance-grid{display:grid;gap:20px}.asha-label{font-weight:700}.guidance-components li{margin:10px 0}.guidance-components span{display:block}.brief-record{margin-top:10px;font-size:14px;color:#40556c}.brief-record summary{cursor:pointer}.brief-record small{margin-top:7px}.brief-conflict{display:block;margin-top:8px;color:#77551f;font-size:14px}@media print{tr{break-inside:avoid}h2{break-after:avoid}}</style><body>${briefHTML()}<script>window.addEventListener("beforeprint",()=>document.querySelectorAll(".brief-record").forEach(d=>{d.dataset.wasOpen=d.open;d.open=true}));window.addEventListener("afterprint",()=>document.querySelectorAll(".brief-record").forEach(d=>d.open=d.dataset.wasOpen==="true"));</script></body></html>`;
  const blob=new Blob([format==="html"?html:briefMarkdown()],{type:format==="html"?"text/html;charset=utf-8":"text/markdown;charset=utf-8"});
  const url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download=`SLP-assessment-shortlist-${briefDate().iso}.${format}`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);toast("Download requested. The brief includes its source links.");
}
