// Page motion — the scroll "story". Loaded on every page (from the footer).
//   • sections and cards reveal in sequence as they scroll into view
//   • an amber reading-progress bar along the top
//   • numbers count up when they appear
// Everything is skipped for visitors who ask their device for reduced motion.

const REVEAL = [
  '.s-hero-copy > *', '.s-tracker-wrap', '.s-head', '.s-card', '.s-stat', '.s-tabs', '.s-panel.on',
  '.s-group', '.s-board', '.s-founder-img', '.s-founder-card > div:last-child', '.s-msg', '.s-ticket',
  '.s-form:not(.s-wz-form)', '.s-faq details', '.s-final-box', '.s-ab-photo', '.s-ab-chapter', '.s-ab-card', '.s-ab-journey li', '.s-news', '.s-ia-side', '.s-wz', '.s-chatform', '.s-qform', '.s-svc', '.s-rr-problem > *', '.s-rr-list li', '.s-rr-plan', '.s-rr-who .s-card',
].join(',');

export function startMotion() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // reading progress bar
  const bar = document.querySelector<HTMLElement>('.s-progress i');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
  onScroll();

  if (reduce || !('IntersectionObserver' in window)) return;

  // count-up numbers like "5,000+" or "4.9/5"
  const countUp = (el: HTMLElement) => {
    const m = el.textContent?.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const end = parseFloat(m[1].replace(/,/g, ''));
    const decimals = (m[1].split('.')[1] || '').length;
    const suffix = m[2];
    const t0 = performance.now(), dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur), v = end * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // reveal in sequence: siblings get increasing delays so groups read like a story
  const items = [...document.querySelectorAll<HTMLElement>(REVEAL)];
  const counters = new Map<Element, number>();
  items.forEach(el => {
    const parent = el.parentElement!;
    const i = counters.get(parent) ?? 0;
    counters.set(parent, i + 1);
    el.style.setProperty('--rv-i', String(Math.min(i, 6)));
    el.classList.add('rv');
  });
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target as HTMLElement;
    el.classList.add('in');
    if (el.matches('.s-stat')) { const b = el.querySelector<HTMLElement>('b'); if (b) countUp(b); }
    io.unobserve(el);
  }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  items.forEach(el => io.observe(el));
}
