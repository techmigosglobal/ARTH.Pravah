/** Shared user motion preference; intentionally kept in memory, not a tracking store. */
export function setupMotionControl() {
  const button = document.querySelector('.site-motion-toggle');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  const sync = () => {
    const paused = preference.matches || userPaused;
    document.documentElement.classList.toggle('motion-paused', paused);
    if(paused)document.querySelectorAll('.hero-content,.hero-actions,#gallery-image').forEach(element=>element.getAnimations().forEach(animation=>animation.cancel()));
    button.textContent = preference.matches ? 'Reduced motion' : userPaused ? 'Resume animations' : 'Pause animations';
    button.setAttribute('aria-pressed', String(paused));
    button.disabled = preference.matches;
    document.dispatchEvent(new CustomEvent('pravah-motion-change', { detail: { paused } }));
  };
  button.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  preference.addEventListener('change', sync);
  sync();
}

/** One demand-driven RAF for all parallax, progress and pointer accents on a page. */
export function setupPageMotion(root) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const events = new AbortController();
  const visible = new Set();
  const elements = [...root.querySelectorAll('.editorial-image, .about-image, .motion-interlude, .hero, .final-cta')];
  let raf = 0;
  let pointerX = 0;
  let pointerY = 0;
  const disabled = () => preference.matches || document.documentElement.classList.contains('motion-paused');
  const render = () => {
    raf = 0;
    const progress = document.querySelector('.page-scroll-progress');
    const extent = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${extent > 0 ? scrollY / extent : 0})`;
    for (const element of visible) {
      const rect = element.getBoundingClientRect();
      const amount = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / innerHeight));
      element.style.setProperty('--parallax-y', disabled() ? '0px' : `${amount * 28}px`);
    }
    const ornament = root.querySelector('.hero-orbits');
    if (ornament) {
      ornament.style.setProperty('--pointer-x', disabled() ? '0px' : `${pointerX * 9}px`);
      ornament.style.setProperty('--pointer-y', disabled() ? '0px' : `${pointerY * 9}px`);
    }
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('motion-in-view', entry.isIntersecting);
      if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target);
    }
    schedule();
  }, { threshold: 0 });
  elements.forEach(element => observer.observe(element));
  window.addEventListener('scroll', schedule, { passive: true, signal: events.signal });
  window.addEventListener('resize', schedule, { passive: true, signal: events.signal });
  document.addEventListener('pravah-motion-change', schedule, { signal: events.signal });
  preference.addEventListener('change', schedule, { signal: events.signal });
  const hero = root.querySelector('.hero');
  hero?.addEventListener('pointermove', event => {
    if (!pointer.matches || disabled()) return;
    const rect = hero.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    schedule();
  }, { passive: true, signal: events.signal });
  hero?.addEventListener('pointerleave', () => { pointerX = pointerY = 0; schedule(); }, { signal: events.signal });
  const groups = root.querySelectorAll('.collection-grid, .benefit-grid, .ownership-notes');
  groups.forEach(group => [...group.children].forEach((child, index) => {
    child.style.setProperty('--reveal-delay', `${index % 3 * 85}ms`);
  }));
  const visibility = () => { root.classList.toggle('document-hidden', document.hidden); };
  document.addEventListener('visibilitychange', visibility, { signal: events.signal });
  visibility();
  schedule();
  return () => { cancelAnimationFrame(raf); observer.disconnect(); events.abort(); };
}
