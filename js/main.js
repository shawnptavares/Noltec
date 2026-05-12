// ============================================================
// Noltec — site interactions
// Kept dependency-free and small. All effects degrade gracefully.
// ============================================================

(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Mobile menu ----------
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mob');
  if (ham && mob) {
    ham.addEventListener('click', () => {
      mob.classList.toggle('hidden');
    });
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

  // ---------- Active nav link on scroll ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const setActive = () => {
    let current = '';
    const y = window.scrollY + 160;
    sections.forEach((s) => {
      if (y >= s.offsetTop) current = s.id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`);
    });
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { setActive(); ticking = false; });
      ticking = true;
    }
  });
  setActive();

  // ---------- Project card cursor spotlight ----------
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  // ---------- Contribution graph (deterministic, decorative) ----------
  const graph = document.getElementById('contrib-graph');
  if (graph) {
    const weeks = 20;
    const days = 7;
    const total = weeks * days;
    // Deterministic pseudo-random so the graph is stable across loads.
    const seed = (i) => {
      const x = Math.sin(i * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };
    const levels = [
      'bg-bg ring-1 ring-line',
      'bg-primary/20',
      'bg-primary/45',
      'bg-primary/70',
      'bg-accent',
    ];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const r = seed(i);
      const level = r < 0.35 ? 0 : r < 0.6 ? 1 : r < 0.8 ? 2 : r < 0.93 ? 3 : 4;
      const cell = document.createElement('span');
      cell.className = `aspect-square rounded-sm ${levels[level]}`;
      frag.appendChild(cell);
    }
    // Render as columns (weeks) of 7 days each
    graph.style.gridTemplateColumns = `repeat(${weeks}, minmax(0, 1fr))`;
    graph.style.gridAutoFlow = 'column';
    graph.style.gridTemplateRows = `repeat(${days}, minmax(0, 1fr))`;
    graph.appendChild(frag);
  }
})();
