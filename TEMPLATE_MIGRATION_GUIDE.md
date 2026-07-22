# Template Migration Guide: Hardcoded → Dynamic Variables

This guide shows you how to convert your hardcoded Blueshift template into one that accepts dynamic variables from the Welcome Email Tool.

## Overview

**Before:** Template has hardcoded values
```liquid
{% assign customer = "4Front Credit Union" %}
{% assign plan = "Premium" %}
```

**After:** Template reads from sync_render API

**Option 1 - Direct (Simplest):**
```liquid
{% assign customer = customer %}
{% assign plan = plan %}
```

**Option 2 - Explicit prefix:**
```liquid
{% assign customer = bsft_event_context.customer %}
{% assign plan = bsft_event_context.plan %}
```

**Option 3 - No assign needed:**
```liquid
<p>Welcome {{customer}}! Your plan: {{plan}}</p>
```

Use whichever style matches your template structure. All work the same way.

---

## Step 1: Clone Your Template

Don't edit your production template directly!

1. Go to Blueshift → Templates
2. Find your template: `bsft-success-services-Welcome-Updated--4frontcreditunion`
3. Click **Clone** or **Duplicate**
4. Name it: `Welcome Email Tool - Dynamic Version`
5. Open the cloned template for editing

---

## Step 2: Update Assignments in Visual Editor

In your template's visual editor, find all the `{% assign %}` statements and update them:

### Customer Info
```liquid
{% assign customer = bsft_event_context.customer %}
{% assign account = bsft_event_context.account %}
{% assign website = bsft_event_context.website %}
{% assign alias = bsft_event_context.alias %}
```

### Plan & Features
```liquid
{% assign plan = bsft_event_context.plan %}
{% assign platform_tier = bsft_event_context.platform_tier %}
{% assign support_level = bsft_event_context.support_level %}
```

### Team Assignment Flags (Yes/No)
```liquid
{% assign pm_included = bsft_event_context.pm_included %}
{% assign deliv_included = bsft_event_context.deliv_included %}
{% assign deliv_assigned = bsft_event_context.deliv_assigned %}
{% assign pc_assigned = bsft_event_context.pc_assigned %}
{% assign csm_assigned = bsft_event_context.csm_assigned %}
```

### Team Members
```liquid
{% assign product_consultant = bsft_event_context.product_consultant %}
{% assign product_consultant_email = bsft_event_context.product_consultant_email %}
{% assign csm = bsft_event_context.csm %}
{% assign csm_email = bsft_event_context.csm_email %}
{% assign deliv_strat = bsft_event_context.deliv_strat %}
{% assign deliv_strat_email = bsft_event_context.deliv_strat_email %}
{% assign pm = bsft_event_context.pm %}
{% assign pm_email = bsft_event_context.pm_email %}
```

### Client Contacts
```liquid
{% assign client1_first = bsft_event_context.client1_first %}
{% assign client1_last = bsft_event_context.client1_last %}
{% assign client1_email = bsft_event_context.client1_email %}

{% assign client2_first = bsft_event_context.client2_first %}
{% assign client2_last = bsft_event_context.client2_last %}
{% assign client2_email = bsft_event_context.client2_email %}

{% assign client3_first = bsft_event_context.client3_first %}
{% assign client3_last = bsft_event_context.client3_last %}
{% assign client3_email = bsft_event_context.client3_email %}

// Continue for client4-7 if needed
```

### Meeting URLs & Dates
```liquid
{% assign scheduled_kickoff = bsft_event_context.scheduled_kickoff %}
{% assign kickoff_url = bsft_event_context.kickoff_url %}
{% assign kickoff_date = bsft_event_context.kickoff_date %}
{% assign data_overview_url = bsft_event_context.data_overview_url %}
{% assign schedule_weekly = bsft_event_context.schedule_weekly %}
{% assign weekly_sync_url = bsft_event_context.weekly_sync_url %}
{% assign quickstart_deliv_only = bsft_event_context.quickstart_deliv_only %}
{% assign deliv_url = bsft_event_context.deliv_url %}
```

### Additional Customers (if multi-site)
```liquid
{% assign customer2 = bsft_event_context.customer2 %}
{% assign account2 = bsft_event_context.account2 %}
{% assign website2 = bsft_event_context.website2 %}
{% assign account3 = bsft_event_context.account3 %}
{% assign account4 = bsft_event_context.account4 %}
{% assign account5 = bsft_event_context.account5 %}
```

### Onboarding Questions
```liquid
{% assign include_oq = bsft_event_context.include_oq %}
{% assign onboarding_Q = bsft_event_context.onboarding_Q %}
```

### Fallback Values (Optional)

If you want defaults when values aren't provided:

```liquid
{% assign customer = bsft_event_context.customer | default: "Customer Name" %}
{% assign plan = bsft_event_context.plan | default: "Standard" %}
{% assign pm_included = bsft_event_context.pm_included | default: "No" %}
```

---

## Step 3: Update Config.gs FIELD_MAP

Copy relevant mappings from `FIELD_MAP_TEMPLATE_EXAMPLE.js` to your `Config.gs`:

```javascript
const FIELD_MAP = {
  // Customer
  customer: 'Company Name',
  account: 'Site name',
  website: 'Website URL',
  plan: 'Plan',

  // Team
  product_consultant: 'Product Consultant Name',
  product_consultant_email: 'Product Consultant Email',
  csm: 'CSM Name',
  csm_email: 'CSM Email',

  // Contacts
  client1_first: 'Primary Contact First Name',
  client1_last: 'Primary Contact Last Name',
  client1_email: 'Primary contact email',

  // Dates
  kickoff_date: 'Desired Kick-Off Date',
  contract_start: 'Contract Start Date',

  // Add all others you need...
};
```

---

## Step 4: Add Default Values in Cleanup.gs

For variables that aren't in your form but need defaults:

```javascript
function mapRowToVariables_(rowObj) {
  const vars = {};

  // Map from FIELD_MAP
  Object.keys(FIELD_MAP).forEach(function (varName) {
    const colName = FIELD_MAP[varName];
    vars[varName] = (rowObj[colName] || '').toString().trim();
  });

  // Set defaults for variables not in form
  if (!vars.pm_included) vars.pm_included = 'No';
  if (!vars.deliv_included) vars.deliv_included = 'No';
  if (!vars.deliv_assigned) vars.deliv_assigned = 'No';
  if (!vars.pc_assigned) vars.pc_assigned = 'Yes';
  if (!vars.csm_assigned) vars.csm_assigned = 'Yes';

  // Auto-generate alias from account
  if (!vars.alias && vars.account) {
    vars.alias = vars.account + '@getblueshift.com';
  }

  // Default empty strings for optional fields
  if (!vars.customer2) vars.customer2 = '';
  if (!vars.pm) vars.pm = '';
  if (!vars.pm_email) vars.pm_email = '';

  return vars;
}
```

---

## Step 5: Test the New Template

1. **Push changes to Apps Script:**
   ```bash
   clasp push --force
   ```

2. **In Google Sheet:**
   - Refresh the page
   - Select a test row
   - Welcome Email → Create draft from selected row
   - Select your **new dynamic template**
   - Review variables (all should be populated from form)
   - Click **"Render Preview"**

3. **Check Apps Script Execution Logs:**
   - Extensions → Apps Script → Executions
   - Look for `=== Calling sync_render ===`
   - Verify variables are being sent:
     ```
     Variables being sent: {"customer":"Acme Corp","plan":"Enterprise",...}
     ```

4. **If render succeeds:**
   - Preview shows correct content ✓
   - Variables are properly substituted ✓
   - Proceed to create Gmail draft

5. **If render fails:**
   - Error message will say which variable is missing
   - Add it via "+ Add Custom Variable" button
   - Or add to FIELD_MAP / Cleanup.gs
   - Try again

---

## Step 6: Handle Missing Variables

If the render says "Missing variable X":

### Option A: Add to Form
Add a column to your Google Form for that variable

### Option B: Set Default in Cleanup.gs
```javascript
if (!vars.X) vars.X = 'default value';
```

### Option C: Add Manually in Dialog
Click "+ Add Custom Variable" and enter it

---

## Testing Checklist

- [ ] Template cloned
- [ ] All assigns updated to `bsft_event_context.*`
- [ ] Config.gs FIELD_MAP updated
- [ ] Cleanup.gs has defaults for non-form variables
- [ ] Code pushed to Apps Script (`clasp push --force`)
- [ ] Google Sheet refreshed
- [ ] Test render successful
- [ ] Preview shows correct data
- [ ] Gmail draft created successfully

---

## Troubleshooting

### "Variable not found" error
The template references a variable you didn't send. Add it to FIELD_MAP or manually in the dialog.

### Empty values in preview
Check that:
1. Form column headers match FIELD_MAP exactly (case-sensitive)
2. Selected row has data in those columns
3. Cleanup.gs isn't overwriting with empty strings

### Preview shows {{bsft_event_context.X}}
The assignment isn't working. Double-check the Liquid syntax in your template.

---

## Pro Tips

1. **Keep the original template** - Don't delete it, just create a new dynamic version
2. **Test with real data** - Use an actual form response, not sample data
3. **Check execution logs** - They show exactly what's being sent to Blueshift
4. **Use defaults liberally** - Better to have a default than fail on missing data
5. **Start small** - Test with a few variables first, then add more

---

## Example: Before & After

### Before (Hardcoded)
```liquid
{% assign customer = "4Front Credit Union" %}
{% assign csm = "Maura McKendry" %}
{% assign csm_email = "maura.mckendry@blueconic.com" %}
{% assign kickoff_date = "August 15, 2026" %}

<p>Hi {{client1_first}},</p>
<p>Welcome to Blueshift! Your CSM is {{csm}} ({{csm_email}}).</p>
```

### After (Dynamic)
```liquid
{% assign customer = bsft_event_context.customer %}
{% assign csm = bsft_event_context.csm %}
{% assign csm_email = bsft_event_context.csm_email %}
{% assign kickoff_date = bsft_event_context.kickoff_date %}
{% assign client1_first = bsft_event_context.client1_first %}

<p>Hi {{client1_first}},</p>
<p>Welcome to Blueshift! Your CSM is {{csm}} ({{csm_email}}).</p>
```

Now when you use the tool, it fills in the actual values from your form response!

---

## Next Steps

Once this works, you can:
1. Update your production template
2. Add more variables as needed
3. Build templates for other email types
4. Automate more of your workflow
