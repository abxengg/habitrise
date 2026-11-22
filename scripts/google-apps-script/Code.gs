/**
 * HabitRise form receiver — Google Apps Script web app.
 *
 * Every Register / Interest / Newsletter submission from the website:
 *   1. is saved as a row in this Google Sheet FIRST (so nothing is ever lost),
 *   2. is then emailed to NOTIFY_EMAIL,
 *   3. gets its "Email status" cell set to "sent" or "failed: <reason>".
 *
 * Setup (once): see scripts/google-apps-script/SETUP.md in the website repo.
 */

// Who gets an email for every submission (comma-separate several addresses).
const NOTIFY_EMAIL = 'manimitit@gmail.com';

// Sheet tabs and their columns. "Timestamp" is added first and "Email status" last, automatically.
const FORMS = {
  register: {
    sheet: 'Registrations',
    subject: d => `New registration: ${d.name} (${d.plan === 'student' ? 'Student' : 'Professional'})`,
    fields: [
      ['plan', 'Plan'], ['name', 'Name'], ['email', 'Email'], ['phone', 'WhatsApp'], ['college', 'College / school'],
      ['city', 'City'], ['age', 'Age'], ['occupation', 'Occupation'], ['source', 'Heard from'], ['consent', 'Consent'], ['page', 'Page'],
    ],
  },
  riseread: {
    sheet: 'Rise & Read',
    subject: d => `Rise & Read sign-up: ${d.name} (${d.plan || d.iam || '—'})`,
    fields: [['plan', 'Plan'], ['name', 'Name'], ['phone', 'WhatsApp'], ['email', 'Email'], ['iam', 'I am a'], ['organisation', 'College / company'], ['page', 'Page']],
  },
  newsletter: {
    sheet: 'Newsletter',
    subject: d => `New newsletter subscriber: ${d.email}`,
    required: ['email'],
    fields: [['email', 'Email'], ['name', 'First name'], ['page', 'Page']],
  },
  interest: {
    sheet: 'Interest',
    subject: d => `New interest: ${d.name} — ${d.service}`,
    fields: [
      ['service', 'Service'], ['name', 'Name'], ['phone', 'WhatsApp'], ['email', 'Email'],
      ['organisation', 'College / company'], ['message', 'Message'], ['page', 'Page'],
    ],
  },
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // one submission at a time, so rows never collide
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const form = FORMS[data.form];
    if (!form) return json({ ok: false, error: 'unknown form' });
    const missing = form.required
      ? form.required.some(k => !clean(data[k]))
      : !clean(data.name) || (!clean(data.phone) && !clean(data.email)); // register / interest: name + a way to reach them
    if (missing) return json({ ok: false, error: 'missing required details' });

    // 1) save the row first
    const sheet = getSheet(form);
    const row = [new Date(), ...form.fields.map(([key]) => clean(data[key])), 'pending'];
    sheet.appendRow(row);
    const rowIndex = sheet.getLastRow();
    const statusCol = row.length;

    // 2) then try the email, and 3) record what happened
    let emailStatus = 'sent';
    try {
      const lines = form.fields.map(([key, label]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${label}</td><td style="padding:4px 0"><b>${escapeHtml(clean(data[key]) || '—')}</b></td></tr>`).join('');
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: form.subject(data),
        htmlBody: `<p>A new submission arrived from the HabitRise website.</p><table>${lines}</table><p><a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}">Open the sheet</a></p>`,
        replyTo: clean(data.email) || undefined,
        name: 'HabitRise Website',
      });
    } catch (err) {
      emailStatus = 'failed: ' + (err && err.message ? err.message : String(err));
    }
    sheet.getRange(rowIndex, statusCol).setValue(emailStatus);

    return json({ ok: true, emailStatus: emailStatus === 'sent' ? 'sent' : 'failed' });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the web-app URL in a browser just confirms it's running.
function doGet() {
  return json({ ok: true, service: 'HabitRise form receiver' });
}

function getSheet(form) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(form.sheet) || ss.insertSheet(form.sheet);
  if (sheet.getLastRow() === 0) {
    const header = ['Timestamp', ...form.fields.map(([, label]) => label), 'Email status'];
    sheet.appendRow(header);
    sheet.getRange(1, 1, 1, header.length).setFontWeight('bold').setBackground('#121212').setFontColor('#f8af3c');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Trim, cap length, and stop spreadsheet formula injection (=, +, -, @ at the start).
function clean(v) {
  let s = String(v == null ? '' : v).trim().slice(0, 1000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
