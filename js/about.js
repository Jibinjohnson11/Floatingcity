// About Muziris (home preview): reveals the story and the image collage once as the section enters view.
// With reduced motion, or without IntersectionObserver, everything simply shows.
(function () {
  'use strict';

  var group = document.querySelector('[data-about-reveal]');
  if (!group || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  group.classList.add('is-armed');
  var observer = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    group.classList.add('is-visible');
  }, { threshold: 0.25 });
  observer.observe(group);
})();
