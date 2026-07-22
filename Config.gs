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
 * FIELD_MAP: template variable name  ->  column header in Form Responses sheet.
 * LEFT  = the variable your Blueshift template expects (matches {% assign X = X %})
 * RIGHT = the exact column header in your Form Responses sheet
 */
const FIELD_MAP = {
  // === Customer Info ===
  customer: 'Company Name',
  account: 'Site name',
  website: 'Website URL',
  alias: 'Email Alias',

  // Additional customers (for multi-site setups)
  customer2: 'Additional Customer 2',
  account2: 'Additional Account 2',
  website2: 'Additional Website 2',
  account3: 'Additional Account 3',
  account4: 'Additional Account 4',
  account5: 'Additional Account 5',

  // === Plan & Features ===
  plan: 'Plan',
  platform_tier: 'Platform Tier',
  support_level: 'Support Level',
  features: 'Which Blueshift features are included',

  // === Team Assignment Flags (Yes/No) ===
  pm_included: 'PM Included',
  deliv_included: 'Delivery Included',
  deliv_assigned: 'Delivery Assigned',
  pc_assigned: 'Product Consultant Assigned',
  csm_assigned: 'CSM Assigned',

  // === Team Members ===
  product_consultant: 'Product Consultant Name',
  product_consultant_email: 'Product Consultant Email',
  csm: 'CSM Name',
  csm_email: 'CSM Email',
  deliv_strat: 'Delivery Strategist Name',
  deliv_strat_email: 'Delivery Strategist Email',
  pm: 'Project Manager Name',
  pm_email: 'Project Manager Email',

  // === Client Contacts ===
  client1_first: 'Primary Contact First Name',
  client1_last: 'Primary Contact Last Name',
  client1_email: 'Primary contact email',

  client2_first: 'Primary Admin First Name',
  client2_last: 'Primary Admin Last Name',
  client2_email: 'Primary Admin Email',

  client3_first: 'Additional Contact 3 First Name',
  client3_last: 'Additional Contact 3 Last Name',
  client3_email: 'Additional Contact 3 Email',

  client4_first: 'Additional Contact 4 First Name',
  client4_last: 'Additional Contact 4 Last Name',
  client4_email: 'Additional Contact 4 Email',

  client5_first: 'Additional Contact 5 First Name',
  client5_last: 'Additional Contact 5 Last Name',
  client5_email: 'Additional Contact 5 Email',

  client6_first: 'Additional Contact 6 First Name',
  client6_last: 'Additional Contact 6 Last Name',
  client6_email: 'Additional Contact 6 Email',

  client7_first: 'Additional Contact 7 First Name',
  client7_last: 'Additional Contact 7 Last Name',
  client7_email: 'Additional Contact 7 Email',

  // === Meeting Info ===
  scheduled_kickoff: 'Kickoff Scheduled',
  kickoff_url: 'Kickoff Meeting URL',
  kickoff_date: 'Desired Kick-Off Date',
  data_overview_url: 'Data Overview URL',
  schedule_weekly: 'Weekly Sync Scheduled',
  weekly_sync_url: 'Weekly Sync URL',
  quickstart_deliv_only: 'QuickStart Delivery Only',
  deliv_url: 'Delivery Session URL',

  // === Onboarding ===
  include_oq: 'Include Onboarding Questions',
  onboarding_Q: 'Onboarding Questions',

  // === Dates ===
  contract_start: 'Contract Start Date',
  go_live_date: 'Expected Go Live Date',

  // === Other ===
  deal_description: 'Description of company/deal',
};
