document.documentElement.classList.add('js');
lucide.createIcons();

// hamburger
var ham = document.getElementById('ham');
var mob = document.getElementById('mob');

function toggle(e) {
  e.preventDefault();
  ham.classList.toggle('open');
  mob.classList.toggle('open');
}

ham.addEventListener('click', toggle);
ham.addEventListener('touchstart', toggle, { passive: false });

document.querySelectorAll('#mob a').forEach(function (a) {
  a.addEventListener('click', function () {
    ham.classList.remove('open');
    mob.classList.remove('open');
  });
});

// scroll reveal
var els = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  els.forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.06) + 's';
    obs.observe(el);
  });
} else {
  els.forEach(function (el) { el.classList.add('vis'); });
}

// active nav on scroll
var secs = document.querySelectorAll('section[id]');
var links = document.querySelectorAll('.nav-links a:not(.nav-cta)');

window.addEventListener('scroll', function () {
  var cur = '';
  secs.forEach(function (s) {
    if (window.scrollY >= s.offsetTop - 140) cur = s.id;
  });
  links.forEach(function (a) {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--white)' : '';
  });
});
