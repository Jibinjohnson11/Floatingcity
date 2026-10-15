// Logo preloader. Leaves as soon as the hero can be shown complete — the document is parsed, the web
// fonts are ready (so the hero text never reflows from a fallback font) and the hero video has its first
// frame (so no empty background flashes before the film). Never waits for the whole video, and never
// longer than MAX_MS. Shown for at least MIN_MS so the logo finishes its entrance instead of blinking.
// Adds .hero-go so the hero text starts while the preloader fades.
(function () {
  'use strict';

  var root = document.documentElement;
  var loader = document.querySelector('.preloader');
  if (!loader) { root.classList.add('hero-go'); root.classList.remove('is-loading'); return; }

  var MIN_MS = 500;   // matches the logo's entrance animation
  var MAX_MS = 1800;  // under the 2.5s safety net in <head>
  var start = Date.now();
  var done = false;

  function finish() {
    if (done) return;
    done = true;
    root.classList.add('hero-go');
    loader.classList.add('is-done');
    var cleaned = false;
    var cleanup = function () {
      if (cleaned) return;
      cleaned = true;
      root.classList.remove('is-loading');
      loader.remove();
    };
    loader.addEventListener('transitionend', function (e) { if (e.target === loader) cleanup(); });
    setTimeout(cleanup, 600); // fallback if the transition doesn't fire
  }

  function fontsReady() {
    return document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  }

  // Resolves once the hero video can paint its first frame (or has failed / is absent)
  function videoFrameReady() {
    var video = document.querySelector('.hero-video');
    if (!video || video.readyState >= 2) return Promise.resolve();
    return new Promise(function (resolve) {
      video.addEventListener('loadeddata', resolve, { once: true });
      video.addEventListener('error', resolve, { once: true, capture: true }); // <source> errors don't bubble
    });
  }

  function onReady() {
    Promise.all([fontsReady(), videoFrameReady()]).then(function () {
      setTimeout(finish, Math.max(0, MIN_MS - (Date.now() - start)));
    });
  }

  if (document.readyState !== 'loading') onReady();
  else document.addEventListener('DOMContentLoaded', onReady);
  setTimeout(finish, MAX_MS);
})();
