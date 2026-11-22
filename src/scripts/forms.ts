// Shared form handling for the Register and Interest forms.
// Each <form data-hr-form> carries its settings as data-* attributes (all from the CMS):
//   data-endpoint   Google Apps Script web-app URL (settings.json → forms.endpoint)
//   data-kind       "register" | "interest" | "newsletter"  (which Sheet tab the row goes to)
//   data-msg-*      status messages
//   data-pay-*      Razorpay links per plan (register only)
// Submissions are sent as text/plain JSON so the browser doesn't need a CORS preflight;
// Apps Script answers with JSON the page can read.

type Msgs = { sending: string; success?: string; error: string; notConfigured: string; redirecting?: string; noPaymentLink?: string };

function status(form: HTMLFormElement, text: string, kind: 'info' | 'ok' | 'err') {
  const el = form.querySelector<HTMLElement>('[data-status]');
  if (!el) return;
  el.textContent = text;
  el.dataset.kind = kind;
  el.hidden = false;
}

// strip control characters and cap the length of anything typed into a form
const clean = (v: string, max = 1000) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);

// phone fields (🇮🇳 +91 prefix): keep digits only; a pasted "+91 …" or leading 0 is removed
function wirePhones(root: ParentNode) {
  root.querySelectorAll<HTMLInputElement>('input[data-tel]').forEach(input => {
    if (input.dataset.telWired) return;
    input.dataset.telWired = '1';
    input.addEventListener('input', () => {
      let d = input.value.replace(/\D/g, '');
      if (d.length > 10 && d.startsWith('91')) d = d.slice(2);
      if (d.length > 10 && d.startsWith('0')) d = d.slice(1);
      input.value = d.slice(0, 10);
    });
  });
}

// only send people to a real https payment page (never javascript: or other schemes)
const safeUrl = (u?: string) => { try { const x = new URL(u || ''); return x.protocol === 'https:' ? x.href : ''; } catch { return ''; } };

export function wireForms() {
  wirePhones(document);
  document.querySelectorAll<HTMLFormElement>('form[data-hr-form]').forEach(form => {
    if (form.dataset.wired) return; // safe to call more than once per page
    form.dataset.wired = '1';
    const d = form.dataset;
    const msgs: Msgs = {
      sending: d.msgSending ?? 'Sending…', success: d.msgSuccess, error: d.msgError ?? 'Something went wrong.',
      notConfigured: d.msgNotConfigured ?? 'This form is not connected yet.', redirecting: d.msgRedirecting, noPaymentLink: d.msgNoPaymentLink,
    };

    // Register: the college field is required only for the student plan
    const college = form.querySelector<HTMLElement>('[data-college]');
    const collegeInput = college?.querySelector('input');
    const syncPlan = () => {
      const plan = (form.querySelector('input[name="plan"]:checked') as HTMLInputElement | null)?.value;
      if (college && collegeInput) {
        const student = plan === 'student';
        college.hidden = !student;
        collegeInput.required = student;
      }
      document.querySelectorAll<HTMLElement>('[data-plan-card]').forEach(c => c.classList.toggle('on', c.dataset.planCard === plan));
    };
    form.addEventListener('change', syncPlan);
    // the classified ads double as plan pickers
    document.querySelectorAll<HTMLElement>('[data-plan-card]').forEach(card => card.addEventListener('click', () => {
      const r = form.querySelector<HTMLInputElement>(`input[name="plan"][value="${card.dataset.planCard}"]`);
      if (r) { r.checked = true; syncPlan(); form.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }));
    // preselect a plan from ?plan=student|others
    const pre = new URLSearchParams(location.search).get('plan');
    if (pre) { const r = form.querySelector<HTMLInputElement>(`input[name="plan"][value="${pre}"]`); if (r) r.checked = true; }
    syncPlan();

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data: Record<string, string> = {};
      new FormData(form).forEach((v, k) => (data[k] = clean(String(v), k === 'message' ? 1000 : 200)));
      // phone numbers are sent with their country code: "+91 9876543210"
      form.querySelectorAll<HTMLInputElement>('input[data-tel]').forEach(i => { if (data[i.name]) data[i.name] = `${i.dataset.cc || ''} ${data[i.name]}`.trim(); });
      if (data.website) return; // honeypot: bots fill hidden fields
      delete data.website;
      if (!d.endpoint) { status(form, msgs.notConfigured, 'err'); return; }

      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (button) button.disabled = true;
      status(form, msgs.sending, 'info');
      try {
        const send = async (body: Record<string, string>) => {
          const res = await fetch(d.endpoint!, { method: 'POST', body: JSON.stringify({ ...body, page: location.href, submittedAt: new Date().toISOString() }) });
          return res.json().catch(() => ({ ok: res.ok }));
        };
        let out = await send({ form: d.kind!, ...data });
        // an older form receiver that doesn't know this form yet: save it to a form it does know
        // (e.g. Rise & Read sign-ups land in the Interest tab), so no sign-up is ever lost
        if (!out.ok && out.error === 'unknown form' && d.fallbackKind) {
          const extra = Object.entries(data).filter(([k]) => !['name', 'email', 'phone', 'organisation', 'service', 'message'].includes(k)).map(([k, v]) => `${k}: ${v}`).join(' · ');
          out = await send({ form: d.fallbackKind, ...data, message: [data.message, extra].filter(Boolean).join(' · ') });
        }
        if (!out.ok) throw new Error(out.error || 'save failed');

        if (d.kind === 'register') {
          const link = safeUrl(data.plan === 'student' ? d.payStudent : d.payOthers);
          form.dispatchEvent(new CustomEvent('hr:saved')); // the live ticket gets its "Seat reserved" stamp
          if (link) {
            status(form, msgs.redirecting ?? msgs.sending, 'ok');
            setTimeout(() => (location.href = link), 1100); // let the stamp land first
          } else {
            status(form, msgs.noPaymentLink ?? msgs.success ?? '', 'ok');
            form.reset(); syncPlan(); form.dispatchEvent(new Event('input'));
          }
        } else {
          form.dispatchEvent(new CustomEvent('hr:saved', { detail: data })); // lets the page celebrate (letter flies off, chat reply…)
          status(form, msgs.success ?? '', 'ok');
          form.reset();
        }
      } catch {
        status(form, msgs.error, 'err');
      } finally {
        if (button) button.disabled = false;
      }
    });
  });
}
