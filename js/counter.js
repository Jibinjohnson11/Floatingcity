// Hero "city in numbers" band: as soon as the hero text is under way and the band is on screen,
// fades the band in and counts each figure up once. Final values are already in the HTML,
// so without JS or with reduced motion everything simply shows in its final state.
(function () {
  'use strict';

  var band = document.querySelector('.hero-stats');
  if (!band) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var root = document.documentElement;
  var format = new Intl.NumberFormat('en-GB');
  var duration = 1000;
  var afterHeroMs = 300; // lets the hero title lead; the band follows while the CTA is still rising
  var counters = band.querySelectorAll('.counter[data-target]');

  // Ease-out quart: fast start, long settle into the final value
  function ease(t) { return 1 - Math.pow(1 - t, 4); }

  function count(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var start = null;
    function step(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      el.textContent = format.format(Math.round(target * ease(t)));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function play() {
    band.classList.add('is-visible');
    // Each count starts as its column rises in (matches the CSS stagger: 80ms + i × 60ms)
    counters.forEach(function (el) {
      var i = parseInt(el.closest('.hero-stat').style.getPropertyValue('--i'), 10) || 0;
      setTimeout(function () { count(el); }, 80 + i * 60);
    });
  }

  band.classList.add('is-armed');
  counters.forEach(function (el) { el.textContent = '0'; });

  // Start once the hero text has begun (.hero-go, added as the preloader fades) and the band is in view
  var started = false;
  function heroGo() { return root.classList.contains('hero-go') || !root.classList.contains('is-loading'); }
  function startWhenVisible() {
    if (!('IntersectionObserver' in window)) { play(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting || started) return;
      started = true;
      io.disconnect();
      play();
    }, { threshold: 0 });
    io.observe(band);
  }
  function schedule() { setTimeout(startWhenVisible, afterHeroMs); }
  if (heroGo()) {
    schedule();
  } else {
    var mo = new MutationObserver(function () {
      if (!heroGo()) return;
      mo.disconnect();
      schedule();
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  }
})();
