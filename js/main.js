// ============================================================
// Noltec — site interactions
// Dependency-free. Effects degrade gracefully and respect motion prefs.
// ============================================================

(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Mobile menu ----------
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mob');
  if (ham && mob) {
    ham.addEventListener('click', () => mob.classList.toggle('hidden'));
    mob.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => mob.classList.add('hidden'));
    });
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${Math.min(i * 40, 240)}ms`;
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- Nav: glass shadow after scroll ----------
  const navShell = document.querySelector('.nav-shell');
  const onScroll = () => {
    if (!navShell) return;
    navShell.classList.toggle('is-scrolled', window.scrollY > 8);

    let current = '';
    const y = window.scrollY + 160;
    document.querySelectorAll('section[id]').forEach((s) => {
      if (y >= s.offsetTop) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`);
    });
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // ---------- Card cursor spotlight (works on .service & .work-card) ----------
  document.querySelectorAll('.service, .work-card, .problem').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
})();
