// Page motion — the scroll "story". Loaded on every page (from the footer).
//   • sections and cards reveal in sequence as they scroll into view
//   • an amber reading-progress bar along the top
//   • the side-margin drawings (Gutter.astro) drift against their section as it scrolls past
//   • numbers count up when they appear
// Everything is skipped for visitors who ask their device for reduced motion.

const REVEAL = [
  '.s-hero-copy > *', '.s-tracker-wrap', '.s-head', '.s-card', '.s-stat', '.s-tabs', '.s-panel.on',
  '.s-group', '.s-board', '.s-founder-img', '.s-founder-card > div:last-child', '.s-msg', '.s-ticket',
  '.s-form', '.s-faq details', '.s-final-box', '.s-ab-photo', '.s-ab-chapter', '.s-ab-card', '.s-ab-journey li', '.s-news', '.s-gi',
].join(',');

export function startMotion() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // reading progress bar
  const bar = document.querySelector<HTMLElement>('.s-progress i');
  // only the drawings that are actually shown (wide screens)
  const wms = [...document.querySelectorAll<HTMLElement>('.s-wm')];
  const gis = matchMedia('(min-width: 1360px)').matches ? [...document.querySelectorAll<HTMLElement>('.s-gi')] : [];
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    if (!reduce) wms.forEach(w => {
      const r = w.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      w.style.setProperty('--wx', `${(((r.top + r.height / 2 - innerHeight / 2) / (innerHeight + r.height)) * 140).toFixed(1)}px`);
    });
    if (!reduce && gis.length) gis.forEach(g => {
      const sec = g.parentElement!.parentElement!.getBoundingClientRect();
      if (sec.bottom < -200 || sec.top > innerHeight + 200) return;
      // -1 … 1 as the section passes through the viewport; right-side drawings move a little more
      const p = (sec.top + sec.height / 2 - innerHeight / 2) / (innerHeight + sec.height);
      g.querySelector<HTMLElement>('i')!.style.setProperty('--py', `${(p * (g.classList.contains('s-gi-right') ? 160 : 110)).toFixed(1)}px`);
    });
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
