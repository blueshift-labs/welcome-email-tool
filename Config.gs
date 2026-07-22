/**
 * Config.gs — everything you customize lives here.
 * (Apps Script merges all .gs files into one project; no imports needed.)
 */

const CONFIG = {
  // Blueshift API base URL. Leave as-is unless Blueshift tells you otherwise.
  BLUESHIFT_BASE: 'https://api.getblueshift.com',

  // Fallback template used if you don't pick one in the dialog dropdown.
  // Paste a real template UUID (or leave blank and always pick in the dialog).
  DEFAULT_TEMPLATE_UUID: '',

  // Tab name that holds the Google Form responses (check the tab at the bottom).
  RESPONSES_SHEET: 'Form Responses 1',

  // Tab name that holds your Cc/Bcc roster (create this tab — see SETUP.md).
  ROSTER_SHEET: 'Roster',

  // The response column header whose value(s) go in the To: field
  // (the new customer email). Comma/semicolon separated emails are supported.
  TO_EMAIL_COLUMN: 'Customer Email',
};

/**
 * FIELD_MAP: template variable name  ->  Form Responses column header.
 * LEFT  = the variable name your Blueshift template expects at the top.
 * RIGHT = the exact column header in the Form Responses tab.
 * Rename / add / remove rows to match your real template and form.
 */
const FIELD_MAP = {
  first_name:   'First Name',
  last_name:    'Last Name',
  company:      'Account Name',
  plan:         'Plan',
  go_live_date: 'Go Live Date',
};
