const DOMAINS = [
  ["speech-sound", "Speech sound / articulation"],
  ["receptive", "Receptive language"],
  ["expressive", "Expressive language"],
  ["vocabulary", "Vocabulary"],
  ["phonology", "Phonology"]
];
const PURPOSES = [
  ["diagnostic", "Diagnostic evaluation"],
  ["comprehensive", "Broad profile"],
  ["supplemental", "Focused measure"]
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
  ageMonths: null,
  maxTime: null,
  query: "",
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

function fitSummary(test) {
  const fit = CLINICAL_FIT[test.id];
  const age = state.ageMonths === null ? `Ages ${test.age}` : `${state.ageMonths >= test.ageMin && state.ageMonths <= test.ageMax ? "Within" : "Outside"} age range · ${test.age}`;
  return `<div class="client-fit"><h4>Does this fit my client?</h4><dl><div><dt>Age coverage</dt><dd>${escapeHTML(age)}</dd></div><div><dt>Language & norms</dt><dd>${escapeHTML(fit.population)} ${metricProof(test,"population")}</dd></div><div><dt>Response demands</dt><dd>${escapeHTML(fit.response)} ${metricProof(test,"response")}</dd></div><div><dt>Consider</dt><dd>${escapeHTML(fit.limit)} ${metricProof(test,"limit")}</dd></div></dl></div>`;
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[character]));
}

function sourceLink(source, label) {
  if (!source?.url) return `<span class="source-link offline">${escapeHTML(label || "Course manual")} · offline</span>`;
  return `<a class="source-link" href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label || "Open source")} ↗</a>`;
}

function verifiedCatalog(research) {
  const configs = {
    "PPVT-5": {
      scope: "Receptive vocabulary",
      domains: ["receptive", "vocabulary"],
      purposes: ["supplemental"],
      ageMin: 30, ageMax: 1200, age: "2:6–90+",
      timeMin: 10, timeMax: 15, time: "10–15 min",
      reliability: ".97 overall",
      retest: ".88 publisher summary; independent review reports mean .84",
      accuracy: "Matched sensitivity/specificity pair not confirmed publicly",
      norms: "N = 2,720",
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

function filterButton([value, label], group) {
  return `<button type="button" class="filter-chip" data-filter-group="${group}" data-filter-value="${value}" aria-pressed="false"><span></span>${label}</button>`;
}

function setupFilters() {
  document.querySelector("#domain-filters").innerHTML = DOMAINS.map(item => filterButton(item, "domains")).join("");
  document.querySelector("#purpose-filters").innerHTML = PURPOSES.map(item => filterButton(item, "purposes")).join("");
  document.querySelectorAll(".filter-chip").forEach(button => button.addEventListener("click", () => {
    const set = state[button.dataset.filterGroup];
    const value = button.dataset.filterValue;
    set.has(value) ? set.delete(value) : set.add(value);
    button.setAttribute("aria-pressed", String(set.has(value)));
    renderResults();
  }));
  ["age-years", "age-months"].forEach(id => document.querySelector(`#${id}`).addEventListener("input", updateAge));
  document.querySelector("#time-filter").addEventListener("change", event => {
    state.maxTime = event.target.value ? Number(event.target.value) : null;
    renderResults();
  });
  document.querySelector("#clear-filters").addEventListener("click", clearFilters);
  document.querySelector("#compare-button").addEventListener("click", openComparison);
  document.querySelector("#differences-only").addEventListener("change", renderComparison);
}

function setupNavigation() {
  document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
  document.querySelector("#find-test-cta").addEventListener("click", () => showView("finder"));
  document.querySelector("#assessment-search").addEventListener("input", event => {
    state.query = event.target.value.trim().toLowerCase();
    renderLibrary();
  });
  window.addEventListener("hashchange", () => { if (location.hash !== "#assessment-library") showView(location.hash === "#finder" ? "finder" : "library", false); else { showView("library", false); document.querySelector("#assessment-library").scrollIntoView(); } });
  showView(location.hash === "#finder" ? "finder" : "library", false);
}

function showView(view, updateHash = true) {
  state.view = view === "finder" ? "finder" : "library";
  document.querySelector("#library-view").hidden = state.view !== "library";
  document.querySelector("#finder-view").hidden = state.view !== "finder";
  document.querySelectorAll("[data-view]").forEach(button => {
    if (button.dataset.view === state.view) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (updateHash) history.replaceState(null, "", state.view === "finder" ? "#finder" : location.pathname);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateAge() {
  const years = document.querySelector("#age-years").value;
  const months = document.querySelector("#age-months").value;
  state.ageMonths = years === "" && months === "" ? null : (Number(years || 0) * 12) + Number(months || 0);
  renderResults();
}

function clearFilters() {
  state.domains.clear();
  state.purposes.clear();
  state.ageMonths = null;
  state.maxTime = null;
  document.querySelectorAll(".filter-chip").forEach(button => button.setAttribute("aria-pressed", "false"));
  document.querySelector("#age-years").value = "";
  document.querySelector("#age-months").value = "";
  document.querySelector("#time-filter").value = "";
  renderResults();
}

function matches(test) {
  const domainMatch = !state.domains.size || test.domains.some(domain => state.domains.has(domain));
  const purposeMatch = !state.purposes.size || test.purposes.some(purpose => state.purposes.has(purpose));
  const ageMatch = state.ageMonths === null || (state.ageMonths >= test.ageMin && state.ageMonths <= test.ageMax);
  const timeMatch = state.maxTime === null || test.timeMax <= state.maxTime;
  return domainMatch && purposeMatch && ageMatch && timeMatch;
}

function reasonFor(test) {
  const reasons = [];
  if (state.domains.size) {
    const matched = test.domains.find(domain => state.domains.has(domain));
    reasons.push(DOMAINS.find(([value]) => value === matched)?.[1]);
  }
  if (state.ageMonths !== null) reasons.push(`covers age ${Math.floor(state.ageMonths / 12)}:${String(state.ageMonths % 12).padStart(2, "0")}`);
  if (state.maxTime !== null) reasons.push(`fits within ${state.maxTime} minutes`);
  return reasons.length ? reasons.join(" · ") : test.scope;
}

function card(test, context = "finder") {
  const selected = state.selected.includes(test.id);
  const domainTags = test.domains.map(domain => DOMAINS.find(([value]) => value === domain)?.[1]).filter(Boolean);
  return `<article class="test-card ${selected ? "selected" : ""}" data-test-id="${test.id}">
    <div class="match-reason">${context === "finder" ? `Why it matched: ${escapeHTML(reasonFor(test))}` : `Assessment profile · ${escapeHTML(test.scope)}`}</div>
    <div class="card-heading">
      <div><h3>${test.id}</h3><p>${escapeHTML(test.scope)}</p></div>
      <span class="evidence-badge verified">${test.verified ? "Source linked" : "Publisher data"}</span>
    </div>
    <div class="tag-row">${domainTags.map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
    <dl class="quick-facts"><div><dt>Age</dt><dd>${escapeHTML(test.age)}</dd></div><div><dt>Time</dt><dd>${escapeHTML(test.time)}</dd></div><div><dt>Reliability</dt><dd>${escapeHTML(test.reliability)}</dd></div></dl>
    ${fitSummary(test)}
    <div class="card-actions">
      <button type="button" class="secondary-button" data-evidence="${test.id}">View evidence</button>
      <button type="button" class="select-button" data-select="${test.id}" aria-pressed="${selected}">${selected ? "Selected ✓" : "Select to compare"}</button>
    </div>
  </article>`;
}

function activeSummary() {
  const parts = [];
  if (state.domains.size) parts.push([...state.domains].map(value => DOMAINS.find(item => item[0] === value)?.[1]).join(" or "));
  if (state.ageMonths !== null) parts.push(`age ${Math.floor(state.ageMonths / 12)}:${String(state.ageMonths % 12).padStart(2, "0")}`);
  if (state.maxTime !== null) parts.push(`≤ ${state.maxTime} min`);
  return parts.length ? parts.join(" · ") : "Showing the full demo index";
}

function renderResults() {
  const visible = state.catalog.filter(matches);
  document.querySelector("#result-count").textContent = visible.length;
  document.querySelector("#active-summary").textContent = activeSummary();
  document.querySelector("#results").innerHTML = visible.map(test => card(test, "finder")).join("");
  document.querySelector("#empty-state").hidden = visible.length !== 0;
  wireCardActions(document.querySelector("#results"));
}

function renderLibrary() {
  const visible = state.catalog.filter(test => {
    if (!state.query) return true;
    const domainNames = test.domains.map(domain => DOMAINS.find(([value]) => value === domain)?.[1] || "");
    return [test.id, test.name, test.scope, test.focus, ...domainNames].join(" ").toLowerCase().includes(state.query);
  });
  document.querySelector("#library-summary").textContent = state.query
    ? `${visible.length} assessment${visible.length === 1 ? "" : "s"} match “${document.querySelector("#assessment-search").value.trim()}”.`
    : `Browse all ${state.catalog.length} assessments in the demo.`;
  document.querySelector("#library-results").innerHTML = visible.map(test => card(test, "library")).join("");
  document.querySelector("#library-empty").hidden = visible.length !== 0;
  wireCardActions(document.querySelector("#library-results"));
}

function wireCardActions(root) {
  root.querySelectorAll("[data-select]").forEach(button => button.addEventListener("click", () => toggleSelected(button.dataset.select)));
  root.querySelectorAll("[data-evidence]").forEach(button => button.addEventListener("click", () => openEvidence(button.dataset.evidence)));
}

function renderCatalog() {
  renderResults();
  renderLibrary();
  renderTray();
}

function toggleSelected(id) {
  if (state.selected.includes(id)) {
    state.selected = state.selected.filter(testId => testId !== id);
  } else {
    if (state.selected.length === 2) state.selected.shift();
    state.selected.push(id);
  }
  renderCatalog();
}

function renderTray() {
  const tray = document.querySelector("#compare-tray");
  tray.hidden = state.selected.length === 0;
  document.querySelector("#compare-count").textContent = state.selected.length;
  document.querySelector("#compare-button").disabled = state.selected.length !== 2;
  document.querySelector("#tray-tests").innerHTML = state.selected.map(id => `<button type="button" data-remove="${id}">${id}<span aria-hidden="true">×</span><span class="sr-only">Remove ${id}</span></button>`).join("");
  document.querySelectorAll("[data-remove]").forEach(button => button.addEventListener("click", () => toggleSelected(button.dataset.remove)));
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
  if (key === "limit" && ["CELF-5", "PLS-5"].includes(test.id)) key = "language";
  if (key === "response" && test.id === "CAAP-2") return [test.retestSource];
  if (key === "population" && test.id === "GFTA-3") return [test.technical, test.source];
  key = ({internal:"reliability",rater:"reliability",overall:"reliability",accuracyContext:"accuracy",population:"norms",response:"response",limit:"scope"})[key] || key;
  if (!test.verified) return [key === "retest" && test.retestSource ? test.retestSource : ["reliability", "retest", "accuracy", "norms"].includes(key) ? test.technical : test.source];
  const indices = {scope:7,age:5,time:18,reliability:11,retest:11,accuracy:13,norms:14,language:15,response:9};
  const question = test.assessment.questions[indices[key]];
  return question ? question.source_ids.map(id => test.assessment.sources.find(source => source.id === id)).filter(Boolean) : [];
}

function metricProof(test, key) {
  return metricSources(test, key).map(source => sourceLink(source, source.label || source.reference?.split(".")[0] || "Source")).join(" ");
}

function renderComparison() {
  const tests = state.selected.map(id => state.catalog.find(test => test.id === id)).filter(Boolean);
  if (tests.length !== 2) return;
  const differencesOnly = document.querySelector("#differences-only").checked;
  const rows = COMPARE_ROWS.filter(([,key]) => (key !== "overall" || tests.some(test => test.id === "PPVT-5")) && (!differencesOnly || tests[0][key] !== tests[1][key]));
  document.querySelector("#comparison-content").innerHTML = `<div class="comparison-head"><span></span>${tests.map(test => `<div><strong>${test.id}</strong><span>${escapeHTML(test.scope)}</span></div>`).join("")}</div>
    <p class="comparison-note">Reliability coefficients describe different methods, not percentages. Accuracy depends on the cutoff and validation sample.</p>
    <div class="comparison-rows">${rows.map(([label,key]) => `<div class="comparison-row"><strong>${label}</strong>${tests.map(test => `<div>${escapeHTML(test[key])}${key === "accuracy" ? `<p class="accuracy-context">${escapeHTML(test.accuracyContext)}</p>` : ""}<div class="source-row">${metricProof(test, key)}</div></div>`).join("")}</div>`).join("")}</div>
    <div class="comparison-sources"><span>Proof</span>${tests.map(test => `<div>${sourceLink(test.source, test.source.label || "Primary source")}</div>`).join("")}</div>`;
}

function openComparison() {
  renderComparison();
  document.querySelector("#compare-dialog").showModal();
}

function fullEvidence(test) {
  const field = (label, value, proof = "", note = "") => `<section class="profile-field"><h4>${escapeHTML(label)}</h4><p>${escapeHTML(value)}</p>${note ? `<p class="profile-note">${escapeHTML(note)}</p>` : ""}<div class="source-row">${proof}</div></section>`;
  const metric = (label, key) => field(label, test[key], metricProof(test, key));
  let clinical, background, administration;
  if (test.verified) {
    const labels = ["Full name", "Developed by", "Publisher", "Edition & release", "Clinical domain", "Age range", "Settings", "Purpose", "Skills measured", "Response demands", "Typical time", "Reliability", "Validity", "Sensitivity & specificity", "Normative sample", "Language & cultural fit", "Examiner qualifications", "Materials", "Administration time", "Environment", "Basal & ceiling", "Prompts & repetitions", "Accommodations", "Scoring"];
    const answer = index => {
      const q = test.assessment.questions[index];
      const proof = q.source_ids.map(id => {const s = test.assessment.sources.find(source => source.id === id); return sourceLink(s, s?.reference.split(".")[0]);}).join(" ");
      return field(labels[index], q.answer, proof, q.note);
    };
    clinical = metric("Age range", "age") + metric("Reliability", "reliability") + metric("Test–retest", "retest") + metric("Sensitivity & specificity", "accuracy") + metric("Normative sample", "norms") + [12,15,4,7,8].map(answer).join("") + `<details class="method-detail"><summary>Reliability and accuracy context</summary>${[11,13,14].map(answer).join("")}</details>`;
    background = [0,1,2,3,6].map(answer).join("");
    administration = [18,9,16,17,19,20,21,22,23].map(answer).join("");
  } else {
    clinical = [["Age range","age"],["Reliability","reliability"],["Test–retest","retest"],["Sensitivity & specificity","accuracy"],["Normative sample","norms"],["Clinical scope","scope"],["Language & dialect","language"]].map(([label,key])=>metric(label,key)).join("");
    const proof = sourceLink(test.source,test.source.label);
    background = [["Full name",test.name],["Developed by",test.author],["Publisher",test.publisher],["Edition & release",test.edition]].map(([label,value])=>field(label,value,proof)).join("");
    administration = [["Time",test.time],["Administration",test.administration],["Materials",test.materials],["Qualifications",test.qualification]].map(([label,value])=>field(label,value,proof)).join("");
    if (test.id === "CAAP-2") administration += field("Response demands", "Picture naming and, for school-age children, sentence repetition.", sourceLink(test.retestSource,"Publisher training"));
  }
  return `<div class="profile-strip"><span>Clinical evidence → test background → administration</span><span>Source links accompany each field</span></div><div class="profile-columns"><section class="profile-column clinical-column"><header><span>01</span><h3>Clinical evidence</h3><p>Scores, fit, and interpretation</p></header>${clinical}</section><section class="profile-column"><header><span>02</span><h3>Test background</h3><p>Instrument and publication</p></header>${background}</section><section class="profile-column"><header><span>03</span><h3>Administration</h3><p>Time, materials, and procedures</p></header>${administration}</section></div>`;
}

function openEvidence(id) {
  const test = state.catalog.find(item => item.id === id);
  document.querySelector("#evidence-title").textContent = `${test.id} · ${test.scope}`;
  document.querySelector("#evidence-content").innerHTML = fullEvidence(test);
  document.querySelector("#evidence-dialog").showModal();
}

fetch("research.json")
  .then(response => {
    if (!response.ok) throw new Error("Research file unavailable");
    return response.json();
  })
  .then(research => {
    state.catalog = [...verifiedCatalog(research), ...PREVIEW_TESTS].map(test => ({...test,...CLINICAL_FIT[test.id]}));
    setupFilters();
    setupNavigation();
    renderCatalog();
  })
  .catch(() => {
    const message = '<div class="empty-state"><strong>The assessment index could not load.</strong><span>Please refresh the page.</span></div>';
    document.querySelector("#results").innerHTML = message;
    document.querySelector("#library-results").innerHTML = message;
  });
