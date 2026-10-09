// Logo preloader: fades out as soon as the document is ready — it does not wait for the hero video, images or
// fonts (shown for at least MIN_MS, at most MAX_MS). Adds .hero-go so the hero text starts while it fades.
(function () {
  'use strict';

  var root = document.documentElement;
  var loader = document.querySelector('.preloader');
  if (!loader) { root.classList.add('hero-go'); root.classList.remove('is-loading'); return; }

  var MIN_MS = 150;
  var MAX_MS = 1500;
  var start = Date.now();
  var done = false;

  function finish() {
    if (done) return;
    done = true;
    root.classList.add('hero-go');
    loader.classList.add('is-done');
    var cleanup = function () {
      root.classList.remove('is-loading');
      loader.remove();
    };
    loader.addEventListener('transitionend', cleanup, { once: true });
    setTimeout(cleanup, 600); // fallback if the transition doesn't fire
  }

  function onLoad() {
    setTimeout(finish, Math.max(0, MIN_MS - (Date.now() - start)));
  }

  if (document.readyState !== 'loading') onLoad();
  else document.addEventListener('DOMContentLoaded', onLoad);
  setTimeout(finish, MAX_MS);
})();
