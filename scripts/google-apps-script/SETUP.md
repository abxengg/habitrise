# Connect the website forms to a Google Sheet + email (5 minutes, free)

Both forms (Register and "I'm interested") send their details here. Each submission becomes a
row in a Google Sheet **first**, then an email is sent. The last column, **Email status**, shows
`sent`, or `failed: <reason>` if the email couldn't go out — the row is saved either way.

1. **Create the Sheet.** Open <https://sheets.new> with the Google account that should own the data.
   Name it, e.g. "HabitRise registrations".
2. **Add the script.** In the Sheet: **Extensions → Apps Script**. Delete what's there, paste the
   whole of [`Code.gs`](./Code.gs), and change `NOTIFY_EMAIL` at the top if needed. Click **Save**.
3. **Deploy it.** **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click **Deploy**, approve the permissions (Sheets + send email as you), and copy the
   **Web app URL** (it ends in `/exec`).
4. **Paste the URL into the CMS.** Content Management → **Site settings** → *Form receiver URL*
   → paste → **Save**. The site redeploys in about a minute and both forms start working.
5. **Test.** Submit the Interest form on /services. A row should appear in the "Interest" tab and
   an email should arrive.

The "Registrations" and "Interest" tabs (with bold headers) are created automatically on the first
submission.

**Changed the script later?** Use **Deploy → Manage deployments → Edit (pencil) → Version: New
version → Deploy**. The URL stays the same, so nothing changes on the website.

**Email limits:** a free Gmail account can send about 100 emails a day from Apps Script (Google
Workspace: 1,500). Past that, rows still save and the status column says why the email failed.
