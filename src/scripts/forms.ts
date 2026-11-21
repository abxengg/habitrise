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

export function wireForms() {
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
      new FormData(form).forEach((v, k) => (data[k] = String(v).trim()));
      if (data.website) return; // honeypot: bots fill hidden fields
      delete data.website;
      if (!d.endpoint) { status(form, msgs.notConfigured, 'err'); return; }

      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (button) button.disabled = true;
      status(form, msgs.sending, 'info');
      try {
        const res = await fetch(d.endpoint, {
          method: 'POST',
          body: JSON.stringify({ form: d.kind, ...data, page: location.href, submittedAt: new Date().toISOString() }),
        });
        const out = await res.json().catch(() => ({ ok: res.ok }));
        if (!out.ok) throw new Error(out.error || 'save failed');

        if (d.kind === 'register') {
          const link = data.plan === 'student' ? d.payStudent : d.payOthers;
          form.dispatchEvent(new CustomEvent('hr:saved')); // the live ticket gets its "Seat reserved" stamp
          if (link) {
            status(form, msgs.redirecting ?? msgs.sending, 'ok');
            setTimeout(() => (location.href = link), 1100); // let the stamp land first
          } else {
            status(form, msgs.noPaymentLink ?? msgs.success ?? '', 'ok');
            form.reset(); syncPlan(); form.dispatchEvent(new Event('input'));
          }
        } else {
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
