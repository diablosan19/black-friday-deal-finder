// Deal Lantern views: deal cards, the detail page, and the category glyphs.
// Every glyph is a small inline SVG drawn here; no external images anywhere.

export function money(n) {
  const s = n.toFixed(2);
  return "$" + (s.endsWith(".00") ? s.slice(0, -3) : s);
}

export function priceText(d) {
  const per = d.per === "month" ? "/mo" : d.per === "year" ? "/yr" : "";
  return money(d.sale) + per;
}

const GLYPHS = {
  "TVs": '<rect x="3" y="5" width="26" height="17" rx="2"/><path d="M12 26h8M16 22v4"/>',
  "Laptops": '<rect x="4" y="6" width="24" height="15" rx="2"/><path d="M2 25h28"/>',
  "Headphones": '<path d="M6 20a10 10 0 0 1 20 0"/><rect x="4" y="19" width="6" height="9" rx="2"/><rect x="22" y="19" width="6" height="9" rx="2"/>',
  "Smart home": '<path d="M4 16 16 5l12 11"/><path d="M8 15v11h16V15"/>',
  "Gaming": '<rect x="3" y="9" width="26" height="13" rx="6"/><path d="M10 13v5M8 15.5h5"/><circle cx="22" cy="14" r="1.4"/><circle cx="25" cy="18" r="1.4"/>',
  "Phones": '<rect x="9" y="3" width="14" height="26" rx="3"/><path d="M13 25h6"/>',
  "Tablets": '<rect x="5" y="4" width="22" height="24" rx="2"/><path d="M14 24h4"/>',
  "Appliances": '<rect x="7" y="4" width="18" height="24" rx="2"/><path d="M7 12h18M12 18h4"/>',
  "Fashion": '<path d="M11 5 5 8l3 5 3-2v16h10V11l3 2 3-5-6-3a4 4 0 0 1-10 0Z"/>',
  "Toys": '<circle cx="11" cy="11" r="6"/><path d="M15 15l9 9M21 21l2-2M23 23l2-2"/>',
  "Kitchen": '<path d="M5 10h22v4a11 11 0 0 1-22 0Z"/><path d="M10 5v3M16 5v3M22 5v3"/>',
  "Streaming": '<rect x="3" y="6" width="26" height="18" rx="3"/><path d="M13 11l8 3.5-8 3.5Z"/>',
  "Wearables": '<circle cx="16" cy="16" r="9"/><path d="M16 11v5l3.5 2"/>',
  "Cameras": '<rect x="3" y="10" width="26" height="15" rx="2"/><circle cx="16" cy="17" r="4.5"/><path d="M11 10l2-4h6l2 4"/>',
  "Accessories": '<rect x="8" y="8" width="16" height="16" rx="3"/><path d="M11 8V5a3 3 0 0 1 6 0v3"/>',
  "Tools": '<path d="M20 6a5 5 0 0 0-6.5 6.5L6 20l2 2 7.5-7.5A5 5 0 0 0 26 8l-3 3-4-2-2-4Z"/>',
  "Makers": '<path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
  "Audio": '<rect x="5" y="11" width="6" height="10" rx="2"/><path d="M11 13l10-6v18l-10-6"/>',
  "PC parts": '<rect x="5" y="5" width="22" height="22" rx="2"/><rect x="11" y="11" width="10" height="10" rx="1"/><path d="M8 9h.5M8 14h.5M8 19h.5M23 9h.5M23 14h.5M23 19h.5"/>',
  "Subscriptions": '<rect x="4" y="6" width="24" height="20" rx="3"/><path d="M4 12h24M9 9h.5M9 17h7"/>',
  "Home": '<path d="M4 16 16 5l12 11"/><path d="M8 15v11h16V15"/><circle cx="16" cy="19" r="2"/>',
  "Travel": '<rect x="7" y="9" width="18" height="15" rx="3"/><path d="M12 9V5h8v4M12 15h.5"/>',
  "Gift cards": '<rect x="3" y="7" width="26" height="18" rx="2"/><path d="M3 12h26M16 7v18"/>',
};

export function glyph(cat) {
  const body = GLYPHS[cat] || GLYPHS["Accessories"];
  return '<svg viewBox="0 0 32 32" fill="none" stroke="#b45309" stroke-width="2" '
    + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
}

const VERDICT_CLASS = {
  "NEW LOW": "newlow",
  "STRONG DEAL": "strong",
  "GOOD DEAL": "good",
  "ROUTINE SALE": "routine",
};

export function verdictBadge(v) {
  return '<span class="verdict ' + (VERDICT_CLASS[v] || "routine") + '">' + v + "</span>";
}

export function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function cardHTML(d, isCheapest) {
  return '<a class="card" href="#/deal/' + d.id + '">'
    + '<div class="top"><span class="glyph">' + glyph(d.cat) + "</span>"
    + "<div><h3>" + esc(d.name) + "</h3>"
    + '<span class="storechip">' + esc(d.store) + "</span></div></div>"
    + '<div class="prices"><span class="sale">' + priceText(d) + "</span>"
    + '<span class="was">was <s>' + money(d.usual) + "</s></span>"
    + '<span class="offbadge">−' + d.pct + "%</span></div>"
    + verdictBadge(d.verdict)
    + (isCheapest ? '<div class="cheapest">★ Cheapest here</div>' : "")
    + '<div class="meta">Checked ' + esc(d.checked) + "<br>"
    + '<span class="src">Source: ' + esc(d.source) + " · " + esc(d.cat) + "</span></div>"
    + "</a>";
}

export function pickHTML(d) {
  return '<a class="pick" href="#/deal/' + d.id + '">'
    + '<div class="pname">' + esc(d.name) + "</div>"
    + '<div class="pprice">' + priceText(d) + "</div>"
    + '<div class="pwas"><s>' + money(d.usual) + "</s> · −" + d.pct + "%</div>"
    + '<div class="psave">Save ' + money(d.save) + " · " + esc(d.store) + "</div>"
    + "</a>";
}

export function verdictReason(d) {
  if (d.note) return d.note;
  if (d.verdict === "NEW LOW") {
    return "The source names this the lowest price it has seen for this product.";
  }
  if (d.verdict === "STRONG DEAL") {
    return "A " + d.pct + "% cut against a verified usual price of " + money(d.usual)
      + " — a saving of " + money(d.save) + " on a product the source lists at that usual price.";
  }
  if (d.verdict === "GOOD DEAL") {
    return "A solid " + d.pct + "% off the verified usual price of " + money(d.usual)
      + ", saving " + money(d.save) + ".";
  }
  return "A small " + d.pct + "% cut — real, but not a standout; the usual price of "
    + money(d.usual) + " leaves only " + money(d.save) + " on the table.";
}

export function detailHTML(d, siblings) {
  let html = '<div class="detail">'
    + '<a class="back" href="#/">&larr; All deals</a>'
    + "<h2>" + esc(d.name) + "</h2>"
    + '<div class="dstore">' + esc(d.store) + " · " + esc(d.cat) + "</div>"
    + '<div class="dprices"><span class="sale">' + priceText(d) + "</span>"
    + '<span class="was">usual <s>' + money(d.usual) + "</s></span>"
    + '<span class="offbadge">−' + d.pct + "%</span></div>"
    + '<div class="dsave">You save ' + money(d.save)
    + (d.per === "month" ? " every month" : d.per === "year" ? " every year" : "") + "</div>"
    + verdictBadge(d.verdict)
    + '<div class="why"><b>Is it really a deal?</b>' + esc(verdictReason(d)) + "</div>"
    + '<div class="facts">'
    + "<b>Store:</b> " + esc(d.store) + "<br>"
    + "<b>Sale price:</b> " + priceText(d) + "<br>"
    + "<b>Usual price:</b> " + money(d.usual) + "<br>"
    + "<b>Discount:</b> " + d.pct + "% (" + money(d.save) + " off)<br>"
    + "<b>Checked:</b> " + esc(d.checked) + "<br>"
    + "<b>Price source:</b> " + esc(d.source) + "</div>"
    + '<a class="cta" href="' + esc(d.url) + '" target="_blank" rel="noopener">View this deal &rarr;</a>'
    + '<div class="cta-note">Link opens the ' + esc(d.source)
    + ' roundup where this price was read today — it names this product at '
    + esc(d.store) + ". Prices change fast; confirm at checkout.</div>";
  if (siblings.length > 1) {
    const sorted = siblings.slice().sort((a, b) => a.sale - b.sale);
    html += '<div class="compare"><h3>Same product at other stores</h3><table>'
      + "<tr><th>Store</th><th>Price</th><th>Usual</th><th>Off</th><th></th></tr>";
    for (const s of sorted) {
      const cheap = s.id === sorted[0].id;
      html += '<tr' + (cheap ? ' class="cheapest-row"' : "") + "><td>"
        + (s.id === d.id ? "<b>" + esc(s.store) + "</b>" : esc(s.store)) + "</td><td>"
        + priceText(s) + "</td><td><s>" + money(s.usual) + "</s></td><td>−" + s.pct + "%</td><td>"
        + (cheap ? '<span class="flag">★ cheapest</span>' : "")
        + "</td></tr>";
    }
    html += "</table></div>";
  }
  html += "</div>";
  return html;
}
