# Welcome Email tool — setup (MVP)

This is the first working version: **pick a template → fill/clean a few fields → render → get a Gmail draft** with To/Cc/Bcc from your selections. It runs from a menu inside your Google Sheet (the response sheet you already have). The polished in-Gmail sidebar comes later; this proves the whole Blueshift → Gmail pipeline first.

## What it does

1. You click a row in the **Form Responses** tab (one row = one welcome send).
2. Menu: **Welcome Email → Create draft from selected row…**
3. A dialog opens: pick the template, edit the auto-mapped variables, hit **Render preview** (calls Blueshift `sync_render` — no send).
4. Choose **Cc** (grouped checkboxes from your roster) and **Bcc** (notify list), add any custom addresses.
5. **Create Gmail draft** → the addressed, rendered draft appears in Gmail → you review and send.

## One-time setup

### 1. Open the Apps Script project
In your response Google Sheet: **Extensions → Apps Script**. Delete the default `Code.gs`, then create these files and paste in the matching contents from this folder:

- `Config.gs`, `Blueshift.gs`, `Cleanup.gs`, `Recipients.gs`, `Main.gs`
- `Preview.html` (in the editor: **＋ → HTML**, name it exactly `Preview`)
- `appsscript.json` (enable **Project Settings → “Show appsscript.json manifest file”**, then paste)

### 2. Add a "Roster" tab
Create a tab named **Roster** with these headers in row 1:

| Group | Name | Email | Default |
|-------|------|-------|---------|
| CSM   | Jane Doe | jane@company.com | yes |
| Sales | Rob Smith | rob@company.com | yes |
| SE    | Amy Lee | amy@company.com |  |
| Bcc   | Ops Alias | ops@company.com | yes |

- **Group**: `CSM` / `Sales` / `SE` (or any label) become **Cc** groups. `Bcc` (or anything containing "notify") goes to the **Bcc** list.
- **Default**: `yes` / `y` / `x` / `true` = pre-checked in the dialog.

### 3. Configure `Config.gs`
- `RESPONSES_SHEET` — the exact name of your responses tab (default `Form Responses 1`).
- `TO_EMAIL_COLUMN` — the response column with the customer email (goes in To:).
- `FIELD_MAP` — map each **template variable** (left) to a **response column header** (right). This is the cleanup/mapping layer; add normalization in `Cleanup.gs` as needed.
- `DEFAULT_TEMPLATE_UUID` — optional; you can also just pick in the dialog dropdown.

### 4. Set the Blueshift API key
Reload the sheet (the **Welcome Email** menu appears). Run **Welcome Email → Set Blueshift API key** and paste your Blueshift **User API key**. It's stored in Script Properties — never in the code or the sheet. First run will ask you to authorize the script.

## Try it
Click a data row in the responses tab → **Welcome Email → Create draft from selected row…** → **Render preview** → pick Cc/Bcc → **Create Gmail draft** → check Gmail Drafts.

## Notes / knobs
- **Grouped email:** To holds the customers for this send; everyone shares one rendered body. (A per-person-draft mode is a small extension if you ever want it.)
- **`sync_render`** renders from the variables you pass — no customer record lookup needed.
- **Cleanup** lives in `Cleanup.gs` (`mapRowToVariables_`): trimming, title-casing, date formatting. Extend it as your form data demands.
- **Create-new-template-each-send** (clone a base in Blueshift so you can finish it in the UI) is deliberately left out of this MVP — easy to add via the Template API once the core feels right.

## Still to wire when you're ready
- Cloning a base template into a fresh one per send (Blueshift Create Template API).
- Wrapping this as an in-Gmail **sidebar add-on** (same logic, Gmail-native UI + preview).
