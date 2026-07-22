/**
 * FIELD_MAP Example for Welcome Email Template
 *
 * This maps your template variables (left side) to Google Form column headers (right side).
 * Copy the relevant mappings to your Config.gs FIELD_MAP.
 *
 * In your visual editor template, change assignments like:
 *   {% assign customer = "4Front Credit Union" %}
 * To:
 *   {% assign customer = bsft_event_context.customer %}
 *
 * Then this tool will populate those values from your form data.
 */

const FIELD_MAP_EXAMPLE = {
  // === Customer Info ===
  customer: 'Company Name',                    // Main customer name
  account: 'Site name',                        // Account/site identifier
  website: 'Website URL',                      // Customer website
  alias: 'Email Alias',                        // Blueshift alias email

  // Additional customers (if multi-customer setup)
  customer2: 'Additional Customer 2',          // Optional: if form has this
  account2: 'Additional Account 2',
  website2: 'Additional Website 2',
  account3: 'Additional Account 3',
  account4: 'Additional Account 4',
  account5: 'Additional Account 5',

  // === Plan & Features ===
  plan: 'Plan',                                // Premium, Enterprise, etc.
  platform_tier: 'Platform Tier',
  support_level: 'Support Level',
  features: 'Which Blueshift features are included',

  // === Team Assignments (Yes/No flags) ===
  pm_included: 'PM Included',                  // "Yes" or "No"
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

  // === Client Contacts (Primary, Admin, etc.) ===
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

  // Add client5, client6, client7 if needed...

  // === Meeting Info ===
  scheduled_kickoff: 'Kickoff Scheduled',      // "Yes" or "No"
  kickoff_url: 'Kickoff Meeting URL',
  kickoff_date: 'Desired Kick-Off Date',

  schedule_weekly: 'Weekly Sync Scheduled',
  weekly_sync_url: 'Weekly Sync URL',

  quickstart_deliv_only: 'QuickStart Delivery Only',
  deliv_url: 'Delivery Session URL',

  data_overview_url: 'Data Overview URL',

  // === Onboarding ===
  include_oq: 'Include Onboarding Questions',  // "Yes" or "No"
  onboarding_Q: 'Onboarding Questions',        // Text field

  // === Dates ===
  contract_start: 'Contract Start Date',
  go_live_date: 'Expected Go Live Date',

  // === Other ===
  deal_description: 'Description of company/deal',
};

/**
 * Variables that might need hardcoded defaults or custom logic:
 *
 * If a form column doesn't exist, you can:
 * 1. Add it to the form
 * 2. Set a default in Cleanup.gs
 * 3. Add it manually via "+ Add Custom Variable" button
 *
 * Example in Cleanup.gs:
 *   if (!vars.pm_included) vars.pm_included = 'No';
 *   if (!vars.alias) vars.alias = vars.account + '@getblueshift.com';
 */
