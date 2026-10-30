import { models, getModel, media } from './data.js';

const headlines = {
  aero: ['The everyday.', 'Reimagined.'],
  apex: ['A little presence.', 'A new perspective.'],
  nova: ['A new beginning.', 'Make it yours.'],
  teja: ['A change of scene.', 'A different day.'],
  vayu: ['Everyday purpose.', 'Fresh perspective.'],
  vega: ['Your city.', 'A new expression.'],
};

/** Two real image layers, one viewport-aware clock, no background slide timers. */
export class HeroCarousel {
  constructor(element, { initial = 'aero', onChange, duration = 6000 }) {
    this.element = element;
    this.onChange = onChange;
    this.duration = duration;
    this.index = models.findIndex(model => model.id === initial);
    this.images = [...element.querySelectorAll('.hero-image')];
    this.activeLayer = 0;
    this.elapsed = 0;
    this.frame = 0;
    this.lastTime = 0;
    this.changeToken = 0;
    this.userPaused = false;
    this.focusPaused = false;
    this.hovered = false;
    this.inView = false;
    this.destroyed = false;
    this.transitioning = false;
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    this.events = new AbortController();
    const listen = (target, event, callback) => target.addEventListener(event, callback, { signal: this.events.signal });
    this.button = element.querySelector('[data-hero-pause]');
    this.progress = element.querySelector('.hero-slide-progress span');
    this.status = element.querySelector('.hero-slide-status');
    listen(this.button, 'pointerdown', () => { this.pointerIntent = this.userPaused || this.focusPaused; });
    listen(this.button, 'click', () => {
      // Focus intentionally stops rotation; this explicit action can resume it.
      const stopped = this.pointerIntent ?? (this.userPaused || this.focusPaused);
      this.pointerIntent = undefined;
      this.userPaused = !stopped;
      this.focusPaused = false;
      this.updatePlayback();
    });
    listen(element, 'click', event => {
      const next = event.target.closest('[data-hero-step]');
      const dot = event.target.closest('[data-hero-slide]');
      if (next) this.goTo(models[(this.index + Number(next.dataset.heroStep) + models.length) % models.length].id, { manual: true });
      if (dot) this.goTo(dot.dataset.heroSlide, { manual: true });
    });
    listen(element, 'focusin', () => { this.focusPaused = true; this.updatePlayback(); });
    listen(element, 'pointerenter', () => { if (this.finePointer.matches) { this.hovered = true; this.updatePlayback(); } });
    listen(element, 'pointerleave', () => { this.hovered = false; this.updatePlayback(); });
    listen(element.querySelector('.hero-carousel-controls'), 'keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowLeft' ? -1 : 1;
      this.goTo(models[(this.index + direction + models.length) % models.length].id, { manual: true });
    });
    listen(document, 'visibilitychange', () => this.updatePlayback());
    listen(document, 'pravah-motion-change', () => this.updatePlayback());
    listen(document, 'pravah-menu-change', () => this.updatePlayback());
    listen(this.motion, 'change', () => this.updatePlayback());
    this.observer = new IntersectionObserver(entries => {
      this.inView = entries[0].isIntersecting && entries[0].intersectionRatio > 0.25;
      this.updatePlayback();
    }, { threshold: [0, 0.25, 0.5] });
    this.observer.observe(element);
    element.dataset.model = initial;
    this.images[0].classList.add('is-active');
    this.paintControls();
    this.preloadNext();
    this.updatePlayback();
  }

  canPlay() {
    return !this.destroyed && !this.motion.matches && !this.userPaused && !this.focusPaused &&
      !this.hovered && this.inView && !document.hidden &&
      !document.documentElement.classList.contains('motion-paused') && !document.body.classList.contains('menu-open');
  }

  updatePlayback() {
    const running = this.canPlay();
    this.element.dataset.running = String(running);
    this.button.textContent = this.userPaused || this.focusPaused ? 'Resume slideshow' : 'Pause slideshow';
    this.button.setAttribute('aria-pressed', String(this.userPaused || this.focusPaused));
    this.button.disabled = this.motion.matches || document.documentElement.classList.contains('motion-paused');
    if (this.motion.matches) this.button.textContent = 'Reduced motion';
    else if (document.documentElement.classList.contains('motion-paused')) this.button.textContent = 'Motion paused';
    this.lastTime = 0;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    if (running) this.frame = requestAnimationFrame(time => this.tick(time));
  }

  tick(time) {
    this.frame = 0;
    if (!this.canPlay()) { this.updatePlayback(); return; }
    if (this.lastTime && !this.transitioning) this.elapsed += Math.min(time - this.lastTime, 100);
    this.lastTime = time;
    this.progress.style.transform = `scaleX(${Math.min(1, this.elapsed / this.duration)})`;
    if (this.elapsed >= this.duration && !this.transitioning) {
      this.elapsed = 0;
      this.goTo(models[(this.index + 1) % models.length].id);
    }
    this.frame = requestAnimationFrame(next => this.tick(next));
  }

  async goTo(id, { manual = false } = {}) {
    const model = getModel(id);
    if (!model || this.destroyed) return;
    if (manual) { this.userPaused = true; this.focusPaused = false; this.updatePlayback(); }
    const token = ++this.changeToken;
    if (this.element.dataset.model === id) { this.elapsed = 0; this.transitioning = false; this.paintControls(); return; }
    this.transitioning = true;
    const incomingLayer = 1 - this.activeLayer;
    const incoming = this.images[incomingLayer];
    try {
      incoming.src = media(id);
      await incoming.decode();
      if (token !== this.changeToken || this.destroyed) return;
      const outgoing = this.images[this.activeLayer];
      // The outgoing visual stays painted until the incoming source is decoded.
      incoming.alt = `${model.name} in its supplied visual setting`;
      incoming.removeAttribute('aria-hidden');
      outgoing.setAttribute('aria-hidden', 'true');
      incoming.classList.add('is-active');
      outgoing.classList.remove('is-active');
      this.activeLayer = incomingLayer;
      this.index = models.findIndex(item => item.id === id);
      this.element.dataset.model = id;
      const [first, second] = headlines[id];
      this.element.querySelector('h1').innerHTML = `${first}<br><span>${second}</span>`;
      this.element.querySelector('.hero-description').textContent = model.description;
      const link = this.element.querySelector('[data-hero-discover]');
      link.href = `/models/${id}`;
      link.innerHTML = `Discover ${model.name} <span aria-hidden="true">↗</span>`;
      this.element.querySelector('[data-hero-model]').textContent = model.name;
      const copy = this.element.querySelector('.hero-content');
      copy.getAnimations().forEach(animation => animation.cancel());
      if (!this.motion.matches && !document.documentElement.classList.contains('motion-paused')) {
        copy.animate([{ opacity: 0.2, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], {
          duration: 650, easing: 'cubic-bezier(.22,1,.36,1)',
        });
      }
      this.elapsed = 0;
      this.progress.style.transform = 'scaleX(0)';
      this.paintControls();
      this.onChange(id);
      if (manual) this.status.textContent = `${model.name}. ${model.line} Slide ${this.index + 1} of ${models.length}.`;
      this.preloadNext();
    } catch {
      if (token === this.changeToken) {
        this.userPaused = true;
        this.status.textContent = `${model.name} image could not load. The previous slide is still shown. Try another model.`;
        this.updatePlayback();
      }
    } finally {
      if (token === this.changeToken) this.transitioning = false;
    }
  }

  paintControls() {
    this.element.querySelector('[data-slide-number]').textContent = String(this.index + 1).padStart(2, '0');
    this.element.querySelectorAll('[data-hero-slide]').forEach(button => {
      const current = button.dataset.heroSlide === models[this.index].id;
      button.setAttribute('aria-pressed', String(current));
      if (current) button.setAttribute('aria-current', 'true'); else button.removeAttribute('aria-current');
    });
  }

  preloadNext() {
    // Preload one hero only. Do not eagerly download all models' frame sequences.
    this.preload = new Image();
    this.preload.src = media(models[(this.index + 1) % models.length].id);
  }

  destroy() {
    this.destroyed = true;
    ++this.changeToken;
    cancelAnimationFrame(this.frame);
    this.events.abort();
    this.observer.disconnect();
  }
}
