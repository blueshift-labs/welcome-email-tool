/**
 * Blueshift.gs — calls to the Blueshift API.
 * Auth supports two methods:
 * 1. Session Cookie (preferred): From Google SSO login in browser
 * 2. API Key: HTTP Basic auth with User API key
 * Both stored in Script Properties, never hard-coded.
 */

/**
 * Gets authentication headers for Blueshift API calls.
 * Prefers session cookie if available, falls back to API key.
 */
function bsAuthHeaders_() {
  const props = PropertiesService.getScriptProperties();
  const sessionCookie = props.getProperty('BLUESHIFT_SESSION_COOKIE');
  const apiKey = props.getProperty('BLUESHIFT_API_KEY');

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  if (sessionCookie) {
    // Use session cookie authentication
    headers['Cookie'] = sessionCookie;
  } else if (apiKey) {
    // Fall back to API key authentication
    headers['Authorization'] = 'Basic ' + Utilities.base64Encode(apiKey + ':');
  } else {
    throw new Error(
      'Blueshift authentication not set.\n\n' +
      'Choose one:\n' +
      '• "Welcome Email" → "Set Session Cookie" (recommended)\n' +
      '• "Welcome Email" → "Set API Key"'
    );
  }

  return headers;
}

/** List all email templates -> [{uuid, name}], for the dropdown. */
function bsListTemplates() {
  const url = CONFIG.BLUESHIFT_BASE + '/api/v1/email_templates.json';
  const res = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: bsAuthHeaders_(),
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
 * Get full details for a specific template, including variables used.
 * Returns template object with html_content, variables, etc.
 */
function bsGetTemplateDetails(templateUuid) {
  if (!templateUuid) throw new Error('No template UUID provided.');

  const url = CONFIG.BLUESHIFT_BASE + '/api/v1/email_templates/' + templateUuid + '.json';
  const res = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: bsAuthHeaders_(),
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  if (code !== 200) {
    throw new Error('Get template failed (' + code + '): ' + res.getContentText());
  }
  const body = JSON.parse(res.getContentText() || '{}');
  const template = body.template || body;

  // Extract variables from the template HTML/text content
  const variables = extractTemplateVariables_(template);

  // Log for debugging (visible in Apps Script execution logs)
  Logger.log('Template UUID: ' + templateUuid);
  Logger.log('Variables found: ' + JSON.stringify(variables));
  Logger.log('Subject preview: ' + (template.subject || '').substring(0, 100));
  Logger.log('HTML preview: ' + (template.html_content || '').substring(0, 200));

  return {
    uuid: template.uuid,
    name: template.name,
    subject: template.subject || '',
    html_content: template.html_content || '',
    text_content: template.text_content || '',
    variables: variables,
    raw_template_preview: (template.html_content || '').substring(0, 500) // Return preview for debugging
  };
}

/**
 * Extract variable names from template content.
 * Blueshift uses {{variable_name}} or {{ variable_name }} format.
 */
function extractTemplateVariables_(template) {
  const variables = [];
  const seen = {};

  // Combine all searchable content
  const content = [
    template.subject || '',
    template.html_content || '',
    template.text_content || ''
  ].join(' ');

  // Find all {{variable}} patterns
  // Regex: {{ whitespace variable_name whitespace }}
  const regex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const varName = match[1];
    if (!seen[varName]) {
      seen[varName] = true;
      variables.push(varName);
    }
  }

  return variables.sort();
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
    headers: bsAuthHeaders_(),
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
