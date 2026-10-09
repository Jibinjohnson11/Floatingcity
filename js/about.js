// About Muziris (home preview): reveals the story and the image collage once as the section enters view.
// With reduced motion, or without IntersectionObserver, everything simply shows.
(function () {
  'use strict';

  var root = document.documentElement;
  var group = document.querySelector('[data-about-reveal]');
  if (group) initCollage(group);
  if (!group || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.remove('ab-pending');
    return;
  }

  group.classList.add('is-armed');
  var observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    group.classList.add('is-visible');
  }, { threshold: 0.25 });
  observer.observe(group);

  // Images: revealed only once the visitor has scrolled ~50% through the section, i.e. half of the
  // section's height has come up past the bottom of the viewport. Measured from real scroll position,
  // so it works the same on every screen size; runs once.
  var section = group.closest('.about') || group;
  var ticking = false;
  function progress() {
    var r = section.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return (vh - r.top) / r.height;
  }
  function check() {
    ticking = false;
    if (progress() < 0.5) return;
    group.classList.add('shots-visible');
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(check); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  check(); // page may open already scrolled past the trigger

  // Collage hover / tap to expand: marks the active image on the collage (data-active) and CSS reshapes the grid.
  // Waits for the scroll reveal to finish; tablet and up only (phones keep the static collage).
  function initCollage(group) {
    var collage = group.querySelector('.about-collage');
    if (!collage) return;
    var wide = window.matchMedia('(min-width: 768px)');
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

    function ready() {
      return wide.matches && (!group.classList.contains('is-armed') || group.classList.contains('shots-visible'));
    }
    function nameOf(shot) {
      if (shot.classList.contains('about-shot--vision')) return 'vision';
      if (shot.classList.contains('about-shot--home')) return 'home';
      return null; // Our Journey is the default layout
    }
    function setActive(name) {
      if (name) collage.setAttribute('data-active', name);
      else collage.removeAttribute('data-active');
    }

    Array.prototype.forEach.call(collage.querySelectorAll('.about-shot'), function (shot) {
      shot.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'mouse' && canHover.matches && ready()) setActive(nameOf(shot));
      });
      // Touch / pen: tap an image to expand it, tap it again to restore
      shot.addEventListener('click', function () {
        if (canHover.matches || !ready()) return;
        var name = nameOf(shot);
        setActive(collage.getAttribute('data-active') === name ? null : name);
      });
    });
    collage.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse') setActive(null);
    });
    wide.addEventListener('change', function () { if (!wide.matches) setActive(null); });
  }
})();
