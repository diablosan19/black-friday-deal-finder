// Deal Lantern — render, search, filter, sort, hash routes.
// Data: DEALS from data.js (checked 27 Nov 2026). No network calls anywhere.

import { DEALS, CHECKED_DAY, DEAL_COUNT } from "./data.js";
import { cardHTML, pickHTML, detailHTML, esc } from "./views.js";

const grid = document.getElementById("grid");
const countLine = document.getElementById("countline");
const detailBox = document.getElementById("detail");
const gridSection = document.getElementById("gridsec");
const picksSection = document.getElementById("picks");
const searchBox = document.getElementById("q");
const catSel = document.getElementById("cat");
const storeSel = document.getElementById("store");
const discSel = document.getElementById("mindisc");
const sortSel = document.getElementById("sort");

const state = { q: "", cat: "", store: "", mindisc: 0, sort: "pct" };

// Cheapest row per cross-store group, for the "cheapest here" flag.
const cheapestId = new Set();
const byGroup = new Map();
for (const d of DEALS) {
  if (!d.group) continue;
  if (!byGroup.has(d.group)) byGroup.set(d.group, []);
  byGroup.get(d.group).push(d);
}
for (const rows of byGroup.values()) {
  if (rows.length > 1) {
    cheapestId.add(rows.slice().sort((a, b) => a.sale - b.sale)[0].id);
  }
}

function fillSelects() {
  const cats = [...new Set(DEALS.map((d) => d.cat))].sort();
  const stores = [...new Set(DEALS.map((d) => d.store))].sort();
  for (const c of cats) {
    const o = document.createElement("option");
    o.value = c; o.textContent = c + " (" + DEALS.filter((d) => d.cat === c).length + ")";
    catSel.appendChild(o);
  }
  for (const s of stores) {
    const o = document.createElement("option");
    o.value = s; o.textContent = s + " (" + DEALS.filter((d) => d.store === s).length + ")";
    storeSel.appendChild(o);
  }
}

function filtered() {
  const q = state.q.trim().toLowerCase();
  let rows = DEALS.filter((d) => {
    if (state.cat && d.cat !== state.cat) return false;
    if (state.store && d.store !== state.store) return false;
    if (d.pct < state.mindisc) return false;
    if (q && !(d.name.toLowerCase().includes(q) || d.store.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q))) return false;
    return true;
  });
  const by = {
    pct: (a, b) => b.pct - a.pct || b.save - a.save,
    save: (a, b) => b.save - a.save || b.pct - a.pct,
    low: (a, b) => a.sale - b.sale || b.pct - a.pct,
  }[state.sort];
  return rows.sort(by);
}

function renderGrid() {
  const rows = filtered();
  countLine.innerHTML = "Showing <b>" + rows.length + "</b> of <b>" + DEAL_COUNT
    + "</b> deals · checked " + CHECKED_DAY + ", 2026 · prices in USD";
  if (!rows.length) {
    grid.innerHTML = '<div class="empty">No deals match those filters. Loosen the search or the discount bar.</div>';
    return;
  }
  grid.innerHTML = rows.map((d) => cardHTML(d, cheapestId.has(d.id))).join("");
}

function renderPicks() {
  const best = DEALS.filter((d) => d.pct >= 40)
    .slice().sort((a, b) => b.save - a.save).slice(0, 6);
  document.getElementById("pickstrip").innerHTML = best.map(pickHTML).join("");
}

function route() {
  const m = location.hash.match(/^#\/deal\/(d\d+)$/);
  if (m) {
    const d = DEALS.find((x) => x.id === m[1]);
    if (d) {
      const sibs = d.group ? byGroup.get(d.group) || [d] : [d];
      detailBox.innerHTML = detailHTML(d, sibs);
      detailBox.hidden = false;
      picksSection.hidden = true;
      gridSection.hidden = false;
      window.scrollTo(0, 0);
      document.title = d.name + " — " + d.store + " · Deal Lantern";
      window.__shotReady = true;
      return;
    }
  }
  detailBox.hidden = true;
  detailBox.innerHTML = "";
  gridSection.hidden = false;
  picksSection.hidden = false;
  document.title = "Deal Lantern — Black Friday deals, checked 27 Nov 2026";
  renderGrid();
  window.__shotReady = true;
}

searchBox.addEventListener("input", () => { state.q = searchBox.value; renderGrid(); });
catSel.addEventListener("change", () => { state.cat = catSel.value; renderGrid(); });
storeSel.addEventListener("change", () => { state.store = storeSel.value; renderGrid(); });
discSel.addEventListener("change", () => { state.mindisc = Number(discSel.value); renderGrid(); });
sortSel.addEventListener("change", () => { state.sort = sortSel.value; renderGrid(); });
window.addEventListener("hashchange", route);

function applyUrlParams() {
  // Shareable filtered links, e.g. ?q=headphones&store=Amazon&mindisc=40&sort=save
  const p = new URLSearchParams(location.search);
  if (p.get("q")) { state.q = p.get("q"); searchBox.value = state.q; }
  if (p.get("cat")) { state.cat = p.get("cat"); catSel.value = state.cat; }
  if (p.get("store")) { state.store = p.get("store"); storeSel.value = state.store; }
  if (p.get("mindisc")) { state.mindisc = Number(p.get("mindisc")); discSel.value = String(state.mindisc); }
  if (p.get("sort")) { state.sort = p.get("sort"); sortSel.value = state.sort; }
}

fillSelects();
applyUrlParams();
renderPicks();
route();
