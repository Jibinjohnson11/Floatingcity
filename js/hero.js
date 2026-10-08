// Hero background video: picks the responsive or desktop cut, pauses while the hero is off-screen,
// and respects reduced-motion.
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

  // Responsive source: dedicated responsive cut at ≤ 768px, the desktop film above.
  // The <source media> attributes pick the right file on load; this swaps it only when the
  // breakpoint actually flips (resize or rotation), and corrects browsers that ignore media.
  var RESPONSIVE = 'Assets/Videos/responsive%20hero%20section.mp4';
  var DESKTOP = 'Assets/Videos/hero_section.mp4';
  var responsiveQuery = window.matchMedia('(max-width: 768px)');

  function wanted() { return responsiveQuery.matches ? RESPONSIVE : DESKTOP; }
  function isShowing(src) { return (video.currentSrc || '').indexOf(src.split('/').pop()) !== -1; }

  function useSource() {
    var src = wanted();
    if (isShowing(src)) return;
    video.src = src; // overrides the <source> list from here on
    video.load();
    play();
  }

  if (responsiveQuery.addEventListener) responsiveQuery.addEventListener('change', useSource);
  else if (responsiveQuery.addListener) responsiveQuery.addListener(useSource);

  if (video.currentSrc) useSource();
  else video.addEventListener('loadstart', useSource, { once: true });
})();
