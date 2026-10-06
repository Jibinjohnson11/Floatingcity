// Hero "city in numbers" band: once the preloader has gone and the hero text has risen in,
// fades the band in and counts each figure up once. Final values are already in the HTML,
// so without JS or with reduced motion everything simply shows in its final state.
(function () {
  'use strict';

  var band = document.querySelector('.hero-stats');
  if (!band) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var root = document.documentElement;
  var format = new Intl.NumberFormat('en-GB');
  var duration = 1800;
  var heroTextMs = 1100; // hero title/lead/CTA entrance (.9s + .2s stagger)
  var pauseMs = 800;     // breath after the CTA before the numbers appear
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
    // Each count starts as its column rises in (matches the CSS stagger: 250ms + i × 100ms)
    counters.forEach(function (el) {
      var i = parseInt(el.closest('.hero-stat').style.getPropertyValue('--i'), 10) || 0;
      setTimeout(function () { count(el); }, 250 + i * 100);
    });
  }

  band.classList.add('is-armed');
  counters.forEach(function (el) { el.textContent = '0'; });

  // Wait for the preloader to clear (it removes .is-loading from <html>), then for the hero text
  function schedule() { setTimeout(play, heroTextMs + pauseMs); }
  if (!root.classList.contains('is-loading')) {
    schedule();
  } else {
    var mo = new MutationObserver(function () {
      if (root.classList.contains('is-loading')) return;
      mo.disconnect();
      schedule();
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  }
})();
