/**
 * Cleanup.gs — read the selected response row and map/normalize it into
 * template variables. This is where the "form data needs cleaning" lives.
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
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const values = sheet.getRange(row, 1, 1, lastCol).getValues()[0];
  const obj = {};
  headers.forEach(function (h, i) { obj[String(h).trim()] = values[i]; });
  obj.__row = row;
  return obj;
}

// ---- small normalization helpers (extend as needed) ----
function clean_(v) { return (v === null || v === undefined) ? '' : String(v).trim(); }
function titleCase_(v) {
  return clean_(v).toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}

/** Map a response row -> template variables using FIELD_MAP, with light cleanup. */
function mapRowToVariables_(rowObj) {
  const vars = {};
  Object.keys(FIELD_MAP).forEach(function (varName) {
    const col = FIELD_MAP[varName];
    const raw = rowObj[col];
    let val = clean_(raw);

    // Example normalizations — tweak to taste:
    if (/name|company|account/i.test(varName)) val = titleCase_(val);
    if (/date/i.test(varName) && raw instanceof Date) {
      val = Utilities.formatDate(raw, Session.getScriptTimeZone(), 'MMMM d, yyyy');
    }
    vars[varName] = val;
  });
  return vars;
}

/** Pull the To: email(s) from the configured column (comma/semicolon separated ok). */
function toEmailsFromRow_(rowObj) {
  return clean_(rowObj[CONFIG.TO_EMAIL_COLUMN])
    .split(/[;,]/)
    .map(function (s) { return s.trim(); })
    .filter(Boolean);
}
