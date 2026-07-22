/**
 * Cleanup.gs — read the selected response row and map/normalize it into
 * template variables + recipients. This is where "form data needs cleaning" lives.
 */

/** Read the currently selected row of the Responses tab as {header: value}. */
function readSelectedResponseRow_() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(CONFIG.RESPONSES_SHEET);
  if (!sheet) throw new Error('Tab not found: "' + CONFIG.RESPONSES_SHEET + '". Fix RESPONSES_SHEET in Config.gs.');
  if (ss.getActiveSheet().getName() !== CONFIG.RESPONSES_SHEET) {
    throw new Error('Click a row in the "' + CONFIG.RESPONSES_SHEET + '" tab first, then run this.');
  }
  const row = sheet.getActiveCell().getRow();
  if (row < 2) throw new Error('Select a data row, not the header row.');

  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim(); });
  const values = sheet.getRange(row, 1, 1, lastCol).getValues()[0];
  const obj = { __row: row, __headers: headers };
  headers.forEach(function (h, i) { obj[h] = values[i]; });
  return obj;
}

// ---- helpers ----
function clean_(v) { return (v === null || v === undefined) ? '' : String(v).trim(); }
function titleCase_(v) {
  return clean_(v).toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}
function extractEmails_(text) {
  const m = clean_(text).match(/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/gi);
  return m ? m.map(function (e) { return e.toLowerCase(); }) : [];
}
// Turn "[www.x.com](https://www.x.com)" into "https://www.x.com" (or the visible text).
function cleanLink_(v) {
  const s = clean_(v);
  const m = s.match(/\[([^\]]+)\]\(([^)]+)\)/);
  return m ? (m[2] || m[1]) : s;
}

/**
 * Resolve a column header from a distinctive key:
 * exact -> case-insensitive exact -> starts-with -> contains.
 */
function resolveCol_(headers, key) {
  const k = key.trim(), kl = k.toLowerCase();
  let hit = headers.find(function (h) { return h === k; });
  if (hit) return hit;
  hit = headers.find(function (h) { return h.toLowerCase() === kl; });
  if (hit) return hit;
  hit = headers.find(function (h) { return h.toLowerCase().indexOf(kl) === 0; });
  if (hit) return hit;
  hit = headers.find(function (h) { return h.toLowerCase().indexOf(kl) !== -1; });
  return hit || null;
}
function cell_(rowObj, key) {
  const col = resolveCol_(rowObj.__headers, key);
  return col ? rowObj[col] : '';
}

/** Is the selected row obviously a test/placeholder row? */
function looksLikeTestRow_(rowObj) {
  const hay = (clean_(cell_(rowObj, 'Company Name')) + ' ' + clean_(cell_(rowObj, 'Site name'))).toLowerCase();
  return CONFIG.TEST_ROW_MARKERS.some(function (m) { return hay.indexOf(m) !== -1; });
}

/** Map a response row -> template variables via FIELD_MAP, with light cleanup. */
function mapRowToVariables_(rowObj) {
  const vars = {};
  Object.keys(FIELD_MAP).forEach(function (varName) {
    const raw = cell_(rowObj, FIELD_MAP[varName]);
    let val = clean_(raw);
    if (/name|company|contact|admin/i.test(varName) && !/role|description/i.test(varName)) val = titleCase_(val);
    if (/date/i.test(varName) && raw instanceof Date) {
      val = Utilities.formatDate(raw, Session.getScriptTimeZone(), 'MMMM d, yyyy');
    }
    vars[varName] = val;
  });
  return vars;
}

/**
 * Build the To: list = emails from TO_EMAIL_COLUMNS + any real emails found in the
 * Additional People column. De-duplicated, lowercased.
 */
function toEmailsFromRow_(rowObj) {
  const found = [];
  CONFIG.TO_EMAIL_COLUMNS.forEach(function (colKey) {
    extractEmails_(cell_(rowObj, colKey)).forEach(function (e) { found.push(e); });
  });
  extractEmails_(cell_(rowObj, CONFIG.ADDITIONAL_PEOPLE_COLUMN)).forEach(function (e) { found.push(e); });
  return dedupe_(found);
}

/** The submitting sales rep's email, for a default Cc. */
function salesRepEmail_(rowObj) {
  const e = extractEmails_(cell_(rowObj, CONFIG.SALES_REP_COLUMN));
  return e.length ? e[0] : '';
}

/** Raw "Additional People" text (often names/roles, not emails) — shown for manual add. */
function additionalPeopleNote_(rowObj) {
  return clean_(cell_(rowObj, CONFIG.ADDITIONAL_PEOPLE_COLUMN));
}

function dedupe_(arr) {
  const seen = {}, out = [];
  arr.forEach(function (x) { const k = x.toLowerCase(); if (x && !seen[k]) { seen[k] = 1; out.push(x); } });
  return out;
}
