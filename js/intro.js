// Introducing Muziris: plays the background film while in view, reveals each [data-reveal] group once
// as it enters view.
// With reduced motion everything simply shows, and nothing moves.
(function () {
  'use strict';

  var section = document.querySelector('.intro');
  if (!section) return;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Background film: plays only while the section is on screen and the tab is visible;
  // stays on its first frame for reduced motion
  var video = section.querySelector('.intro-video');
  if (video && !reduceMotion && 'IntersectionObserver' in window) {
    var inView = false;
    var play = function () {
      if (!inView || document.hidden) return;
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked: the tint and first frame stay */ });
    };
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) play();
      else video.pause();
    }, { rootMargin: '200px 0px' }).observe(section);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) video.pause();
      else play();
    });
  }

  if (reduceMotion) return;

  // Entrance
  if ('IntersectionObserver' in window) {
    var groups = section.querySelectorAll('[data-reveal]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.2 });
    groups.forEach(function (el) {
      el.classList.add('is-armed');
      observer.observe(el);
    });
  }
})();
