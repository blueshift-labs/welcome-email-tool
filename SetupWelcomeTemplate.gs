/**
 * SetupWelcomeTemplate.gs - Creates sheet structure for Welcome Email template
 * Run this to set up columns matching your Blueshift template variables
 */

/**
 * Creates Form Responses sheet with all columns needed for Welcome Email template.
 * Safe to run - prompts before overwriting existing data.
 */
function setupWelcomeEmailColumns() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Check if sheet exists
  let responseSheet = ss.getSheetByName(CONFIG.RESPONSES_SHEET);

  if (responseSheet && responseSheet.getLastRow() > 1) {
    const response = ui.alert(
      'Sheet Has Data',
      'The "' + CONFIG.RESPONSES_SHEET + '" sheet has existing data.\n\n' +
      'Do you want to:\n' +
      '• Add missing columns (keeps existing data)\n' +
      '• Or cancel and do nothing?',
      ui.ButtonSet.OK_CANCEL
    );

    if (response === ui.Button.CANCEL) {
      ui.alert('Setup cancelled. No changes made.');
      return;
    }
  } else if (!responseSheet) {
    responseSheet = ss.insertSheet(CONFIG.RESPONSES_SHEET);
  }

  // Define all columns for Welcome Email template
  const headers = [
    'Timestamp',

    // === Submitter Info ===
    'Email Address',  // Sales rep who submitted form

    // === Customer Info ===
    'Company Name',
    'Site name',  // account identifier
    'Website URL',
    'Email Alias',  // e.g., customer@getblueshift.com

    // Additional customers (for multi-site setups)
    'Additional Customer 2',
    'Additional Account 2',
    'Additional Website 2',
    'Additional Account 3',
    'Additional Account 4',
    'Additional Account 5',

    // === Plan & Features ===
    'Plan',  // Premium, Enterprise, etc.
    'Platform Tier',
    'Support Level',
    'Which Blueshift features are included',

    // === Team Assignment Flags (Yes/No) ===
    'PM Included',
    'Delivery Included',
    'Delivery Assigned',
    'Product Consultant Assigned',
    'CSM Assigned',

    // === Team Members ===
    'Product Consultant Name',
    'Product Consultant Email',
    'CSM Name',
    'CSM Email',
    'Delivery Strategist Name',
    'Delivery Strategist Email',
    'Project Manager Name',
    'Project Manager Email',

    // === Primary Client Contacts ===
    'Primary Contact First Name',
    'Primary Contact Last Name',
    'Primary contact email',
    'Primary contact role',

    'Primary Admin First Name',
    'Primary Admin Last Name',
    'Primary Admin Email',
    'Primary Admin Role',

    // === Additional Client Contacts ===
    'Additional Contact 3 First Name',
    'Additional Contact 3 Last Name',
    'Additional Contact 3 Email',

    'Additional Contact 4 First Name',
    'Additional Contact 4 Last Name',
    'Additional Contact 4 Email',

    'Additional Contact 5 First Name',
    'Additional Contact 5 Last Name',
    'Additional Contact 5 Email',

    'Additional Contact 6 First Name',
    'Additional Contact 6 Last Name',
    'Additional Contact 6 Email',

    'Additional Contact 7 First Name',
    'Additional Contact 7 Last Name',
    'Additional Contact 7 Email',

    // === Meeting Info ===
    'Kickoff Scheduled',  // Yes/No
    'Desired Kick-Off Date',
    'Kickoff Meeting URL',
    'Data Overview URL',

    'Weekly Sync Scheduled',  // Yes/No
    'Weekly Sync URL',

    'QuickStart Delivery Only',  // Yes/No
    'Delivery Session URL',

    // === Onboarding ===
    'Include Onboarding Questions',  // Yes/No
    'Onboarding Questions',  // Text field

    // === Dates ===
    'Contract Start Date',
    'Expected Go Live Date',

    // === Description ===
    'Description of company/deal',

    // === Additional Info ===
    'Additional People to be added to the invite',
  ];

  // Get existing headers (if any)
  const existingHeaders = [];
  if (responseSheet.getLastColumn() > 0) {
    existingHeaders.push(...responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn()).getValues()[0]);
  }

  // Merge: keep existing, add new ones
  const finalHeaders = [...existingHeaders];
  headers.forEach(function(header) {
    if (finalHeaders.indexOf(header) === -1) {
      finalHeaders.push(header);
    }
  });

  // Write headers
  responseSheet.getRange(1, 1, 1, finalHeaders.length)
    .setValues([finalHeaders])
    .setFontWeight('bold')
    .setBackground('#34a853')
    .setFontColor('white');

  // Auto-resize all columns
  for (let i = 1; i <= finalHeaders.length; i++) {
    responseSheet.autoResizeColumn(i);
  }

  // Freeze header row
  responseSheet.setFrozenRows(1);

  ui.alert(
    'Columns Created',
    'Added ' + finalHeaders.length + ' columns to "' + CONFIG.RESPONSES_SHEET + '".\n\n' +
    'Existing data was preserved.\n' +
    'New columns were added on the right.\n\n' +
    'Next steps:\n' +
    '1. Add sample data: Menu → Setup → Add Sample Welcome Data\n' +
    '2. Update Config.gs FIELD_MAP to match these columns\n' +
    '3. Update your Blueshift template to use dynamic variables',
    ui.ButtonSet.OK
  );
}

/**
 * Adds sample data rows for testing the Welcome Email template.
 * Only adds if there's room (doesn't overwrite existing data).
 */
function setupWelcomeSampleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const responseSheet = ss.getSheetByName(CONFIG.RESPONSES_SHEET);

  if (!responseSheet) {
    ui.alert('Error', 'Sheet "' + CONFIG.RESPONSES_SHEET + '" not found.\n\nRun "Setup Welcome Email Columns" first.', ui.ButtonSet.OK);
    return;
  }

  // Get headers
  const headers = responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn()).getValues()[0];

  // Build sample data rows
  const sampleData = [
    buildSampleRow(headers, {
      'Company Name': 'Acme Corporation',
      'Site name': 'acmecorp.com',
      'Website URL': 'https://www.acmecorp.com',
      'Email Alias': 'acmecorp@getblueshift.com',
      'Plan': 'Enterprise',
      'Platform Tier': 'Premium',
      'Support Level': 'Standard',
      'Product Consultant Name': 'Stephen Dunn',
      'Product Consultant Email': 'stephen.dunn@blueconic.com',
      'CSM Name': 'Maura McKendry',
      'CSM Email': 'maura.mckendry@blueconic.com',
      'Primary Contact First Name': 'Alice',
      'Primary Contact Last Name': 'Johnson',
      'Primary contact email': 'alice.johnson@acmecorp.com',
      'Primary Admin First Name': 'Bob',
      'Primary Admin Last Name': 'Smith',
      'Primary Admin Email': 'bob.smith@acmecorp.com',
      'Desired Kick-Off Date': '2026-08-15',
      'Kickoff Scheduled': 'Yes',
      'CSM Assigned': 'Yes',
      'Product Consultant Assigned': 'Yes',
      'PM Included': 'No',
      'Delivery Included': 'Yes',
      'Email Address': 'sales.rep@blueconic.com',
    }),

    buildSampleRow(headers, {
      'Company Name': 'TechStart Inc',
      'Site name': 'techstart.io',
      'Website URL': 'https://www.techstart.io',
      'Email Alias': 'techstart@getblueshift.com',
      'Plan': 'Professional',
      'Platform Tier': 'Standard',
      'Support Level': 'Enhanced',
      'Product Consultant Name': 'Jane Williams',
      'Product Consultant Email': 'jane.williams@blueconic.com',
      'CSM Name': 'Tom Brown',
      'CSM Email': 'tom.brown@blueconic.com',
      'Primary Contact First Name': 'Carol',
      'Primary Contact Last Name': 'Davis',
      'Primary contact email': 'carol@techstart.io',
      'Primary Admin First Name': 'David',
      'Primary Admin Last Name': 'Miller',
      'Primary Admin Email': 'david@techstart.io',
      'Desired Kick-Off Date': '2026-09-01',
      'Kickoff Scheduled': 'No',
      'CSM Assigned': 'Yes',
      'Product Consultant Assigned': 'Yes',
      'PM Included': 'Yes',
      'Delivery Included': 'Yes',
      'Email Address': 'another.rep@blueconic.com',
    }),
  ];

  const lastRow = responseSheet.getLastRow();
  responseSheet.getRange(lastRow + 1, 1, sampleData.length, headers.length).setValues(sampleData);

  ui.alert(
    'Sample Data Added',
    'Added ' + sampleData.length + ' sample rows.\n\n' +
    'You can now test the Welcome Email tool:\n' +
    '1. Select a sample row\n' +
    '2. Welcome Email → Create draft from selected row\n' +
    '3. Select your dynamic template\n' +
    '4. Click Render Preview',
    ui.ButtonSet.OK
  );
}

/**
 * Helper: Build a sample data row matching the header order
 */
function buildSampleRow(headers, data) {
  const row = [];
  headers.forEach(function(header) {
    if (header === 'Timestamp') {
      row.push(new Date());
    } else if (data[header]) {
      row.push(data[header]);
    } else {
      row.push('');  // Empty for unmapped columns
    }
  });
  return row;
}

/**
 * Complete setup: creates columns + roster + sample data
 */
function setupWelcomeEmailComplete() {
  setupWelcomeEmailColumns();

  // Check if roster exists
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(CONFIG.ROSTER_SHEET)) {
    setupRosterTab();
  }

  setupWelcomeSampleData();

  SpreadsheetApp.getUi().alert(
    'Setup Complete!',
    'Your sheet is ready for the Welcome Email tool.\n\n' +
    'Next steps:\n' +
    '1. Review the sample data\n' +
    '2. Update Config.gs FIELD_MAP (see FIELD_MAP_TEMPLATE_EXAMPLE.js)\n' +
    '3. Update your Blueshift template to use variables\n' +
    '4. Test by selecting a row and creating a draft',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
