/**
 * Premium reel-style motion — Lenis + GSAP ScrollTrigger
 */
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('[data-hero-cta], [data-footer-cta], [data-reveal], [data-reveal-item]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  let lenis = null;
  let initialHashAligned = false;

  function ensureButtonsVisible() {
    document.querySelectorAll('[data-hero-cta], [data-footer-cta]').forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0, visibility: 'visible', clearProps: 'transform' });
    });
  }

  function initLenis() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  function initAnchorScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    function scrollToTarget(target, href, duration = 1.2) {
      const targetY = target.getBoundingClientRect().top + window.scrollY - 90;
      if (href && window.history && window.history.pushState) {
        window.history.pushState(null, '', href);
      }

      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(targetY, { duration });
      } else {
        window.scrollTo({ top: targetY, behavior: duration ? 'smooth' : 'auto' });
      }
    }

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        const menu = document.getElementById('mobile-menu');
        const toggle = document.getElementById('nav-toggle');
        if (menu && menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          toggle?.setAttribute('aria-expanded', 'false');
          menu.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('menu-open');
          lenis?.start();
        }

        e.preventDefault();
        scrollToTarget(target, href);
      });
    });

    window.addEventListener('load', () => {
      const hash = window.location.hash;
      const target = hash ? document.querySelector(hash) : null;
      if (!target) return;

      requestAnimationFrame(() => {
        scrollToTarget(target, null, 0.7);
      });
    });
  }

  function alignInitialHash(force = false) {
    if (initialHashAligned && !force) return;

    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;
    if (!target) return;

    initialHashAligned = true;
    const targetY = target.getBoundingClientRect().top + window.scrollY - 90;
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(targetY, { duration: 0.8 });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }

  function initNavActive() {
    const links = document.querySelectorAll('[data-nav-link]');
    const sections = ['work', 'about', 'experience', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!links.length || !sections.length) return;

    function setActive(id) {
      links.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('is-active', href === `#${id}`);
      });
    }

    function updateActive() {
      const y = lenis && typeof lenis.scroll === 'number' ? lenis.scroll : window.scrollY;
      const marker = y + window.innerHeight * 0.42;
      const current = sections.reduce((active, section) => {
        return section.offsetTop <= marker ? section : active;
      }, sections[0]);
      setActive(current.id);
    }

    if (lenis) {
      lenis.on('scroll', updateActive);
    }
    window.addEventListener('scroll', updateActive, { passive: true });
    ScrollTrigger.addEventListener('refresh', updateActive);
    updateActive();
  }

  function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('mobile-menu');

    if (!nav || !toggle || !menu) return;

    const updateNavScroll = () => {
      const y = lenis && typeof lenis.scroll === 'number' ? lenis.scroll : window.scrollY;
      nav.classList.toggle('is-scrolled', y > 24);
    };

    if (lenis) {
      lenis.on('scroll', updateNavScroll);
    }
    window.addEventListener('scroll', updateNavScroll, { passive: true });
    updateNavScroll();

    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
      if (lenis) open ? lenis.stop() : lenis.start();
      else document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        if (lenis) lenis.start();
        else document.body.style.overflow = '';
      });
    });
  }

  function initCursorBlob() {
    const blob = document.getElementById('cursor-blob');
    if (!blob || prefersReducedMotion) {
      if (blob) blob.style.display = 'none';
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let blobX = mouseX;
    let blobY = mouseY;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      blobX += (mouseX - blobX) * 0.08;
      blobY += (mouseY - blobY) * 0.08;
      blob.style.transform = `translate3d(calc(${blobX}px - 50%), calc(${blobY}px - 50%), 0)`;
      requestAnimationFrame(animate);
    }
    animate();
  }

  function splitHeroWords() {
    ['hero-title', 'hero-title-mobile'].forEach((id) => {
      const el = document.getElementById(id);
      if (!el || el.dataset.split === 'true') return;
      const text = el.textContent.trim();
      el.innerHTML = '';
      text.split(/\s+/).forEach((word, i, arr) => {
        const span = document.createElement('span');
        span.className = 'hero-word inline-block';
        span.textContent = word;
        el.appendChild(span);
        if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
      });
      el.dataset.split = 'true';
    });
  }

  function initHeroEntrance() {
    splitHeroWords();
    ensureButtonsVisible();

    const eyebrow = document.querySelector('[data-hero-eyebrow]');
    const titles = document.querySelectorAll('#hero-title, #hero-title-mobile');
    const words = document.querySelectorAll('#hero-title .hero-word, #hero-title-mobile .hero-word');
    const portrait = document.querySelector('[data-hero-portrait]');
    const cta = document.querySelector('[data-hero-cta]');
    const blurs = document.querySelectorAll('[data-hero-blur]');

    if (prefersReducedMotion) {
      titles.forEach(t => t.classList.remove('opacity-0'));
      gsap.set([eyebrow, words, portrait, blurs, cta], { opacity: 1, y: 0, scale: 1, rotate: 0 });
      ensureButtonsVisible();
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: ensureButtonsVisible,
    });

    // Remove the HTML opacity-0 classes now that JS has taken over
    eyebrow.classList.remove('opacity-0');
    portrait.classList.remove('opacity-0');
    cta.classList.remove('opacity-0');
    titles.forEach(t => {
      t.classList.remove('opacity-0');
      gsap.set(t, { opacity: 1 }); // Ensure parent is visible so children can animate
    });

    tl.set([eyebrow, words, portrait], { opacity: 0, y: 36 })
      .set(portrait, { scale: 0.94, rotate: -2 })
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.55 })
      .to(words, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, '-=0.3')
      .to(portrait, { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.75 }, '-=0.35')
      .fromTo(cta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.4');

    if (blurs.length) {
      gsap.fromTo(blurs, { opacity: 0, scale: 0.85 }, { opacity: 0.45, scale: 1, duration: 1, stagger: 0.12, ease: 'power2.out' });
    }

    setTimeout(ensureButtonsVisible, 2000);
  }

  function initHeroParallax() {
    if (prefersReducedMotion || isMobile) return;

    const hero = document.getElementById('hero');
    if (!hero) return;

    const title = document.getElementById('hero-title') || document.getElementById('hero-title-mobile');
    const portrait = document.querySelector('[data-hero-portrait]');
    const blurs = document.querySelectorAll('[data-hero-blur]');

    if (title) {
      gsap.to(title, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    }
    if (portrait) {
      gsap.to(portrait, {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.5 },
      });
    }
    blurs.forEach((blur, i) => {
      gsap.to(blur, {
        y: (i + 1) * 40,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
    });
  }

  function initTiltCards() {
    if (prefersReducedMotion || isMobile) return;

    document.querySelectorAll('[data-tilt]').forEach((container) => {
      const card = container.querySelector('[data-tilt-inner]');
      if (!card) return;

      const rotX = gsap.quickTo(card, 'rotateX', { duration: 0.4, ease: 'power2.out' });
      const rotY = gsap.quickTo(card, 'rotateY', { duration: 0.4, ease: 'power2.out' });

      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        rotY(x * 12);
        rotX(-y * 12);
      });

      container.addEventListener('mouseleave', () => {
        rotX(0);
        rotY(0);
      });
    });
  }

  function initWorkReel() {
    const section = document.getElementById('work');
    const stage = section?.querySelector('.work-reel-stage');
    const header = section?.querySelector('[data-work-header]');
    const cards = gsap.utils.toArray('[data-work-card]');
    const orbit = section?.querySelector('[data-work-orbit]');
    const glows = gsap.utils.toArray('[data-scene-glow]');
    if (!section || !cards.length) return;

    if (prefersReducedMotion) {
      gsap.set([header, cards, orbit, glows], { clearProps: 'all' });
      return;
    }

    if (isMobile) {
      gsap.from(cards, {
        opacity: 0,
        y: 36,
        scale: 0.98,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      });
      return;
    }

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.set(header, { opacity: 1, y: 0 });
      gsap.set(cards, { opacity: 0.42, y: 44, scale: 0.96, rotateX: -4 });
      gsap.set(orbit, { opacity: 0.28, scale: 0.86, rotate: -12 });
      gsap.set(glows, { opacity: 0.4, scale: 0.92 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=2300',
          scrub: 0.8,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(orbit, { opacity: 0.55, scale: 1, rotate: 0, duration: 0.36, ease: 'power2.out' })
        .to(glows, { opacity: 0.58, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '<')
        .to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.58,
          stagger: 0.16,
          ease: 'power3.out',
        }, '<')
        .to(cards[0], { y: -24, scale: 0.985, duration: 0.4, ease: 'none' }, '+=0.2')
        .to(cards[1], { y: 18, scale: 1.015, duration: 0.4, ease: 'none' }, '<')
        .to(cards[2], { y: -18, scale: 0.995, duration: 0.4, ease: 'none' }, '<')
        .to(header, { y: -28, opacity: 0.84, duration: 0.4, ease: 'none' }, '<')
        .to(orbit, { rotate: 18, scale: 1.08, opacity: 0.34, duration: 0.4, ease: 'none' }, '<')
        .to(cards, {
          opacity: 0.72,
          y: -38,
          scale: 0.985,
          duration: 0.38,
          stagger: 0.04,
          ease: 'power2.in',
        }, '+=0.18');

      glows.forEach((glow, i) => {
        gsap.to(glow, {
          y: i % 2 === 0 ? 70 : -60,
          x: i % 2 === 0 ? 30 : -30,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.9,
          },
        });
      });

      return () => {
        tl.kill();
      };
    });
  }

  function initSectionReveals() {
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      if (el.closest('#hero')) return;
      if (prefersReducedMotion) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }
      gsap.from(el, {
        opacity: 0,
        y: 32,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });

    gsap.utils.toArray('[data-reveal-stagger]').forEach((group) => {
      const items = group.querySelectorAll('[data-reveal-item]');
      if (!items.length) return;
      if (prefersReducedMotion) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  function initAboutParallax() {
    if (prefersReducedMotion || isMobile) return;

    const about = document.getElementById('about');
    if (!about) return;

    const left = about.querySelector('[data-parallax-slow]');
    const right = about.querySelector('[data-parallax-fast]');

    if (left) {
      gsap.to(left, {
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: about, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });
    }
    if (right) {
      gsap.to(right, {
        y: -50,
        ease: 'none',
        scrollTrigger: { trigger: about, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    }
  }

  function initFooterEntrance() {
    const footer = document.getElementById('contact');
    if (!footer) return;

    ensureButtonsVisible();

    if (prefersReducedMotion) return;

    const heading = footer.querySelector('[data-footer-heading]');

    if (heading) {
      gsap.from(heading, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 88%' },
      });
    }
  }

  function initMarquee() {
    const track = document.querySelector('[data-marquee-track]');
    if (!track || prefersReducedMotion) return;

    const content = track.innerHTML;
    track.innerHTML = content + content;

    const marqueeTween = gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      duration: 32,
      repeat: -1,
    });

    const wrap = track.parentElement;
    if (wrap) {
      wrap.addEventListener('mouseenter', () => marqueeTween.pause());
      wrap.addEventListener('mouseleave', () => marqueeTween.resume());
    }
  }

  function refresh() {
    ScrollTrigger.refresh();
  }

  function init() {
    ensureButtonsVisible();
    initLenis();
    initNav();
    initAnchorScroll();
    initCursorBlob();
    initHeroEntrance();
    initMarquee();

    window.addEventListener('load', () => {
      initNavActive();
      initHeroParallax();
      initWorkReel();
      initTiltCards();
      initSectionReveals();
      initAboutParallax();
      initFooterEntrance();
      ensureButtonsVisible();
      refresh();
      requestAnimationFrame(alignInitialHash);
      window.setTimeout(() => alignInitialHash(true), 700);
    });

    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
