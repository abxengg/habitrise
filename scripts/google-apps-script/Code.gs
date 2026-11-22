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

// Safety limits
const MAX_BODY = 10000;                 // characters per submission
const MAX_PER_MINUTE = 30;              // submissions per minute, across the whole site
const DUPLICATE_WINDOW_SECONDS = 30;    // the same form + contact within this window is saved once
const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[A-Za-z]{2,24}$/;
const PHONE_RE = /^\+?[0-9][0-9 ()-]{6,18}$/;

// Who gets an email for every submission (comma-separate several addresses).
// Set it in Apps Script → Project Settings → Script properties → NOTIFY_EMAIL, or let the GitHub deploy
// fill in DEFAULT_NOTIFY_EMAIL from its NOTIFY_EMAIL secret. Either way your address stays out of the public repo.
const DEFAULT_NOTIFY_EMAIL = 'manimitit@gmail.com';
const NOTIFY_EMAIL = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL') || DEFAULT_NOTIFY_EMAIL;

// Sheet tabs and their columns. "Timestamp" is added first and "Email status" last, automatically.
const FORMS = {
  register: {
    sheet: 'Registrations',
    subject: d => `New registration: ${d.name} (${d.plan === 'student' ? 'Student' : 'Professional'})`,
    fields: [
      ['plan', 'Plan'], ['name', 'Name'], ['email', 'Email'], ['phone', 'WhatsApp'], ['college', 'College / school'],
      ['city', 'City'], ['age', 'Age'], ['occupation', 'Occupation'], ['source', 'Heard from'], ['consent', 'Consent'], ['collegeEmail', 'College email'], ['page', 'Page'],
    ],
  },
  riseread: {
    sheet: 'Rise & Read',
    subject: d => `Rise & Read sign-up: ${d.name} (${d.plan || d.iam || '—'})`,
    fields: [['plan', 'Plan'], ['name', 'Name'], ['phone', 'WhatsApp'], ['email', 'Email'], ['iam', 'I am a'], ['organisation', 'College / company'], ['collegeEmail', 'College email'], ['page', 'Page'], ['memberCheck', 'Member check']],
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
  const raw = (e && e.postData && e.postData.contents) || '';
  if (raw.length > MAX_BODY) return json({ ok: false, error: 'too large' });

  let data;
  try { data = JSON.parse(raw || '{}'); } catch (err) { return json({ ok: false, error: 'bad request' }); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ ok: false, error: 'bad request' });

  // bots fill the hidden "website" field: pretend all is well, save nothing
  if (clean(data.website)) return json({ ok: true, emailStatus: 'sent' });

  const form = Object.prototype.hasOwnProperty.call(FORMS, data.form) ? FORMS[data.form] : null;
  if (!form) return json({ ok: false, error: 'unknown form' });

  // keep only the fields this form stores, each cleaned and length-capped
  const d = {};
  form.fields.forEach(([key]) => { d[key] = clean(data[key], key === 'message' ? 1000 : 200); });
  if (d.page && !/^'?https:\/\//.test(d.page)) d.page = '';

  const missing = form.required
    ? form.required.some(k => !d[k])
    : !d.name || (!d.phone && !d.email); // register / interest / riseread: name + a way to reach them
  if (missing) return json({ ok: false, error: 'missing required details' });
  if (d.email && !EMAIL_RE.test(plain(d.email))) return json({ ok: false, error: 'invalid email' });
  if (d.phone && !PHONE_RE.test(plain(d.phone))) return json({ ok: false, error: 'invalid phone' });
  if (d.collegeEmail && !EMAIL_RE.test(plain(d.collegeEmail))) return json({ ok: false, error: 'invalid college email' });

  // flood and double-click protection
  const cache = CacheService.getScriptCache();
  const minute = 'n:' + Math.floor(Date.now() / 60000);
  const count = Number(cache.get(minute) || 0);
  if (count >= MAX_PER_MINUTE) return json({ ok: false, error: 'busy, please try again in a minute' });
  cache.put(minute, String(count + 1), 120);
  const dupKey = 'd:' + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, data.form + '|' + (d.email || '') + '|' + (d.phone || '')));
  if (cache.get(dupKey)) return json({ ok: true, emailStatus: 'sent', duplicate: true });

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // one submission at a time, so rows never collide
    cache.put(dupKey, '1', DUPLICATE_WINDOW_SECONDS);

    // Rise & Read "Habit Rise member" (free) claims are checked against past registrations.
    // The result goes only to the Sheet and the notification email, never back to the visitor,
    // so the form can't be used to find out who is a member.
    if (data.form === 'riseread') d.memberCheck = /member/i.test(plain(d.plan)) ? memberCheck(d) : '';

    // 1) save the row first
    const sheet = getSheet(form);
    const row = [new Date(), ...form.fields.map(([key]) => d[key]), 'pending'];
    sheet.appendRow(row);
    const rowIndex = sheet.getLastRow();
    const statusCol = row.length;

    // 2) then try the email, and 3) record what happened
    let emailStatus = 'sent';
    try {
      const lines = form.fields.map(([key, label]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(label)}</td><td style="padding:4px 0"><b>${escapeHtml(plain(d[key]) || '—')}</b></td></tr>`).join('');
      const replyTo = d.email && EMAIL_RE.test(plain(d.email)) ? plain(d.email) : undefined;
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: oneLine(form.subject(Object.fromEntries(Object.entries(d).map(([k, v]) => [k, plain(v)])))),
        htmlBody: `<p>A new submission arrived from the HabitRise website.</p><table>${lines}</table><p><a href="${escapeHtml(SpreadsheetApp.getActiveSpreadsheet().getUrl())}">Open the sheet</a></p>`,
        replyTo: replyTo,
        name: 'HabitRise Website',
      });
    } catch (err) {
      emailStatus = 'failed: ' + oneLine(err && err.message ? err.message : String(err));
    }
    sheet.getRange(rowIndex, statusCol).setValue(emailStatus);

    return json({ ok: true, emailStatus: emailStatus === 'sent' ? 'sent' : 'failed' });
  } catch (err) {
    console.error(err); // the details stay in the Apps Script log, never in the reply
    return json({ ok: false, error: 'could not save, please try again' });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the web-app URL in a browser just confirms it's running.
function doGet() {
  return json({ ok: true, service: 'HabitRise form receiver' });
}

// Looks for the same WhatsApp number (last 10 digits) or email in the Registrations tab.
function memberCheck(d) {
  try {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(FORMS.register.sheet);
    if (!sh || sh.getLastRow() < 2) return 'NOT FOUND - no registrations to check against';
    const values = sh.getDataRange().getDisplayValues();
    const head = values[0];
    const ec = head.indexOf('Email'), pc = head.indexOf('WhatsApp');
    const email = plain(d.email).toLowerCase();
    const phone = plain(d.phone).replace(/\D/g, '').slice(-10);
    for (let r = 1; r < values.length; r++) {
      const e2 = ec >= 0 ? String(values[r][ec]).replace(/^'/, '').trim().toLowerCase() : '';
      const p2 = pc >= 0 ? String(values[r][pc]).replace(/\D/g, '').slice(-10) : '';
      if ((email && e2 === email) || (phone.length === 10 && p2 === phone)) return 'OK - matches Registrations row ' + (r + 1) + (e2 === email ? ' (email)' : ' (WhatsApp)');
    }
    return 'NOT FOUND - check before confirming the free seat';
  } catch (err) {
    return 'could not check: ' + oneLine(err && err.message ? err.message : String(err));
  }
}

function getSheet(form) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(form.sheet) || ss.insertSheet(form.sheet);
  const header = ['Timestamp', ...form.fields.map(([, label]) => label), 'Email status'];
  if (sheet.getLastRow() > 0 && sheet.getLastColumn() < header.length) {
    // a form gained a field: rewrite the header row so the labels match the new columns
    sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold').setBackground('#121212').setFontColor('#f8af3c');
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(header);
    sheet.getRange(1, 1, 1, header.length).setFontWeight('bold').setBackground('#121212').setFontColor('#f8af3c');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Remove control characters, trim, cap the length, and stop spreadsheet formula injection:
// anything starting with = + - @ (or a tab / carriage return) is stored as plain text.
function clean(v, max) {
  let s = String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max || 200);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

// The value without the leading apostrophe added by clean(), for emails and checks.
function plain(s) {
  return String(s || '').replace(/^'/, '');
}

// Email subjects must stay on one line (no header injection) and short.
function oneLine(s) {
  return String(s).replace(/[\r\n\t]+/g, ' ').slice(0, 150);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"'`]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' })[c]);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
