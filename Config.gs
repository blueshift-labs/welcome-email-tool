/**
 * Config.gs — everything you customize lives here.
 * (Apps Script merges all .gs files into one project; no imports needed.)
 *
 * Column names below are matched loosely against the Form Responses headers:
 * exact match first, then case-insensitive, then "starts with", then "contains".
 * So you can use a short, distinctive piece of a long header.
 */

const CONFIG = {
  BLUESHIFT_BASE: 'https://api.getblueshift.com',

  // Fallback template if you don't pick one in the dialog dropdown.
  DEFAULT_TEMPLATE_UUID: '',

  // Tab holding the Google Form responses.
  RESPONSES_SHEET: 'Form Responses 1',

  // Tab holding your Cc/Bcc roster (create this — see SETUP.md).
  ROSTER_SHEET: 'Roster',

  // --- Recipients pulled from the selected response row ---
  // TO = the new customer contacts. We take emails from these columns (in order),
  // plus any real email addresses found in the "Additional People" column.
  TO_EMAIL_COLUMNS: ['Primary contact email', 'Primary Admin Email'],
  ADDITIONAL_PEOPLE_COLUMN: 'Additional People to be added to the invite',

  // The sales rep who submitted the form -> auto-added to Cc by default.
  SALES_REP_COLUMN: 'Email Address',

  // Rows whose Company/among key fields contain any of these are flagged as tests.
  TEST_ROW_MARKERS: ['test', 'success services test', 'testing updates'],
};

/**
 * FIELD_MAP: template variable name  ->  a distinctive piece of the column header.
 * LEFT  = the variable your Blueshift welcome/kickoff template expects at the top.
 * RIGHT = enough of the Form Responses column header to identify it.
 * Rename the LEFT side to match your real template variable names.
 */
const FIELD_MAP = {
  company:              'Company Name',
  website:              'Site name',
  primary_contact:      'Primary Contact',       // exact match wins over the email/role columns
  primary_contact_role: 'Primary contact role',
  primary_admin:        'Primary Admin',
  primary_admin_role:   'Primary Admin Role',
  support_level:        'Support Level',
  platform_tier:        'Platform Tier',
  features:             'Which Blueshift features are included',
  contract_start:       'Contract Start Date',
  kickoff_date:         'Desired Kick-Off Date',
  go_live_date:         'Is there an expected',   // the "go live" date header (has smart quotes)
  deal_description:     'Description of company/deal',
};
