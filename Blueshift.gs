/**
 * Blueshift.gs — calls to the Blueshift API.
 * Auth: HTTP Basic, username = your User API key, empty password.
 * The key is read from Script Properties (set it via the menu), never hard-coded.
 */

function bsAuthHeader_() {
  const key = PropertiesService.getScriptProperties().getProperty('BLUESHIFT_API_KEY');
  if (!key) {
    throw new Error('Blueshift API key not set. Menu: "Welcome Email" → "Set Blueshift API key".');
  }
  return 'Basic ' + Utilities.base64Encode(key + ':');
}

/** List all email templates -> [{uuid, name}], for the dropdown. */
function bsListTemplates() {
  const url = CONFIG.BLUESHIFT_BASE + '/api/v1/email_templates.json';
  const res = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { Authorization: bsAuthHeader_(), Accept: 'application/json' },
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  if (code !== 200) {
    throw new Error('List templates failed (' + code + '): ' + res.getContentText());
  }
  const body = JSON.parse(res.getContentText() || '{}');
  // Blueshift wraps results in a "template" (or "templates") array.
  const arr = body.template || body.templates || body.results || [];
  return arr
    .map(function (t) { return { uuid: t.uuid, name: t.name || t.uuid }; })
    .filter(function (t) { return t.uuid; });
}

/**
 * Render a template WITHOUT sending (sync_render).
 * Returns { subject, html, text }. Pass your cleaned variables as `variables`.
 * No customer lookup — it renders purely from what you pass in.
 */
function bsSyncRender(templateUuid, variables) {
  if (!templateUuid) throw new Error('No template selected.');
  const url = CONFIG.BLUESHIFT_BASE + '/api/v1/sync_render';
  const payload = Object.assign({
    template_uuid: templateUuid,
    transaction_uuid: Utilities.getUuid(),  // required unique id for this render
  }, variables || {});
  const res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: bsAuthHeader_(), Accept: 'application/json' },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  const body = JSON.parse(res.getContentText() || '{}');
  if (code !== 200 || body.success === false) {
    throw new Error('Render failed (' + code + '): ' + res.getContentText());
  }
  return {
    subject: body.subject || '',
    html: body.html_content || '',
    text: body.text_content || '',
  };
}
