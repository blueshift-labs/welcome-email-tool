# Deployment Guide - Welcome Email Tool

Complete step-by-step guide to deploy and configure the Welcome Email Tool.

## Prerequisites

- [ ] Google Workspace account
- [ ] Google Sheet with form responses
- [ ] Blueshift account access
- [ ] `clasp` CLI installed and authenticated (or manual deployment via Apps Script UI)

## Deployment Options

### Option A: Using clasp CLI (Recommended - Faster)

This method uses the command line to create and deploy the Apps Script project.

#### Step 1: Create New Apps Script Project

```bash
# From the project directory
clasp create --type sheets --title "Welcome Email Tool" --rootDir .
```

This will:
- Create a new Apps Script project
- Generate `.clasp.json` with your script ID
- Link the project to a new Google Sheet

#### Step 2: Push Code to Apps Script

```bash
clasp push
```

This uploads all `.gs` and `.html` files to your Apps Script project.

#### Step 3: Open the Project

```bash
clasp open
```

This opens the Apps Script editor in your browser.

---

### Option B: Manual Deployment (Traditional Method)

If you prefer or need to use an existing Google Sheet:

#### Step 1: Open Your Google Sheet

1. Navigate to your existing Google Sheet with form responses
2. Go to **Extensions → Apps Script**
3. You'll see a default `Code.gs` file

#### Step 2: Delete Default File

1. Click the three dots next to `Code.gs`
2. Select **Remove**

#### Step 3: Add Script Files

For each `.gs` file in the project:

1. Click **＋ → Script** in the Files panel
2. Name it exactly as shown (without `.gs` extension):
   - `Config`
   - `Main`
   - `Blueshift`
   - `Recipients`
   - `Cleanup`
3. Copy the contents from the repository file
4. Paste into the Apps Script editor
5. Save (Ctrl/Cmd + S)

#### Step 4: Add HTML File

1. Click **＋ → HTML** in the Files panel
2. Name it exactly: `Preview`
3. Copy contents from `Preview.html`
4. Paste and save

#### Step 5: Configure Manifest

1. Click the gear icon (⚙️) **Project Settings** on the left
2. Scroll down and check **"Show appsscript.json manifest file in editor"**
3. Go back to the **Editor** tab
4. Click on `appsscript.json` in the Files panel
5. Replace entire contents with the contents from repository `appsscript.json`
6. Save

---

## Configuration Steps (Both Methods)

### Step 1: Create Roster Tab

1. In your Google Sheet, create a new tab
2. Rename it to exactly: **Roster**
3. Add headers in row 1:

| Group | Name | Email | Default |
|-------|------|-------|---------|

4. Add sample data (example):

| Group | Name | Email | Default |
|-------|------|-------|---------|
| CSM | Jane Doe | jane@company.com | yes |
| Sales | Rob Smith | rob@company.com | yes |
| SE | Amy Lee | amy@company.com | |
| Bcc | Ops Team | ops@company.com | yes |

**Notes:**
- **Group**: Any label you want (CSM, Sales, SE, etc.)
  - Groups become Cc sections in the dialog
  - Groups named "Bcc" or containing "notify" go to Bcc list
- **Default**: `yes`, `y`, `x`, or `true` = pre-checked in dialog
- **Empty** Default = unchecked by default

### Step 2: Configure Config.gs

Open the Apps Script editor and modify `Config.gs`:

```javascript
const CONFIG = {
  BLUESHIFT_BASE: 'https://api.getblueshift.com',

  // Leave blank to always pick in dialog, or set a default template UUID
  DEFAULT_TEMPLATE_UUID: '',

  // IMPORTANT: Set this to your actual responses tab name
  RESPONSES_SHEET: 'Form Responses 1',  // ← Change if different

  ROSTER_SHEET: 'Roster',

  // Column header that contains customer email address
  TO_EMAIL_COLUMN: 'Customer Email',  // ← Change if different
};
```

### Step 3: Configure Field Mapping

Still in `Config.gs`, update the `FIELD_MAP` object to match your form:

```javascript
const FIELD_MAP = {
  // LEFT = Blueshift template variable name
  // RIGHT = Your Google Sheet column header (must match exactly)

  first_name:   'First Name',      // ← Change to match your columns
  last_name:    'Last Name',       // ← Change to match your columns
  company:      'Account Name',    // ← Change to match your columns
  plan:         'Plan',            // ← Change to match your columns
  go_live_date: 'Go Live Date',    // ← Change to match your columns
};
```

**How to get your column headers:**
1. Go to your responses sheet tab
2. Look at row 1 (the header row)
3. Copy the exact header text (case-sensitive!)
4. Match them to your Blueshift template variables

### Step 4: Verify Sheet Structure

Before proceeding, verify your sheet has:
- [ ] A tab with form responses (name matches `RESPONSES_SHEET`)
- [ ] Row 1 contains column headers
- [ ] A column with customer email (matches `TO_EMAIL_COLUMN`)
- [ ] A "Roster" tab with Group, Name, Email, Default headers
- [ ] At least one row of data in responses sheet for testing

### Step 5: Set Blueshift Authentication

**We'll do this in the next phase** - choosing between:
- Option A: Google SSO (capture session cookie)
- Option B: Traditional API key
- Option C: MCP integration

---

## Testing the Installation

### Test 1: Menu Appears

1. Close and reopen your Google Sheet
2. Wait a few seconds for the script to load
3. Look for **"Welcome Email"** menu in the top menu bar
4. If it doesn't appear:
   - Refresh the page (Ctrl/Cmd + R)
   - Check the Apps Script editor for errors
   - Go to **Extensions → Apps Script → Executions** to see any errors

### Test 2: Authorization Flow

1. Click **Welcome Email → Create draft from selected row...**
2. First time will show authorization dialog:
   - Click **Review Permissions**
   - Choose your Google account
   - Click **Advanced** if you see a warning
   - Click **Go to Welcome Email Tool (unsafe)**
   - Click **Allow**
3. This grants access to Sheets, Gmail, and external requests

### Test 3: Dialog Opens

1. Click any data row in your responses sheet (not the header row)
2. Click **Welcome Email → Create draft from selected row...**
3. Dialog should open showing:
   - Template dropdown (may be empty until Blueshift is connected)
   - Template variables section
   - Recipient selection
   - Action buttons

---

## Troubleshooting

### Menu Not Appearing

**Symptoms:** No "Welcome Email" menu after opening sheet

**Solutions:**
1. Refresh the browser page (hard refresh: Ctrl+Shift+R)
2. Check Apps Script editor → Run → Run `onOpen`
3. Check for errors in **Extensions → Apps Script → Executions**
4. Verify all files were copied correctly

### Authorization Errors

**Symptoms:** "Authorization required" or "Access denied"

**Solutions:**
1. Remove previous authorizations: Google Account → Security → Third-party apps
2. Re-authorize via **Welcome Email** menu
3. Check `appsscript.json` has required OAuth scopes

### Dialog Shows Errors

**Symptoms:** Dialog opens but shows error messages

**Solutions:**
1. Open browser console (F12) to see JavaScript errors
2. Check `Config.gs` settings match your sheet
3. Verify sheet tab names are exact (case-sensitive)
4. Check selected row has data

### Template Dropdown Empty

**Symptoms:** Dialog opens but no templates in dropdown

**Solutions:**
1. Blueshift authentication not set yet (next phase)
2. Check browser console for API errors
3. Verify Blueshift API endpoint is accessible

---

## Next Steps

Once installation is complete and the dialog opens:

1. **Connect Blueshift Authentication** (SSO or API key)
2. **Test template fetching**
3. **Test preview rendering**
4. **Test Gmail draft creation**
5. **Customize cleanup logic** in `Cleanup.gs` if needed

---

## clasp Commands Reference

Useful commands for ongoing development:

```bash
# Push local changes to Apps Script
clasp push

# Pull changes from Apps Script to local
clasp pull

# Open project in browser
clasp open

# View logs
clasp logs

# Deploy as web app or add-on (future)
clasp deploy
```

---

## Files Checklist

Verify all files are in your Apps Script project:

- [ ] Config.gs
- [ ] Main.gs
- [ ] Blueshift.gs
- [ ] Recipients.gs
- [ ] Cleanup.gs
- [ ] Preview.html
- [ ] appsscript.json (manifest enabled)

---

## Ready to Proceed?

Once you've completed these steps and the dialog opens, you're ready to configure Blueshift authentication!
