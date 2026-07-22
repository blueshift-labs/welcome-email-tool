/**
 * Recipients.gs — read the Roster tab into grouped Cc candidates and a Bcc list.
 *
 * Roster tab columns (header row, any order):
 *   Group | Name | Email | Default
 *   - Group: "CSM", "Sales", "SE" ... become Cc groups.
 *            "Bcc" or anything containing "notify" -> the Bcc list.
 *   - Default: y/yes/true/1/x  -> pre-checked in the dialog.
 */

function readRoster_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.ROSTER_SHEET);
  if (!sheet) return { cc: {}, bcc: [] };

  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return { cc: {}, bcc: [] };

  const headers = rows.shift().map(function (h) { return String(h).trim().toLowerCase(); });
  const gi = headers.indexOf('group');
  const ni = headers.indexOf('name');
  const ei = headers.indexOf('email');
  const di = headers.indexOf('default');

  const cc = {};   // { groupName: [{name, email, checked}] }
  const bcc = [];  // [{name, email, checked}]

  rows.forEach(function (r) {
    const email = clean_(ei > -1 ? r[ei] : '');
    if (!email) return;
    const group = clean_(gi > -1 ? r[gi] : '');
    const person = {
      name: clean_(ni > -1 ? r[ni] : '') || email,
      email: email,
      checked: /^(y|yes|true|1|x)$/i.test(clean_(di > -1 ? r[di] : '')),
    };
    if (/^bcc$/i.test(group) || /notify/i.test(group)) {
      bcc.push(person);
    } else {
      const key = group || 'Other';
      (cc[key] = cc[key] || []).push(person);
    }
  });

  return { cc: cc, bcc: bcc };
}
