(function () {
  // ---------- Theme toggle ----------
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* sandboxed preview: ignore */ }
    if (toggle) {
      var isLight = theme === 'light';
      toggle.setAttribute('aria-pressed', String(isLight));
      toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
    setTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  }

  // ---------- Mobile nav ----------
  var menuToggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // ---------- Scroll cue ----------
  var scrollCue = document.getElementById('scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', function () {
      var about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---------- 3D hero: only on devices that can afford it ----------
  // Small phones and touch devices get a lightweight static gradient instead
  // of loading Three.js at all, so nothing heavy ever downloads there.
  function isCapableDevice() {
    var narrow = window.matchMedia('(max-width: 700px)').matches;
    var coarse = window.matchMedia('(pointer: coarse)').matches;
    return !narrow && !coarse;
  }

  var heroScene = document.getElementById('hero-scene');
  if (heroScene) {
    if (isCapableDevice()) {
      heroScene.classList.add('is-3d');
      var threeScript = document.createElement('script');
      threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      threeScript.onload = function () {
        var sceneScript = document.createElement('script');
        sceneScript.src = 'scene.js';
        document.body.appendChild(sceneScript);
      };
      document.body.appendChild(threeScript);
    } else {
      heroScene.classList.add('is-static');
    }
  }

  // ---------- Subtle 3D tilt on a few panels (fine pointer + hover only) ----------
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var maxTilt = 5;
    document.querySelectorAll('.tilt-target').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rx = (0.5 - py) * maxTilt;
        var ry = (px - 0.5) * maxTilt;
        el.style.transform = 'perspective(800px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }
})();
