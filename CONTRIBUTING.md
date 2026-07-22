# Contributing to Welcome Email Tool

Thank you for considering contributing to this project! Here's how you can help.

## Getting Started

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Test thoroughly in a Google Apps Script environment
5. Submit a pull request

## Development Setup

### Prerequisites

- Google Workspace account
- Access to Google Apps Script
- Blueshift account for API testing (optional for documentation changes)

### Testing Your Changes

Since this is a Google Apps Script project:

1. Create a test Google Sheet
2. Open **Extensions → Apps Script**
3. Copy your modified code into the editor
4. Create test data in the sheet
5. Test the menu functions and dialog interactions

### Using clasp (Optional)

For easier development, you can use Google's [clasp](https://github.com/google/clasp) CLI tool:

```bash
npm install -g @google/clasp
clasp login
clasp clone [YOUR_SCRIPT_ID]
```

## Code Style

- Use 2-space indentation
- Add JSDoc comments for functions
- Keep functions focused and modular
- Follow the existing file organization:
  - `Config.gs` - Configuration only
  - `Main.gs` - UI and menu handlers
  - `Blueshift.gs` - API calls
  - `Recipients.gs` - Roster logic
  - `Cleanup.gs` - Data transformations

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows the existing style
- [ ] All functions have descriptive comments
- [ ] Tested in a real Google Apps Script environment
- [ ] Updated documentation if adding features
- [ ] No hardcoded credentials or API keys

### PR Description Should Include

- What problem does this solve?
- What changes were made?
- How to test the changes?
- Screenshots (if UI changes)

## Types of Contributions

### Bug Fixes
- Describe the bug and how to reproduce it
- Explain your fix
- Include any edge cases you tested

### New Features
- Open an issue first to discuss the feature
- Explain the use case
- Consider backward compatibility
- Update README.md and SETUP.md if needed

### Documentation
- Fix typos or unclear instructions
- Add examples or screenshots
- Improve setup instructions
- Add troubleshooting tips

### Code Improvements
- Refactoring for clarity
- Performance improvements
- Better error handling
- Enhanced logging

## Project Structure

```
Config.gs       → All configuration variables
Main.gs         → Entry points, menu creation, UI handlers
Blueshift.gs    → Blueshift API integration
Recipients.gs   → Roster management
Cleanup.gs      → Data normalization layer
Preview.html    → Dialog UI (HTML/CSS/JS)
appsscript.json → Apps Script manifest
```

## Common Development Tasks

### Adding a New Template Variable

1. Update `FIELD_MAP` in `Config.gs`
2. Add cleanup logic in `Cleanup.gs` if needed
3. Update documentation

### Adding a New API Endpoint

1. Add function to `Blueshift.gs`
2. Follow existing pattern: `callBlueshift_()` helper
3. Add error handling
4. Document in comments

### Modifying the UI

1. Edit `Preview.html`
2. Keep inline CSS/JS for Apps Script compatibility
3. Test dialog display and interactions
4. Update screenshots in docs

## Testing Checklist

- [ ] Menu appears in Google Sheets
- [ ] Dialog opens without errors
- [ ] Template dropdown populates
- [ ] Field mapping works correctly
- [ ] Preview renders successfully
- [ ] Recipient groups display properly
- [ ] Gmail draft created with correct To/Cc/Bcc
- [ ] API key storage/retrieval works
- [ ] Error messages are clear and helpful

## Questions or Issues?

- Open an issue for bugs or feature requests
- Include steps to reproduce for bugs
- Provide context for feature requests

## Code of Conduct

- Be respectful and constructive
- Focus on the code, not the person
- Help others learn and grow
- Keep discussions professional

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
