# Welcome Email Tool for Blueshift

A Google Apps Script tool that streamlines the process of creating personalized welcome emails using Blueshift templates. Select a row from your Google Form responses, preview the rendered email, choose recipients, and create a Gmail draft—all from within Google Sheets.

## Features

- **Template Selection**: Pick from your Blueshift templates via dropdown
- **Auto-mapping**: Automatically maps form response data to template variables
- **Live Preview**: Renders emails using Blueshift's `sync_render` API before sending
- **Recipient Management**: Organize Cc/Bcc recipients by groups with defaults
- **Gmail Integration**: Creates properly addressed drafts in Gmail for final review
- **Secure Configuration**: API keys stored in Script Properties, never in code

## How It Works

1. Click a row in your **Form Responses** sheet tab
2. Menu: **Welcome Email → Create draft from selected row...**
3. Select your Blueshift template and review auto-mapped variables
4. Click **Render preview** to see the final email (calls Blueshift API)
5. Choose Cc recipients (by group) and Bcc addresses
6. Click **Create Gmail draft**
7. Review and send from Gmail

## Prerequisites

- Google Workspace account with access to Google Sheets and Gmail
- Blueshift account with API access
- A Google Sheet with form responses
- Blueshift email templates created and ready to use

## Installation

See **[SETUP.md](SETUP.md)** for complete installation instructions.

### Quick Start

1. Open your Google Sheet with form responses
2. Go to **Extensions → Apps Script**
3. Copy all `.gs` files and `Preview.html` into the project
4. Enable and configure `appsscript.json` manifest
5. Create a "Roster" tab in your sheet
6. Configure `Config.gs` with your sheet names and field mappings
7. Set your Blueshift API key via the menu

## Configuration

### Config.gs

Edit `Config.gs` to customize:

```javascript
const CONFIG = {
  BLUESHIFT_BASE: 'https://api.getblueshift.com',
  DEFAULT_TEMPLATE_UUID: '',  // Optional default template
  RESPONSES_SHEET: 'Form Responses 1',  // Your responses tab name
  ROSTER_SHEET: 'Roster',
  TO_EMAIL_COLUMN: 'Customer Email',  // Column with recipient email
};
```

### Field Mapping

Map Blueshift template variables to your form columns:

```javascript
const FIELD_MAP = {
  first_name:   'First Name',
  last_name:    'Last Name',
  company:      'Account Name',
  plan:         'Plan',
  go_live_date: 'Go Live Date',
};
```

## File Structure

```
welcome-email-tool/
├── Config.gs           # Configuration and field mapping
├── Main.gs            # Menu and UI handlers
├── Blueshift.gs       # Blueshift API integration
├── Recipients.gs      # Roster management for Cc/Bcc
├── Cleanup.gs         # Data normalization and cleanup
├── Preview.html       # Dialog UI for template preview
├── appsscript.json    # Apps Script manifest
└── SETUP.md           # Detailed setup instructions
```

## Architecture

The tool follows a modular architecture:

- **Config.gs**: Central configuration, no API calls
- **Main.gs**: Entry points, menu creation, dialog display
- **Blueshift.gs**: All Blueshift API interactions (templates, rendering)
- **Recipients.gs**: Reads Roster sheet, builds Cc/Bcc groups
- **Cleanup.gs**: Data transformation layer between form and template
- **Preview.html**: Client-side UI with server-side calls via `google.script.run`

### Data Flow

```
Form Response Row
    ↓
Cleanup.gs (normalize data)
    ↓
Blueshift API (sync_render)
    ↓
Preview Dialog (review & select recipients)
    ↓
Gmail Draft (ready to send)
```

## Usage Notes

- **Grouped Emails**: The To field can contain multiple customer emails (comma or semicolon separated)
- **No Customer Lookup**: Uses `sync_render` which renders from variables you provide, no Blueshift customer record needed
- **Data Cleanup**: Extend `Cleanup.gs` to add custom data transformations
- **Security**: API keys are stored in Script Properties, accessible only to authorized users

## Roadmap

Potential future enhancements:

- Template cloning API integration (create fresh template per send)
- Gmail sidebar add-on version (native Gmail UI)
- Per-recipient draft mode
- Template variable validation
- Send history tracking

## Troubleshooting

### "Authorization Required" on First Run
- Normal behavior. Click **Review Permissions** and authorize the script
- Script needs access to Sheets, Gmail, and external requests (Blueshift API)

### "Template not found"
- Verify the template UUID exists in Blueshift
- Check API key is set correctly via menu

### Variables not mapping correctly
- Check column headers in `RESPONSES_SHEET` match `FIELD_MAP` exactly (case-sensitive)
- Verify selected row has data in the expected columns

### Roster not showing up
- Confirm the "Roster" tab exists with headers: Group, Name, Email, Default
- Check `ROSTER_SHEET` in `Config.gs` matches your tab name

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

[To be determined - specify your license]

## Support

For issues or questions, please open an issue on GitHub.
