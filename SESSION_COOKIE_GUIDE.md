# How to Get Your Blueshift Session Cookie

This guide shows you how to extract your Blueshift session cookie after logging in with Google SSO. This cookie allows the tool to make API calls on your behalf without needing an API key.

## Why Session Cookies?

- **Easier**: Use your existing Google SSO login
- **Secure**: Leverages your SSO authentication
- **No API Key Management**: No need to create or rotate API keys
- **Same Permissions**: Has the same permissions as your logged-in user account

## Step-by-Step Instructions

### 1. Log into Blueshift

1. Open your browser (Chrome, Firefox, Safari, or Edge)
2. Go to https://app.getblueshift.com
3. Click "Sign in with Google" or your SSO method
4. Complete the Google authentication
5. Verify you're logged into Blueshift and can see your dashboard

### 2. Open Developer Tools

**Chrome / Edge:**
- Windows/Linux: Press `F12` or `Ctrl + Shift + I`
- Mac: Press `Cmd + Option + I`

**Firefox:**
- Windows/Linux: Press `F12` or `Ctrl + Shift + K`
- Mac: Press `Cmd + Option + K`

**Safari:**
- First enable Developer menu: Safari → Preferences → Advanced → "Show Develop menu in menu bar"
- Then: Press `Cmd + Option + I`

### 3. Navigate to Cookies

**Chrome / Edge:**
1. Click the **Application** tab (top menu in DevTools)
2. In the left sidebar, expand **Cookies**
3. Click on **https://app.getblueshift.com**

**Firefox:**
1. Click the **Storage** tab (top menu in DevTools)
2. Expand **Cookies** in the left sidebar
3. Click on **https://app.getblueshift.com**

**Safari:**
1. Click the **Storage** tab (top menu in Web Inspector)
2. Expand **Cookies** in the left sidebar
3. Click on **app.getblueshift.com**

### 4. Find the Session Cookie

Look for a cookie with one of these names (varies by platform):
- `_session`
- `session_id`
- `connect.sid`
- `auth_token`
- `csrftoken` (sometimes used with another cookie)

**You're looking for a cookie that:**
- Has a long alphanumeric value
- May include special characters like `%`, `=`, `-`, or `.`
- Is typically 50-500+ characters long

### 5. Copy the Cookie Value

1. Click on the cookie name to select it
2. Look for the **Value** field (usually in a panel on the right or below)
3. **Right-click the Value** → **Copy** (or manually select all and copy)
4. Make sure you copy the **entire value** - it may be very long!

**Example cookie value format:**
```
s%3Aj8KJfH3k...many more characters...x9Hk2pQ.signature_here
```

### 6. Paste into the Tool

1. Go back to your Google Sheet
2. Click **Welcome Email → Authentication → Set Session Cookie**
3. Follow the popup instructions
4. Paste the entire cookie value
5. Click **OK**

### 7. Test the Connection

1. Select any row in your Form Responses sheet
2. Click **Welcome Email → Create draft from selected row**
3. The dialog should open and show your Blueshift templates in the dropdown
4. If templates load, your session cookie is working!

## Troubleshooting

### Can't Find the Cookie

**Solution:** Make sure you're logged into Blueshift. Try:
1. Refresh the Blueshift page
2. Log out and log back in with Google SSO
3. Check cookies immediately after logging in

### Cookie Doesn't Work

**Possible causes:**
1. **Copied incorrectly**: Make sure you copied the entire value
2. **Cookie expired**: Session cookies expire. You'll need to get a fresh one
3. **Wrong cookie**: Try copying a different cookie if multiple are present
4. **Need full cookie string**: Some systems need the full cookie format like `_session=value`

**Solution:**
- Try copying in this format: `cookie_name=cookie_value`
- Example: `_session=s%3Aj8KJfH3k...rest_of_value`

### Templates Not Loading

1. Open browser console (F12 → Console tab)
2. Look for error messages
3. Check if you see "401 Unauthorized" or "403 Forbidden"
4. If so, get a fresh session cookie

### Session Expires

**Session cookies typically expire:**
- When you log out of Blueshift
- After 24 hours (varies by platform)
- When you clear browser cookies
- When Blueshift session timeout occurs

**When it expires:**
1. Log back into Blueshift via Google SSO
2. Get a fresh session cookie
3. Update it in the tool: **Welcome Email → Authentication → Set Session Cookie**

## Security Notes

### Where is the Cookie Stored?

- **Script Properties**: Google Apps Script secure storage
- **Not visible** in the sheet or code
- **Only accessible** by the script and authorized users
- **Encrypted** by Google's infrastructure

### Cookie Access

- The cookie has the **same permissions** as your logged-in account
- It can access any data **you** can access in Blueshift
- Treat it like a password - don't share it
- It's tied to your browser session and account

### Best Practices

1. **Don't share** the cookie value with others
2. **Get a fresh cookie** if you think it's compromised
3. **Use the "Clear Authentication" option** if you need to revoke access
4. **Re-authenticate periodically** for security

## Alternative: API Key Method

If session cookies don't work for your setup, you can use the traditional API key method:

1. Go to Blueshift → Settings → API Keys
2. Generate a new User API key
3. In the sheet: **Welcome Email → Authentication → Set API Key**
4. Paste your API key

Both methods work the same way - pick whichever is easier for you!

## Visual Reference

### Chrome DevTools - Application Tab
```
Application Tab
├── Storage
│   ├── Local Storage
│   ├── Session Storage
│   └── Cookies  ← Click here
│       └── https://app.getblueshift.com  ← Then click here
│           ├── _session  ← This is likely your session cookie
│           │   Name: _session
│           │   Value: s%3Aj8KJfH3k...  ← Copy this entire value
│           │   Domain: .getblueshift.com
│           │   ...
```

### What to Copy
```
Name:  _session
Value: s%3Aj8KJfH3k2pQvX9H7mN4bC8wY2fG5tR1aK3zL6nP0oI9jD4eA7xW
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
       Copy this ENTIRE value (may be much longer)
```

---

Need help? Check the tool's GitHub repository for issues and discussions.
