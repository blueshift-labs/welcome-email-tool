/**
 * Main.gs — menu, dialog launch, and the server functions the dialog calls.
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Welcome Email')
    .addItem('Create draft from selected row…', 'openWelcomeDialog')
    .addSeparator()
    .addItem('Set Blueshift API key', 'setApiKeyPrompt')
    .addToUi();
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

/** Menu entry: gather everything for the selected row and open the dialog. */
function openWelcomeDialog() {
  try {
    const rowObj = readSelectedResponseRow_();
    const data = {
      row: rowObj.__row,
      variables: mapRowToVariables_(rowObj),
      to: toEmailsFromRow_(rowObj),
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
