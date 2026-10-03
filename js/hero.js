// Hero background video: pause while the hero is off-screen, and respect reduced-motion.
(function () {
  'use strict';

  var video = document.querySelector('.hero-video');
  if (!video) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function play() {
    if (reduceMotion.matches) return;
    var p = video.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stays visible */ });
  }

  if (reduceMotion.matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) play();
      else video.pause();
    }).observe(video.closest('.hero'));
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) video.pause();
    else play();
  });
})();
