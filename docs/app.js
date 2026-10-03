// app.js — the interface: atlas chart, spec sheet, dossier, records, compare, ledger, shortlist.
// Data assembly, guidance, and brief exports live in data.js (loaded first).

/* ---------- Figures: turn evidence strings into display numbers ---------- */
const FAMILY_ORDER = ["language", "speech", "fluency", "early", "spanish", "adult"];
const GLYPH = {checked: "✓", differs: "≠", gaps: "–", inherited: "↺"};
const STATUS_TEXT = {checked: "Checked against the cited source", differs: "Cited sources disagree; both retained", gaps: "Not supplied by the cited sources", inherited: "Carried forward from an earlier source record"};

function coefficients(text) { return [...String(text ?? "").matchAll(/(?<![\d.])(?:1\.00|0?\.\d{2,3})(?![\d])/g)].map(m => parseFloat(m[0])).filter(v => v >= .5 && v <= 1); } // p-values and tiny decimals are not coefficients
function coefficientRange(text) { const v = coefficients(text); return v.length ? {min: Math.min(...v), max: Math.max(...v)} : null; }
function fmtCoef(v) { return v >= 1 ? "1.00" : v.toFixed(2).replace(/^0/, ""); }
function accuracyPair(text) {
  const s = String(text ?? "");
  const pct = [...s.matchAll(/(\d{2,3})\s?%/g)].map(m => +m[1] / 100);
  const dec = coefficients(s);
  const v = pct.length >= 2 ? pct : dec.length >= 2 ? dec : null;
  return v && /sensitiv|specific|accuracy/i.test(s) ? {sens: v[0], spec: v[1]} : null;
}
function sampleSize(text) { const m = String(text ?? "").match(/\b[Nn]\s*=?\s*([\d][\d,]{2,})/); return m ? parseInt(m[1].replace(/,/g, ""), 10) : null; }
function fmtInt(n) { return n.toLocaleString("en-US"); }
function splitFigure(text) {
  // Leading numeric phrase becomes the figure; the rest is the note.
  const s = String(text ?? "").trim();
  const m = s.match(/^((?:Birth|birth)?[\d.,:–\-+%\s/]*\d[\d.,:–\-+%\s/]*(?:\+|min(?:utes)?|months|years)?)/);
  if (m && /\d/.test(m[1])) { const big = m[1].trim().replace(/\s+/g, " "); const rest = s.slice(m[0].length).replace(/^[\s·;,]+/, ""); return {big, note: rest}; }
  if (/^(Birth|About|Not reported|Each|Oral)/i.test(s) && s.length <= 24) return {big: s, note: ""};
  return {big: null, note: s};
}
function figureHTML(test, key, label, opts = {}) {
  const raw = test[key];
  const status = recordStatus(test, key);
  let big, note;
  if (opts.kind === "coef") { const r = coefficientRange(raw); big = r ? (r.min === r.max ? fmtCoef(r.max) : `${fmtCoef(r.min)}–${fmtCoef(r.max)}`) : null; note = raw; }
  else if (opts.kind === "n") { const n = sampleSize(raw); big = n != null ? `N\u00a0=\u00a0${fmtInt(n)}` : null; note = raw; }
  else if (opts.kind === "acc") { const p = accuracyPair(raw); big = p ? `${Math.round(p.sens*100)}%\u00a0/\u00a0${Math.round(p.spec*100)}%` : null; note = raw; }
  else { ({big, note} = splitFigure(raw)); }
  const value = big != null ? `<button type="button" class="fig-value" data-test="${test.id}" data-receipt="${key}" title="Open the evidence record">${escapeHTML(big)}</button>` : `<button type="button" class="fig-value none" data-test="${test.id}" data-receipt="${key}" title="Open the evidence record">—</button>`;
  let extra = "";
  if (opts.kind === "coef") { const r = coefficientRange(raw); if (r) { const lo = Math.max(0, (r.min - .7) / .3 * 100), hi = Math.min(100, (r.max - .7) / .3 * 100); extra = `<div class="meter" aria-hidden="true"><i style="left:${lo}%;right:${100 - hi}%"></i></div>${opts.scale ? '<div class="meter-scale"><span>.70</span><span>.85</span><span>1.00</span></div>' : ""}`; } }
  if (opts.kind === "acc") { const p = accuracyPair(raw); if (p) extra = `<div class="acc" aria-label="Sensitivity ${Math.round(p.sens*100)} percent, specificity ${Math.round(p.spec*100)} percent"><span>Sens.</span><i style="--w:${p.sens*100}%"></i><b>${Math.round(p.sens*100)}%</b><span>Spec.</span><i style="--w:${p.spec*100}%"></i><b>${Math.round(p.spec*100)}%</b></div>`; }
  if (note && big && note.replace(/\s+/g, " ").trim() === big.replace(/\u00a0/g, " ")) note = "";
  return `<div class="fig ${opts.cls || ""}"><span class="label">${label}</span>${value}${extra}${note ? `<span class="fig-note ${opts.full ? "full" : ""}" title="${escapeHTML(note)}">${escapeHTML(note)}</span>` : ""}</div>`;
}
function glyph(status, extraTitle = "") { return `<span class="glyph ${status.cls}" role="img" aria-label="${status.label}" title="${escapeHTML(STATUS_TEXT[status.cls] || status.label)}${extraTitle ? " · " + escapeHTML(extraTitle) : ""}">${GLYPH[status.cls] || "·"}</span>`; }
function statusLine(test) { const s = testStatus(test); const n = test.records.filter(r => r.status === "conflicting").length; return `<span class="status-line">${glyph(s)}${s.label}${n ? ` · ${n} record${n === 1 ? "" : "s"}` : ""}</span>`; }
function recordStatusOf(record) { return STATUS[record?.status] || STATUS["not-reported"]; }
function uiIcon(name) {
  const paths = {compare:'<path d="M4 6h6v14H4zM14 4h6v14h-6z"/>',arrow:'<path d="M4 12h15M13 6l6 6-6 6"/>',bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',check:'<path d="m5 12 4 4L19 6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',external:'<path d="M14 4h6v6M20 4 10 14M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>'};
  return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
}
function shadeStyle(test) {
  const fam = testFamily(test);
  const siblings = state.catalog.filter(t => testFamily(t) === fam).sort((a, b) => a.ageMin - b.ageMin || a.id.localeCompare(b.id));
  return `--i:${siblings.findIndex(t => t.id === test.id)};--n:${siblings.length}`;
}
function fmtAge(months) { return `${Math.floor(months / 12)}:${String(months % 12).padStart(2, "0")}`; }

/* ---------- Filtering (atlas and sheet share one predicate) ---------- */
function visibleTests() {
  return state.catalog.filter(test => {
    if (state.category !== "all" && testFamily(test) !== state.category) return false;
    if (!matches(test)) return false;
    if (!state.query) return true;
    const domainNames = test.domains.map(d => DOMAINS.find(([v]) => v === d)?.[1] || "");
    return [test.id, test.name, test.scope, test.focus, ...domainNames].join(" ").toLowerCase().includes(state.query);
  });
}
function filtersActive() { return state.category !== "all" || state.domains.size || state.purposes.size || state.ageMonths !== null || state.maxTime !== null || state.query; }

/* ---------- Atlas chart: one row per test, one axis per layer ---------- */
const AGE_MAX = 95 * 12, AGE_BREAK = 22 * 12, BREAK_FRAC = .68;
function ageX(months, w) { const m = Math.min(months ?? AGE_MAX, AGE_MAX); return m <= AGE_BREAK ? (m / AGE_BREAK) * BREAK_FRAC * w : (BREAK_FRAC + ((m - AGE_BREAK) / (AGE_MAX - AGE_BREAK)) * (1 - BREAK_FRAC)) * w; }
function cutoffScore(test) {
  const s = [test.accuracy, test.accuracyContext].join(" ");
  const m = s.match(/(?:cutoff|cut-off|cut score)\s*(?:of\s*)?(?:SS\s*)?(\d{2,3})(?![.\d])/i) || s.match(/\bSS\s?(\d{2,3})\b/) || s.match(/\(?[−-]1(?:\.33)?\s*SD\)?[^\d]{0,12}(\d{2})/);
  const v = m ? Number(m[1]) : null;
  return v != null && v >= 60 && v <= 100 ? v : null;
}
const LAYERS = {
  age: {label: "Age coverage", unit: "years of age, birth to 90+", key: "age", ticks: [[0, "0"], [24, "2"], [60, "5"], [120, "10"], [180, "15"], [252, "21"], [360, "30"], [600, "50"], [840, "70"], [1080, "90+"]], scale: (v, w) => ageX(v, w), marks: t => [{type: "bar", a: t.ageMin, b: t.ageMax ?? AGE_MAX}], value: t => t.age, note: "Bars show the publisher's stated age range."},
  time: {label: "Administration time", unit: "minutes, quoted task or form", key: "time", domain: [0, 90], ticks: [0, 15, 30, 45, 60, 75, 90].map(v => [v, String(v)]), marks: t => t.timeMin != null ? [{type: "bar", a: Math.min(t.timeMin, 90), b: Math.min(t.timeMax, 90)}] : [], value: t => t.time, note: "Bars show the quoted task or form, not the full evaluation."},
  reliability: {label: "Reliability", unit: "coefficient · solid = internal consistency · outlined = test–retest", key: t => reliabilityKeyFor(t), domain: [.7, 1], ticks: [.7, .75, .8, .85, .9, .95, 1].map(v => [v, fmtCoef(v)]), marks: t => { const r = coefficientRange(t.internal) || coefficientRange(reliabilityValueFor(t)), rt = coefficientRange(t.retest), m = []; if (r) m.push({type: "bar", a: r.min, b: r.max}); if (rt) m.push({type: "outline", a: rt.min, b: rt.max}); return m; }, value: t => `${reliabilityValueFor(t)} · retest: ${t.retest}`, note: "Ranges span the reported subtests, forms, or groups. Methods differ between tests."},
  accuracy: {label: "Diagnostic accuracy", unit: "percent · dot = sensitivity · ring = specificity", key: "accuracy", domain: [.5, 1], ticks: [.5, .6, .7, .8, .9, 1].map(v => [v, `${Math.round(v * 100)}%`]), marks: t => { const p = accuracyPair(t.accuracy); return p ? [{type: "pair", a: p.sens, b: p.spec}] : []; }, value: t => t.accuracy, note: "Only matched sensitivity/specificity pairs are plotted; the cutoff and sample vary by study."},
  norms: {label: "Normative sample", unit: "participants in the norm sample", key: "norms", domain: [0, 3500], ticks: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500].map(v => [v, fmtInt(v)]), marks: t => { const n = sampleSize(t.norms); return n != null ? [{type: "bar", a: 0, b: Math.min(n, 3500)}] : []; }, value: t => t.norms, note: "Norm sample, not the reliability or accuracy sample."},
  cutoff: {label: "Diagnostic cutoff", unit: "standard score used in the accuracy study · M = 100, SD = 15", key: "accuracy", domain: [70, 100], ticks: [70, 75, 80, 85, 90, 95, 100].map(v => [v, String(v)]), refs: [[85, "−1 SD"], [70, "−2 SD"]], marks: t => { const c = cutoffScore(t); return c != null ? [{type: "dot", a: c}] : []; }, value: t => t.accuracyContext || t.accuracy, note: "A lower cutoff trades sensitivity for specificity; the plotted score is the one the cited accuracy figures used."}
};
function renderLayerPicker() {
  const host = document.querySelector("#layer-picker");
  host.innerHTML = Object.entries(LAYERS).map(([id, l]) => `<button type="button" role="tab" data-layer="${id}" aria-selected="${state.layer === id}">${l.label}</button>`).join("");
  host.querySelectorAll("[data-layer]").forEach(b => b.addEventListener("click", () => { state.layer = b.dataset.layer; renderLayerPicker(); renderAtlas(); }));
}
function renderAtlas() {
  const host = document.querySelector("#atlas-chart");
  const layer = LAYERS[state.layer] || LAYERS.age;
  const width = Math.max(320, host.clientWidth - 40);
  const labelW = width < 560 ? 64 : 92, plotW = width - labelW - 8, rowH = 22, top = 26, bottom = 22;
  const ordered = [...state.catalog].sort((a, b) => FAMILY_ORDER.indexOf(testFamily(a)) - FAMILY_ORDER.indexOf(testFamily(b)) || a.ageMin - b.ageMin);
  const visible = new Set(visibleTests().map(t => t.id));
  const height = top + ordered.length * rowH + bottom;
  const clamp = v => layer.domain ? Math.min(layer.domain[1], Math.max(layer.domain[0], v)) : v;
  const X = v => labelW + (layer.scale ? layer.scale(v, plotW) : ((clamp(v) - layer.domain[0]) / (layer.domain[1] - layer.domain[0])) * plotW);
  document.querySelector("#atlas-title").innerHTML = `${escapeHTML(layer.label)} <span>· ${escapeHTML(layer.unit)}</span>`;
  let svg = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeHTML(layer.label)} chart">`;
  layer.ticks.forEach(([v, t]) => { svg += `<line class="ax" x1="${X(v)}" x2="${X(v)}" y1="${top - 6}" y2="${height - bottom + 4}"/><text class="tick" x="${X(v)}" y="${height - bottom + 16}" text-anchor="middle">${t}</text>`; });
  svg += `<line class="ax-strong" x1="${labelW}" x2="${width}" y1="${top - 6}" y2="${top - 6}"/>`;
  if (state.layer === "age") { const bx = labelW + BREAK_FRAC * plotW; svg += `<text class="cap" x="${labelW}" y="${top - 12}">years of age</text><line class="ax-strong" x1="${bx}" x2="${bx}" y1="${top - 6}" y2="${height - bottom + 4}"/><text class="cap" x="${bx + 6}" y="${top - 12}">adult scale →</text>`; }
  (layer.refs || []).forEach(([v, t]) => { svg += `<line class="ref" x1="${X(v)}" x2="${X(v)}" y1="${top - 6}" y2="${height - bottom + 4}"/><text class="cap" x="${X(v) + 5}" y="${top - 12}">${t}</text>`; });
  ordered.forEach((t, i) => {
    const y = top + i * rowH, cy = y + 11, dim = !visible.has(t.id);
    const on = state.layer === "age" && state.ageMonths !== null && !dim && state.ageMonths >= t.ageMin && (t.ageMax == null || state.ageMonths <= t.ageMax);
    const marks = layer.marks(t);
    let m = "";
    marks.forEach(k => {
      if (k.type === "bar") { const x1 = X(k.a), x2 = Math.max(x1 + 6, X(k.b)); m += `<rect class="bar ${dim ? "dim" : ""} ${on ? "on" : ""}" x="${x1}" y="${y + 6}" width="${x2 - x1}" height="10" fill="var(--test-color)"/>`; }
      if (k.type === "outline") { const x1 = X(k.a), x2 = Math.max(x1 + 6, X(k.b)); m += `<rect class="bar outline ${dim ? "dim" : ""}" x="${x1 + 1}" y="${y + 7}" width="${x2 - x1 - 2}" height="8" fill="none" stroke="var(--test-color)" stroke-width="1.5"/>`; }
      if (k.type === "pair") { const x1 = X(k.a), x2 = X(k.b); m += `<line class="bar ${dim ? "dim" : ""}" x1="${Math.min(x1, x2)}" x2="${Math.max(x1, x2)}" y1="${cy}" y2="${cy}" stroke="var(--test-color)" stroke-width="2"/><circle class="bar ${dim ? "dim" : ""}" cx="${x1}" cy="${cy}" r="5" fill="var(--test-color)" stroke="var(--surface)" stroke-width="2"/><circle class="bar ${dim ? "dim" : ""}" cx="${x2}" cy="${cy}" r="5" fill="var(--surface)" stroke="var(--test-color)" stroke-width="2"/>`; }
      if (k.type === "dot") { m += `<circle class="bar ${dim ? "dim" : ""}" cx="${X(k.a)}" cy="${cy}" r="6" fill="var(--test-color)" stroke="var(--surface)" stroke-width="2"/>`; }
    });
    if (!marks.length) m = `<text class="cap none" x="${labelW + 6}" y="${cy + 4}">not reported in checked sources</text>`;
    svg += `<g class="row" data-id="${t.id}" data-family="${testFamily(t)}" style="${shadeStyle(t)}"><rect class="hit" x="0" y="${y}" width="${width}" height="${rowH}"/><text class="rowlabel ${dim ? "dim" : ""}" x="${labelW - 10}" y="${cy + 4}" text-anchor="end">${escapeHTML(t.id)}</text>${m}</g>`;
  });
  if (state.layer === "age" && state.ageMonths !== null) { const cx = X(Math.min(state.ageMonths, AGE_MAX)); svg += `<line class="cursor" x1="${cx}" x2="${cx}" y1="${top - 14}" y2="${height - bottom + 4}"/><text class="cursor-label" x="${cx + 6}" y="${top - 18}">client ${fmtAge(state.ageMonths)}</text>`; }
  svg += `</svg><div id="atlas-tip" class="atlas-tip" hidden></div>`;
  host.innerHTML = svg;
  const tip = host.querySelector("#atlas-tip");
  host.querySelectorAll(".row").forEach(row => {
    const t = state.catalog.find(x => x.id === row.dataset.id);
    row.addEventListener("mousemove", e => {
      tip.innerHTML = `<strong>${escapeHTML(t.id)}</strong><em>${escapeHTML(t.scope)}</em><dl><dt>${escapeHTML(layer.label)}</dt><dd>${escapeHTML(layer.value(t))}</dd>${state.layer !== "age" ? `<dt>Ages</dt><dd>${escapeHTML(t.age)}</dd>` : `<dt>Time</dt><dd>${escapeHTML(t.time)}</dd>`}</dl><em>Click for the profile</em>`;
      tip.hidden = false;
      const r = host.getBoundingClientRect(); let x = e.clientX - r.left + 14, y = e.clientY - r.top + 14;
      if (x + 290 > r.width) x = e.clientX - r.left - 300; tip.style.left = `${x}px`; tip.style.top = `${y}px`;
    });
    row.addEventListener("mouseleave", () => tip.hidden = true);
    row.addEventListener("click", () => openEvidence(t.id));
  });
  document.querySelector("#atlas-foot-left").textContent = `${layer.note} Tests outside the current filters are dimmed, not removed.`;
  document.querySelector("#atlas-foot-right").textContent = state.ageMonths !== null ? `${[...visible].length} of ${state.catalog.length} cover a client aged ${fmtAge(state.ageMonths)}` : `${[...visible].length} of ${state.catalog.length} shown`;
}

/* ---------- Spec sheet ---------- */
function specRow(test, context = "atlas") {
  const selected = state.selected.includes(test.id), comparing = state.compareIds.includes(test.id);
  const {family, label} = familyOf(test);
  const matched = context === "atlas" && filtersActive() ? `<span class="matched"><b>Matched:</b> ${escapeHTML(reasonFor(test))}</span>` : "";
  const check = context === "shortlist" ? `<label class="compare-check"><input type="checkbox" data-compare="${test.id}" ${comparing ? "checked" : ""}>Compare</label>` : "";
  return `<article class="spec ${selected ? "selected" : ""}" data-family="${family}" data-test-id="${test.id}" style="${shadeStyle(test)}">
    <div class="spec-id"><h3><button type="button" data-evidence="${test.id}" title="Open the full profile">${escapeHTML(test.id)}</button></h3><p>${escapeHTML(test.scope)}</p><span class="fam"><i class="fam-dot"></i>${escapeHTML(label)}</span>${matched}${check}</div>
    ${figureHTML(test, "age", "Age range")}
    ${figureHTML(test, "time", "Administration")}
    ${figureHTML(test, reliabilityKeyFor(test), reliabilityKeyFor(test) === "rater" ? "Scorer agreement" : reliabilityKeyFor(test) === "overall" ? "Reliability · overall" : "Internal consistency", {kind: "coef"})}
    ${figureHTML(test, "norms", "Norm sample", {kind: "n", cls: "fig-norms"})}
    ${figureHTML(test, "accuracy", "Diagnostic accuracy", {kind: "acc", cls: "fig-acc"})}
    <div class="spec-side">${statusLine(test)}<div class="actions"><button type="button" class="btn-ghost" data-evidence="${test.id}">Profile ${uiIcon("arrow")}</button><button type="button" class="btn-icon" data-pick-compare="${test.id}" aria-pressed="${comparing}" title="${comparing ? "Remove from comparison" : "Add to comparison"}" aria-label="${comparing ? "Remove" : "Add"} ${test.id} ${comparing ? "from" : "to"} comparison">${uiIcon(comparing ? "check" : "compare")}</button><button type="button" class="btn-icon" data-select="${test.id}" aria-pressed="${selected}" title="${selected ? "Remove from shortlist" : "Save to shortlist"}" aria-label="${selected ? "Remove" : "Save"} ${test.id} ${selected ? "from" : "to"} shortlist">${uiIcon(selected ? "check" : "bookmark")}</button></div></div>
  </article>`;
}
function wireActions(root) {
  root.querySelectorAll("[data-pick-compare]").forEach(b => b.addEventListener("click", () => toggleComparison(b.dataset.pickCompare)));
  root.querySelectorAll("[data-select]").forEach(b => b.addEventListener("click", () => toggleSelected(b.dataset.select)));
  root.querySelectorAll("[data-evidence]").forEach(b => b.addEventListener("click", () => openEvidence(b.dataset.evidence)));
}
function renderSheet() {
  const visible = visibleTests();
  document.querySelector("#fit-count").textContent = visible.length;
  document.querySelector("#fit-caption").textContent = state.ageMonths !== null ? `assessments cover a client aged ${fmtAge(state.ageMonths)}${filtersActive() && (state.domains.size || state.maxTime !== null || state.purposes.size || state.query || state.category !== "all") ? " and match your filters" : ""}` : filtersActive() ? "assessments match your filters" : "assessments in the atlas";
  document.querySelector("#sheet-count").textContent = `· ${visible.length} of ${state.catalog.length}`;
  const root = document.querySelector("#atlas-rows");
  root.innerHTML = visible.map(t => specRow(t, "atlas")).join("");
  document.querySelector("#atlas-empty").hidden = visible.length !== 0;
  wireActions(root);
  renderFinderGuidance();
}
function renderFinderGuidance() {
  const guides = relevantGuidance([...state.domains]);
  document.querySelector("#finder-guidance").innerHTML = guides.length ? `<details class="guidance-strip" open><summary>ASHA: considerations for this evaluation</summary><div class="guidance-grid">${guides.map(g => guidanceHTML(g, true)).join("")}</div><p class="subtle">ASHA guidance is cited for context. ASHA has not endorsed this site or its shortlists.</p></details>` : "";
}
function renderLegend() {
  const host = document.querySelector("#family-legend");
  host.innerHTML = [["all", "All"], ...FAMILY_ORDER.map(id => FAMILIES.find(([f]) => f === id))].map(([id, name]) => `<button type="button" data-category="${id}" data-family="${id}" aria-pressed="${state.category === id}">${id === "all" ? "" : '<i class="fam-dot"></i>'}${escapeHTML(name)} <b>${state.catalog.filter(t => id === "all" || testFamily(t) === id).length}</b></button>`).join("");
  host.querySelectorAll("[data-category]").forEach(b => b.addEventListener("click", () => { state.category = state.category === b.dataset.category && b.dataset.category !== "all" ? "all" : b.dataset.category; renderCatalog(); }));
}
function renderCatalog() { renderLegend(); renderLayerPicker(); renderAtlas(); renderSheet(); renderShortlist(); renderTray(); }

/* ---------- Filters ---------- */
function setupFilters() {
  document.querySelector("#domain-filters").innerHTML = '<span class="label">Clinical area</span>' + DOMAINS.map(([v, l]) => `<button type="button" class="chip" data-filter-group="domains" data-filter-value="${v}" aria-pressed="false">${l}</button>`).join("");
  document.querySelector("#purpose-filters").innerHTML = PURPOSES.map(([v, l]) => `<button type="button" class="chip" data-filter-group="purposes" data-filter-value="${v}" aria-pressed="false">${l}</button>`).join("");
  document.querySelectorAll(".chip[data-filter-group]").forEach(b => b.addEventListener("click", () => { const set = state[b.dataset.filterGroup], v = b.dataset.filterValue; set.has(v) ? set.delete(v) : set.add(v); b.setAttribute("aria-pressed", String(set.has(v))); renderCatalog(); }));
  const updateAge = () => { const y = document.querySelector("#age-years").value, m = document.querySelector("#age-months").value; state.ageMonths = y === "" && m === "" ? null : Number(y || 0) * 12 + Number(m || 0); renderCatalog(); };
  ["age-years", "age-months"].forEach(id => document.querySelector(`#${id}`).addEventListener("input", updateAge));
  document.querySelector("#time-filter").addEventListener("change", e => { state.maxTime = e.target.value ? Number(e.target.value) : null; renderCatalog(); });
  document.querySelector("#assessment-search").addEventListener("input", e => { state.query = e.target.value.trim().toLowerCase(); renderCatalog(); });
  document.querySelector("#clear-filters").addEventListener("click", () => {
    state.domains.clear(); state.purposes.clear(); state.ageMonths = null; state.maxTime = null; state.query = ""; state.category = "all";
    document.querySelectorAll(".chip[data-filter-group]").forEach(b => b.setAttribute("aria-pressed", "false"));
    ["#age-years", "#age-months", "#time-filter", "#assessment-search"].forEach(s => document.querySelector(s).value = "");
    renderCatalog();
  });
  document.querySelector("#open-shortlist").addEventListener("click", () => showView("shortlist"));
  document.querySelector("#differences-only").addEventListener("change", renderComparison);
}

/* ---------- Navigation, theme, dialogs ---------- */
function showView(view, updateHash = true) {
  state.view = ["shortlist", "research"].includes(view) ? view : "atlas";
  ["atlas", "shortlist", "research"].forEach(n => document.querySelector(`#${n}-view`).hidden = state.view !== n);
  document.querySelectorAll("[data-view]").forEach(b => b.dataset.view === state.view ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current"));
  if (updateHash) history.replaceState(null, "", state.view === "atlas" ? location.pathname : `#${state.view}`);
  renderTray();
  if (state.view === "atlas") renderAtlas();
  window.scrollTo({top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
}
function setupNavigation() {
  document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => showView(b.dataset.view)));
  document.querySelector("#quick-compare").addEventListener("click", openComparison);
  document.querySelector("#theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("slp-theme", next); } catch { /* theme stays for this visit */ }
  });
  document.querySelectorAll("dialog").forEach(d => d.addEventListener("click", e => { if (e.target !== d) return; const b = d.getBoundingClientRect(); if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) d.close(); }));
  document.querySelector("#clear-shortlist").addEventListener("click", () => { state.selected = []; state.compareIds = []; saveSelection(); renderCatalog(); });
  document.querySelector("#export-brief").addEventListener("click", openBrief);
  document.querySelector("#download-html").addEventListener("click", () => downloadBrief("html"));
  document.querySelector("#download-markdown").addEventListener("click", () => downloadBrief("md"));
  document.querySelector("#copy-brief").addEventListener("click", async () => { try { await navigator.clipboard.writeText(briefMarkdown()); toast("Brief copied with its evidence details and source links."); } catch { toast("Copy is unavailable in this browser. Use a download or Print / Save PDF."); } });
  window.addEventListener("beforeprint", () => document.querySelectorAll("#brief-content .brief-record").forEach(d => { d.dataset.openBeforePrint = String(d.open); d.open = true; }));
  window.addEventListener("afterprint", () => document.querySelectorAll("#brief-content .brief-record").forEach(d => { d.open = d.dataset.openBeforePrint === "true"; delete d.dataset.openBeforePrint; }));
  document.querySelector("#print-brief").addEventListener("click", () => window.print());
  document.body.addEventListener("click", e => { const r = e.target.closest("[data-receipt]"); if (r) openReceipt(r.dataset.test, r.dataset.receipt); });
  window.addEventListener("hashchange", () => showView(location.hash.slice(1), false));
  new ResizeObserver(() => { if (state.view === "atlas") renderAtlas(); }).observe(document.querySelector("#atlas-chart"));
  showView(location.hash.slice(1), false);
}

/* ---------- Tray & shortlist ---------- */
function renderTray() {
  document.querySelector("#compare-tray").hidden = state.selected.length === 0 || state.view === "shortlist";
  document.querySelector("#compare-count").textContent = state.selected.length;
  document.querySelector("#shortlist-nav-count").textContent = state.selected.length;
  document.querySelector("#quick-compare").disabled = state.compareIds.length !== 2;
  document.querySelector("#quick-compare-count").textContent = `${state.compareIds.length}/2`;
  document.querySelector("#tray-label").textContent = state.compareIds.length ? "Comparing" : "Shortlist · pick two to compare";
  const ids = state.compareIds.length ? state.compareIds : state.selected.slice(0, 4);
  document.querySelector("#tray-tests").innerHTML = ids.map(id => `<button type="button" ${state.compareIds.length ? "data-uncompare" : "data-remove"}="${escapeHTML(id)}">${escapeHTML(id)}${uiIcon("close")}<span class="sr-only">Remove ${escapeHTML(id)}</span></button>`).join("") + (!state.compareIds.length && state.selected.length > 4 ? `<span>+${state.selected.length - 4}</span>` : "");
  document.querySelectorAll("[data-uncompare]").forEach(b => b.addEventListener("click", () => toggleComparison(b.dataset.uncompare)));
  document.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => toggleSelected(b.dataset.remove)));
}
function renderShortlist() {
  const tests = selectedTests();
  document.querySelector("#export-brief").disabled = !tests.length;
  document.querySelector("#clear-shortlist").disabled = !tests.length;
  const root = document.querySelector("#shortlist-content");
  root.innerHTML = tests.length ? `<div class="shortlist-toolbar"><p>Tick two assessments to compare them on the same scales. Everything else you saved stays here.</p><button id="compare-button" class="btn-primary" ${state.compareIds.length !== 2 ? "disabled" : ""}>Compare ${state.compareIds.length}/2</button></div><div class="sheet">${tests.map(t => specRow(t, "shortlist")).join("")}</div>` : `<div class="empty-state"><strong>Your shortlist is empty.</strong><span>Save assessments from the atlas.</span><button class="btn-primary" id="shortlist-browse">Open the atlas</button></div>`;
  wireActions(root);
  root.querySelector("#shortlist-browse")?.addEventListener("click", () => showView("atlas"));
  root.querySelector("#compare-button")?.addEventListener("click", openComparison);
  root.querySelectorAll("[data-compare]").forEach(input => input.addEventListener("change", () => {
    const id = input.dataset.compare;
    if (input.checked && state.compareIds.length >= 2) { input.checked = false; toast("Untick one assessment before choosing another to compare."); return; }
    state.compareIds = input.checked ? [...state.compareIds, id] : state.compareIds.filter(x => x !== id); saveSelection(); renderCatalog();
  }));
  document.querySelector("#coverage-content").innerHTML = tests.length ? coverageHTML(tests) : "";
}

/* ---------- Compare: same scales, side by side ---------- */
function meterHTML(test, key) { const r = coefficientRange(test[key]); if (!r) return ""; const lo = Math.max(0, (r.min - .7) / .3 * 100), hi = Math.min(100, (r.max - .7) / .3 * 100); return `<div class="meter" aria-hidden="true"><i style="left:${lo}%;right:${100 - hi}%"></i></div>`; }
function cmpCell(test, key) {
  const coef = ["internal", "retest", "rater", "overall"].includes(key), acc = key === "accuracy";
  let head;
  if (coef) { const r = coefficientRange(test[key]); head = r ? `<span class="fig-value">${r.min === r.max ? fmtCoef(r.max) : `${fmtCoef(r.min)}–${fmtCoef(r.max)}`}</span>${meterHTML(test, key)}` : `<span class="fig-value none">—</span>`; }
  else if (acc) { const p = accuracyPair(test[key]); head = p ? `<div class="acc"><span>Sens.</span><i style="--w:${p.sens*100}%"></i><b>${Math.round(p.sens*100)}%</b><span>Spec.</span><i style="--w:${p.spec*100}%"></i><b>${Math.round(p.spec*100)}%</b></div>` : `<span class="fig-value none">—</span>`; }
  else if (key === "norms") { const n = sampleSize(test[key]); head = n != null ? `<span class="fig-value">N\u00a0=\u00a0${fmtInt(n)}</span>` : `<span class="fig-value none">—</span>`; }
  else if (["age", "time"].includes(key)) { const f = splitFigure(test[key]); head = f.big ? `<span class="fig-value">${escapeHTML(f.big)}</span>` : ""; }
  else head = "";
  const dup = ["age", "time"].includes(key) && splitFigure(test[key]).big === String(test[key]).trim();
  return `<div data-family="${testFamily(test)}" style="${shadeStyle(test)}">${head}${dup ? "" : `<p class="fig-note full">${escapeHTML(test[key])}</p>`}${acc ? `<p class="accuracy-context">${escapeHTML(test.accuracyContext)}</p>` : ""}<div class="source-row">${metricProof(test, key)}</div></div>`;
}
function renderComparison() {
  const tests = state.compareIds.map(id => state.catalog.find(t => t.id === id)).filter(Boolean);
  if (tests.length !== 2) return;
  const diffOnly = document.querySelector("#differences-only").checked;
  const rows = COMPARE_ROWS.filter(([, key]) => (key !== "overall" || tests.some(t => ["PPVT-5", "WAB-R"].includes(t.id))) && (!diffOnly || tests[0][key] !== tests[1][key]));
  document.querySelector("#comparison-content").innerHTML = `<div class="cmp-head"><span></span>${tests.map(t => `<div data-family="${testFamily(t)}" style="${shadeStyle(t)}"><strong>${escapeHTML(t.id)}</strong><span>${escapeHTML(t.scope)}</span></div>`).join("")}</div>
    <p class="cmp-note">Reliability coefficients describe different methods, not percentages. Accuracy depends on the cutoff and validation sample.</p>
    ${rows.map(([label, key]) => `<div class="cmp-row"><strong>${label}</strong>${tests.map(t => cmpCell(t, key)).join("")}</div>`).join("")}
    <div class="cmp-row"><strong>Primary source</strong>${tests.map(t => `<div>${sourceLink(t.source, t.source.label || "Primary source")}</div>`).join("")}</div>`;
}
function openComparison() { if (state.compareIds.length !== 2) { toast("Choose Compare on two assessments first."); return; } renderComparison(); document.querySelector("#compare-dialog").showModal(); }

/* ---------- Profile dossier ---------- */
function fieldHTML(label, value, proof = "", note = "") { return `<div class="field"><h5>${escapeHTML(label)}</h5><p>${escapeHTML(value)}</p>${note ? `<p class="note">${escapeHTML(note)}</p>` : ""}<div class="source-row">${proof}</div></div>`; }
function dossierHTML(test) {
  const metric = (label, key) => fieldHTML(label, test[key], metricProof(test, key));
  let clinical, background, administration;
  if (test.verified) {
    const labels = ["Full name", "Developed by", "Publisher", "Edition & release", "Clinical domain", "Age range", "Settings", "Purpose", "Skills measured", "Response demands", "Typical time", "Reliability", "Validity", "Sensitivity & specificity", "Normative sample", "Language & cultural fit", "Examiner qualifications", "Materials", "Administration time", "Environment", "Basal & ceiling", "Prompts & repetitions", "Accommodations", "Scoring"];
    const answer = i => {
      if ([5, 10, 13, 14, 18].includes(i)) return metric(labels[i], ({5: "age", 10: "time", 13: "accuracy", 14: "norms", 18: "time"})[i]);
      if (i === 11) return metric("Internal consistency", "internal") + metric("Test–retest", "retest") + metric("Scorer agreement", "rater");
      const q = test.assessment.questions[i];
      const proof = q.source_ids.map(id => { const s = test.assessment.sources.find(x => x.id === id); return sourceLink(s, s?.reference.split(".")[0]); }).join(" ");
      return fieldHTML(labels[i], q.answer, proof, q.note);
    };
    clinical = metric("Internal consistency", "internal") + (test.id === "PPVT-5" ? metric("Publisher overall summary", "overall") : "") + metric("Test–retest", "retest") + metric("Scorer / examiner agreement", "rater") + metric("Sensitivity & specificity", "accuracy") + metric("Normative sample", "norms") + [12, 15, 4, 7, 8].map(answer).join("") + `<details class="more"><summary>Reliability and accuracy context</summary>${[11, 13, 14].map(answer).join("")}</details>`;
    background = [0, 1, 2, 3, 6].map(answer).join("");
    administration = [18, 9, 16, 17, 19, 20, 21, 22, 23].map(answer).join("");
  } else {
    clinical = [["Internal consistency", "internal"], ["Other reliability summary", "overall"], ["Test–retest", "retest"], ["Scorer / examiner agreement", "rater"], ["Sensitivity & specificity", "accuracy"], ["Normative sample", "norms"], ["Clinical scope", "scope"], ["Language & dialect", "language"], ["Population", "population"], ["Response demands", "response"], ["Consider", "limit"]].map(([l, k]) => metric(l, k)).join("");
    const proof = sourceLink(test.source, test.source.label);
    background = [["Full name", test.name], ["Developed by", test.author], ["Publisher", test.publisher], ["Edition & release", test.edition]].map(([l, v]) => fieldHTML(l, v, proof)).join("");
    administration = [["Time", test.time], ["Administration", test.administration], ["Materials", test.materials], ["Qualifications", test.qualification]].map(([l, v]) => fieldHTML(l, v, proof)).join("");
    if (test.id === "CAAP-2") administration += fieldHTML("Response demands", "Picture naming and, for school-age children, sentence repetition.", sourceLink(test.retestSource, "Publisher training"));
  }
  const additional = test.records.filter(r => ["mode-agreement", "alternate-form", "reliability-summary", "accuracy-selected", "accuracy-adjusted", "accuracy-manual"].includes(r.key));
  if (additional.length) clinical += `<details class="more"><summary>Additional reported evidence</summary>${additional.map(r => fieldHTML(r.label, r.value, metricProof(test, r.key), r.note)).join("")}</details>`;
  const guides = relevantGuidance(test.domains, [test]);
  const asha = guides.length ? `<details class="more"><summary>ASHA evaluation context</summary><div class="guidance-grid">${guides.map(g => guidanceHTML(g, true)).join("")}</div></details>` : "";
  const {family, label} = familyOf(test);
  const checked = [...new Set(test.records.map(r => r.checked_on).filter(Boolean))].sort().at(-1);
  const tile = (lbl, key, opts = {}) => { const s = recordStatus(test, key); return `<div class="tile" data-family="${family}" style="${shadeStyle(test)}">${glyph(s)}${figureHTML(test, key, lbl, {...opts, full: true})}</div>`; };
  const relKey = reliabilityKeyFor(test);
  return `<header class="dossier-head" data-family="${family}" style="${shadeStyle(test)}"><div><span class="fam"><i class="fam-dot"></i>${escapeHTML(label)}</span><h3>${escapeHTML(test.id)}</h3><p class="fullname">${escapeHTML(test.name)}</p><p class="meta">${[test.publisher, test.edition].filter(Boolean).map(escapeHTML).join(" · ")}</p></div><div class="stamp">${statusLine(test)}<time datetime="${escapeHTML(checked || "")}">${test.records.length} evidence records · checked ${escapeHTML(checked || "see records")}</time></div></header>
  <div class="wall">${tile("Age range", "age")}${tile("Administration", "time")}${tile(relKey === "rater" ? "Scorer agreement" : relKey === "overall" ? "Reliability · overall" : "Internal consistency", relKey, {kind: "coef", scale: true})}${tile("Test–retest", "retest", {kind: "coef", scale: true})}${tile("Diagnostic accuracy", "accuracy", {kind: "acc"})}${tile("Normative sample", "norms", {kind: "n"})}</div>
  <nav class="dossier-nav" aria-label="Profile sections"><a href="#d-clinical">Clinical evidence</a><a href="#d-background">Background</a><a href="#d-administration">Administration</a></nav>
  <section id="d-clinical"><h4>Clinical evidence</h4>${clinical}${asha}</section>
  <section id="d-background"><h4>Background</h4>${background}</section>
  <section id="d-administration"><h4>Administration</h4>${administration}</section>`;
}
function openEvidence(id) {
  const test = state.catalog.find(t => t.id === id); if (!test) return;
  document.querySelector("#evidence-title").innerHTML = `<b>${escapeHTML(test.id)}</b> · ${escapeHTML(test.scope)}`;
  document.querySelector("#evidence-content").innerHTML = dossierHTML(test);
  const dialog = document.querySelector("#evidence-dialog");
  dialog.querySelectorAll(".dossier-nav a").forEach(a => a.addEventListener("click", e => { e.preventDefault(); dialog.querySelector(a.getAttribute("href")).scrollIntoView({behavior: "smooth", block: "start"}); }));
  dialog.showModal(); dialog.scrollTop = 0;
}

/* ---------- Evidence record ---------- */
function openReceipt(id, key) {
  const test = state.catalog.find(t => t.id === id), record = test?.records.find(r => r.key === key); if (!record) return;
  const status = recordStatusOf(record);
  document.querySelector("#receipt-title").innerHTML = `<b>${escapeHTML(id)}</b> · ${escapeHTML(record.label)}`;
  const row = (label, value, cls = "") => `<div><dt>${label}</dt><dd class="${value == null ? "muted" : cls}">${escapeHTML(value ?? "Not specified in source")}</dd></div>`;
  document.querySelector("#receipt-content").innerHTML = `<span class="label">Reported value</span><p class="record-value">${escapeHTML(record.value)}</p>
    <div class="record-status">${glyph(status)}<span><b>${status.label}.</b> ${escapeHTML(STATUS_TEXT[status.cls] || "")}</span></div>
    <dl class="record-details">${row("Test / edition", test.edition || test.name)}${row("Subtest / score", record.subtest)}${row("Method", record.method)}${row("Population", record.population)}${row("Sample size", record.sample_size)}${row("Cutoff", record.cutoff)}${row("Page / location", record.locator, "mono")}${row("Checked", record.checked_on, "mono")}</dl>
    ${record.note ? `<p class="receipt-note">${escapeHTML(record.note)}</p>` : ""}
    <div class="record-sources"><span class="label">Cited sources</span>${metricSources(test, key).map(s => `<article><h3>${escapeHTML(s.label)}</h3><div><span class="source-type">${sourceRole(s.type)}</span></div><p>Published ${escapeHTML(s.published_on || "date not stated")} · ${escapeHTML(s.access || "public")} access${s.locator ? ` · ${escapeHTML(s.locator)}` : ""}</p>${sourceLink(s, "Open original source")}</article>`).join("") || '<p class="receipt-note">No public source is attached to this record.</p>'}</div>`;
  const d = document.querySelector("#receipt-dialog"); d.showModal(); d.scrollTop = 0;
}

/* ---------- Evidence ledger (research view) ---------- */
function renderResearch() {
  const sourceCount = new Set(state.catalog.flatMap(t => t.sources.map(s => s.url)).filter(Boolean)).size;
  const records = state.catalog.reduce((n, t) => n + t.records.length, 0);
  const differs = state.catalog.reduce((n, t) => n + t.records.filter(r => r.status === "conflicting").length, 0);
  const checked = [...new Set(state.catalog.flatMap(t => t.records.map(r => r.checked_on)).filter(Boolean))].sort().at(-1);
  document.querySelector("#research-content").innerHTML = `<div class="ledger-stats"><div><strong>${state.catalog.length}</strong><span>assessments</span></div><div><strong>${records}</strong><span>evidence records</span></div><div><strong>${sourceCount}</strong><span>linked sources</span></div><div><strong>${differs}</strong><span>records where sources differ</span></div><div><strong>${state.guidance.length}</strong><span>ASHA guidance areas</span></div></div>
    <p class="audit-note">All ${state.catalog.length} assessments rechecked on ${escapeHTML(longDate(checked))}. Figures identify publisher reports, manual excerpts, research studies, and technical reviews. Open a record for its method, sample, and remaining limits. <a href="research/PERSONAL-AUDIT.md" target="_blank" rel="noopener">Read the assessment-by-assessment audit</a>.</p>
    <div class="ledger">${state.catalog.map(t => `<details data-family="${testFamily(t)}" style="${shadeStyle(t)}"><summary><span class="sr-only">Toggle</span><strong>${escapeHTML(t.id)}</strong><em>${escapeHTML(t.scope)}</em><span>${t.records.length} records · ${t.sources.length} sources · ${t.records.filter(r => r.status === "conflicting").length} differ</span></summary><div class="records">${t.records.map(r => { const s = recordStatusOf(r); return `<button class="record" data-test="${t.id}" data-receipt="${r.key}"><span class="label">${escapeHTML(r.label)}${glyph(s)}</span><strong>${escapeHTML(r.value)}</strong><small>${s.label} · ${escapeHTML(r.checked_on)}</small></button>`; }).join("")}</div><div class="source-directory">${t.sources.map(s => `<p><span class="source-type">${sourceRole(s.type)}</span>${sourceLink(s, s.label)}</p>`).join("")}</div></details>`).join("")}</div>
    <h2 class="research-subheading">ASHA guidance and research</h2><div class="guidance-grid">${state.guidance.map(g => guidanceHTML(g)).join("")}</div>
    <div class="study-grid">${state.guidance.flatMap(g => g.studies || []).map(study => `<article class="study-card"><h3>${escapeHTML(study.title)}</h3><span class="source-type">Research study · ${escapeHTML(study.year)}</span><p>${escapeHTML(study.findings)}</p><dl><dt>Method</dt><dd>${escapeHTML(study.method)}</dd><dt>Population / sample</dt><dd>${escapeHTML(study.population)} · N = ${escapeHTML(study.sample_size)}</dd><dt>Cutoff</dt><dd>${escapeHTML(study.cutoff || "See the study’s classification model")}</dd></dl><p class="receipt-note">${escapeHTML(study.limitation)}</p>${sourceLink(study, "Read the study")}</article>`).join("")}</div>`;
}

/* ---------- Boot (called from data.js once the catalog is assembled) ---------- */
// The atlas opens with every assessment shown; the client age is set by the user.
function init() { setupFilters(); const y = document.querySelector("#age-years").value, m = document.querySelector("#age-months").value; state.ageMonths = y === "" && m === "" ? null : Number(y || 0) * 12 + Number(m || 0); setupNavigation(); renderCatalog(); renderResearch(); }
