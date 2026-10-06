// Navbar: glass deepens on scroll, active-section indicator, and hamburger menu for tablet and mobile.
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!header || !toggle || !nav) return;

  // Scrolled state: more opaque glass once the page leaves the very top
  var ticking = false;
  function updateScrolled() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateScrolled); }
  }, { passive: true });
  updateScrolled();

  // Active link: follows the section in view (sections are matched by the links' #ids)
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  function setActive(link) {
    links.forEach(function (a) {
      if (a === link) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  var sections = links.map(function (a) {
    var id = a.getAttribute('href').slice(1);
    return id ? document.getElementById(id) : document.querySelector('.hero');
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(links[sections.indexOf(entry.target)]);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (el) { if (el) spy.observe(el); });
  }

  // Hamburger menu
  function setOpen(open) {
    document.documentElement.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    setActive(link);
    setOpen(false);
  });
  document.addEventListener('click', function (e) {
    if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
})();
