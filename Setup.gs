/**
 * Setup.gs — One-time setup functions to initialize the sheet structure
 * Run these functions from the Apps Script editor to set up your sheet
 */

/**
 * Creates the Roster tab with headers and sample data.
 * Safe to run multiple times - will only create if tab doesn't exist.
 */
function setupRosterTab() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Check if Roster sheet already exists
  let rosterSheet = ss.getSheetByName(CONFIG.ROSTER_SHEET);

  if (rosterSheet) {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Roster tab already exists',
      'Do you want to overwrite it with sample data? (This will clear existing data)',
      ui.ButtonSet.YES_NO
    );

    if (response === ui.Button.NO) {
      ui.alert('Setup cancelled. Roster tab was not modified.');
      return;
    }

    // Clear existing data
    rosterSheet.clear();
  } else {
    // Create new sheet
    rosterSheet = ss.insertSheet(CONFIG.ROSTER_SHEET);
  }

  // Set up headers
  const headers = ['Group', 'Name', 'Email', 'Default'];
  rosterSheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');

  // Add sample data
  const sampleData = [
    ['CSM', 'Jane Doe', 'jane@company.com', 'yes'],
    ['CSM', 'John Smith', 'john@company.com', ''],
    ['Sales', 'Rob Wilson', 'rob@company.com', 'yes'],
    ['Sales', 'Sarah Chen', 'sarah@company.com', ''],
    ['SE', 'Amy Lee', 'amy@company.com', 'yes'],
    ['SE', 'Mike Johnson', 'mike@company.com', ''],
    ['Bcc', 'Operations Team', 'ops@company.com', 'yes'],
    ['Bcc', 'Success Team', 'success@company.com', ''],
  ];

  rosterSheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    rosterSheet.autoResizeColumn(i);
  }

  // Freeze header row
  rosterSheet.setFrozenRows(1);

  SpreadsheetApp.getUi().alert(
    'Roster Setup Complete',
    `Created "${CONFIG.ROSTER_SHEET}" tab with sample data.\n\n` +
    'Update the names and emails to match your team.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Creates a sample Form Responses tab with test data.
 * This helps you test the tool without real form data.
 */
function setupSampleResponses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Check if responses sheet already exists
  let responseSheet = ss.getSheetByName(CONFIG.RESPONSES_SHEET);

  if (responseSheet) {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'Form Responses tab already exists',
      'Do you want to add sample data to it? (This will add rows, not replace)',
      ui.ButtonSet.YES_NO
    );

    if (response === ui.Button.NO) {
      ui.alert('Setup cancelled. Form Responses tab was not modified.');
      return;
    }
  } else {
    // Create new sheet
    responseSheet = ss.insertSheet(CONFIG.RESPONSES_SHEET);
  }

  // Get headers from FIELD_MAP (right side = column headers)
  const headers = [
    'Timestamp',
    CONFIG.TO_EMAIL_COLUMN,
    ...Object.values(FIELD_MAP)
  ];

  // Check if headers exist
  const lastCol = responseSheet.getLastColumn();
  let hasHeaders = false;
  if (lastCol > 0) {
    const existingHeaders = responseSheet.getRange(1, 1, 1, lastCol).getValues()[0];
    hasHeaders = existingHeaders.some(h => h !== '');
  }

  if (!hasHeaders) {
    // Add headers
    responseSheet.getRange(1, 1, 1, headers.length)
      .setValues([headers])
      .setFontWeight('bold')
      .setBackground('#34a853')
      .setFontColor('white');
  }

  // Add sample data
  const sampleData = [
    [
      new Date(),
      'customer1@example.com',
      'Alice',
      'Johnson',
      'Acme Corporation',
      'Enterprise',
      '2026-08-01'
    ],
    [
      new Date(),
      'customer2@example.com',
      'Bob',
      'Martinez',
      'TechStart Inc',
      'Professional',
      '2026-08-15'
    ],
    [
      new Date(),
      'customer3@example.com',
      'Carol',
      'Williams',
      'Global Solutions LLC',
      'Enterprise',
      '2026-09-01'
    ],
  ];

  const lastRow = responseSheet.getLastRow();
  responseSheet.getRange(lastRow + 1, 1, sampleData.length, headers.length).setValues(sampleData);

  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    responseSheet.autoResizeColumn(i);
  }

  // Freeze header row
  responseSheet.setFrozenRows(1);

  SpreadsheetApp.getUi().alert(
    'Sample Data Setup Complete',
    `Added ${sampleData.length} sample rows to "${CONFIG.RESPONSES_SHEET}" tab.\n\n` +
    'You can now test the Welcome Email tool with this data.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Runs both setup functions in sequence.
 * Use this for first-time setup of a new sheet.
 */
function setupEverything() {
  setupRosterTab();
  setupSampleResponses();

  SpreadsheetApp.getUi().alert(
    'Setup Complete!',
    'Your sheet is ready to use.\n\n' +
    'Next steps:\n' +
    '1. Review and customize the Roster tab\n' +
    '2. Set your Blueshift API key (Welcome Email menu)\n' +
    '3. Test by selecting a row and creating a draft',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
