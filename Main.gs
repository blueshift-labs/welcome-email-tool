/**
 * Main.gs — menu, dialog launch, and the server functions the dialog calls.
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Welcome Email')
    .addItem('Create draft from selected row…', 'openWelcomeDialog')
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Authentication')
      .addItem('Set Session Cookie (recommended)', 'setSessionCookiePrompt')
      .addItem('Set API Key', 'setApiKeyPrompt')
      .addItem('Clear Authentication', 'clearAuthPrompt'))
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Setup')
      .addItem('Run Setup Wizard', 'setupEverything')
      .addItem('Create Roster Tab', 'setupRosterTab')
      .addItem('Add Sample Data', 'setupSampleResponses'))
    .addToUi();
}

/** Store Blueshift session cookie from Google SSO login. */
function setSessionCookiePrompt() {
  const ui = SpreadsheetApp.getUi();

  // Show instructions first
  const instructions = ui.alert(
    'Get Session Cookie from Browser',
    'Steps to get your session cookie:\n\n' +
    '1. Log into Blueshift using Google SSO in your browser\n' +
    '2. Open Developer Tools (F12 or Cmd+Opt+I)\n' +
    '3. Go to Application tab → Cookies → https://app.getblueshift.com\n' +
    '4. Find the session cookie (usually named "_session" or similar)\n' +
    '5. Copy the entire cookie Value\n' +
    '6. Click OK to paste it in the next dialog\n\n' +
    'The cookie will be stored securely in Script Properties.',
    ui.ButtonSet.OK_CANCEL
  );

  if (instructions !== ui.Button.OK) return;

  const resp = ui.prompt(
    'Paste Session Cookie',
    'Paste the session cookie value from your browser:',
    ui.ButtonSet.OK_CANCEL
  );

  if (resp.getSelectedButton() === ui.Button.OK) {
    const cookie = resp.getResponseText().trim();
    if (cookie) {
      PropertiesService.getScriptProperties().setProperty('BLUESHIFT_SESSION_COOKIE', cookie);
      ui.alert('Session cookie saved securely.\n\nIt will be used for all API calls.');
    }
  }
}

/** Store the Blueshift API key securely in Script Properties. */
function setApiKeyPrompt() {
  const ui = SpreadsheetApp.getUi();
  const resp = ui.prompt('Blueshift API key',
    'Paste your Blueshift User API key (stored privately in Script Properties):',
    ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() === ui.Button.OK) {
    const key = resp.getResponseText().trim();
    if (key) {
      PropertiesService.getScriptProperties().setProperty('BLUESHIFT_API_KEY', key);
      ui.alert('Saved. Stored securely; it is not visible in the sheet or the code.');
    }
  }
}

/** Clear all authentication credentials. */
function clearAuthPrompt() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Clear Authentication',
    'This will remove both session cookie and API key.\n\nAre you sure?',
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    const props = PropertiesService.getScriptProperties();
    props.deleteProperty('BLUESHIFT_SESSION_COOKIE');
    props.deleteProperty('BLUESHIFT_API_KEY');
    ui.alert('Authentication cleared.\n\nYou will need to set it again before using the tool.');
  }
}

/** Menu entry: gather everything for the selected row and open the dialog. */
function openWelcomeDialog() {
  try {
    const rowObj = readSelectedResponseRow_();
    const data = {
      row: rowObj.__row,
      variables: mapRowToVariables_(rowObj),
      to: toEmailsFromRow_(rowObj),
      salesRep: salesRepEmail_(rowObj),            // default Cc
      additionalPeople: additionalPeopleNote_(rowObj), // shown as a hint for manual add
      isTest: looksLikeTestRow_(rowObj),
      roster: readRoster_(),
      templates: safeListTemplates_(),
      defaultTemplate: CONFIG.DEFAULT_TEMPLATE_UUID,
    };
    const t = HtmlService.createTemplateFromFile('Preview');
    t.data = JSON.stringify(data);
    const html = t.evaluate().setWidth(760).setHeight(720);
    SpreadsheetApp.getUi().showModalDialog(html, 'Welcome email — response row ' + rowObj.__row);
  } catch (e) {
    SpreadsheetApp.getUi().alert(String(e.message || e));
  }
}

function safeListTemplates_() {
  try { return bsListTemplates(); } catch (e) { return []; }
}

/** Called from the dialog to (re)render the preview. */
function renderForDialog(templateUuid, variables) {
  return bsSyncRender(templateUuid, variables);
}

/**
 * Called from the dialog to create the Gmail draft.
 * payload: { to:[], cc:[], bcc:[], subject:'', html:'' }
 */
function createWelcomeDraft(payload) {
  const to = (payload.to || []).join(',');
  if (!to) throw new Error('No To: recipients.');
  const options = {
    htmlBody: payload.html || '',
    cc: (payload.cc || []).join(','),
    bcc: (payload.bcc || []).join(','),
  };
  const draft = GmailApp.createDraft(to, payload.subject || '', payload.text || '', options);
  return { id: draft.getId() };
}
