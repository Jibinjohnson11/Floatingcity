// Logo preloader: fades out once the page has loaded (shown for at least MIN_MS, at most MAX_MS).
(function () {
  'use strict';

  var root = document.documentElement;
  var loader = document.querySelector('.preloader');
  if (!loader) { root.classList.remove('is-loading'); return; }

  var MIN_MS = 1200;
  var MAX_MS = 6000;
  var start = Date.now();
  var done = false;

  function finish() {
    if (done) return;
    done = true;
    loader.classList.add('is-done');
    var cleanup = function () {
      root.classList.remove('is-loading');
      loader.remove();
    };
    loader.addEventListener('transitionend', cleanup, { once: true });
    setTimeout(cleanup, 1000); // fallback if the transition doesn't fire
  }

  function onLoad() {
    setTimeout(finish, Math.max(0, MIN_MS - (Date.now() - start)));
  }

  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad);
  setTimeout(finish, MAX_MS);
})();
