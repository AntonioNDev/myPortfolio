/* Hero 3D scene: a rotating DNA double helix, kept as the sole centerpiece
   so it reads clearly next to the text. Built from plain primitives and
   only ever loaded on devices that can afford it (see script.js). */

(function () {
  if (typeof THREE === 'undefined') return;

  var container = document.getElementById('hero-scene');
  var canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Renderer / scene / camera ----------
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.1, 5.4);
  camera.lookAt(0, 0, 0);

  var ambient = new THREE.AmbientLight(0xffffff, 0.6);
  var keyLight = new THREE.DirectionalLight(0xffffff, 0.65);
  keyLight.position.set(2, 3, 4);
  var rimLight = new THREE.PointLight(0xffffff, 0.4);
  rimLight.position.set(-3, -1, 2);
  scene.add(ambient, keyLight, rimLight);

  // ---------- Theme-aware, slightly desaturated palette ----------
  var palette = {
    dark: { a: 0x2fb8a3, b: 0xe8695c, rung: 0x8296a0 },
    light: { a: 0x0e9c8a, b: 0xc94636, rung: 0x6f8489 }
  };

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  var matA = new THREE.MeshStandardMaterial({ color: 0x2fb8a3, emissive: 0x2fb8a3, emissiveIntensity: 0.32, roughness: 0.45, metalness: 0.12 });
  var matB = new THREE.MeshStandardMaterial({ color: 0xe8695c, emissive: 0xe8695c, emissiveIntensity: 0.32, roughness: 0.45, metalness: 0.12 });
  var matRung = new THREE.MeshStandardMaterial({ color: 0x8296a0, roughness: 0.65, metalness: 0.05, transparent: true, opacity: 0.4 });

  function applyTheme() {
    var p = palette[currentTheme()];
    matA.color.setHex(p.a); matA.emissive.setHex(p.a);
    matB.color.setHex(p.b); matB.emissive.setHex(p.b);
    matRung.color.setHex(p.rung);
  }
  applyTheme();
  window.addEventListener('themechange', applyTheme);

  // ---------- Build the DNA helix ----------
  var helixGroup = new THREE.Group();
  var turns = 3.2;
  var pointsPerTurn = 26;
  var totalPoints = Math.round(turns * pointsPerTurn);
  var height = 3.7;
  var yStart = -1.85;
  var radius = 1.0;

  var strandA = [];
  var strandB = [];
  for (var i = 0; i <= totalPoints; i++) {
    var t = i / totalPoints;
    var angle = t * turns * Math.PI * 2;
    var y = yStart + t * height;
    strandA.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    strandB.push(new THREE.Vector3(Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius));
  }

  var curveA = new THREE.CatmullRomCurve3(strandA);
  var curveB = new THREE.CatmullRomCurve3(strandB);
  var tubeA = new THREE.Mesh(new THREE.TubeGeometry(curveA, totalPoints, 0.028, 8, false), matA);
  var tubeB = new THREE.Mesh(new THREE.TubeGeometry(curveB, totalPoints, 0.028, 8, false), matB);
  helixGroup.add(tubeA, tubeB);

  var rungAxis = new THREE.Vector3(0, 1, 0);
  var rungMeshes = [];
  for (var j = 0; j < strandA.length; j += 5) {
    var pA = strandA[j];
    var pB = strandB[j];
    var mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
    var dir = new THREE.Vector3().subVectors(pB, pA);
    var len = dir.length();

    var rung = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, len, 6, 1), matRung);
    rung.position.copy(mid);
    rung.quaternion.setFromUnitVectors(rungAxis, dir.clone().normalize());
    helixGroup.add(rung);

    var nodeA = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), matA);
    nodeA.position.copy(pA);
    var nodeB = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), matB);
    nodeB.position.copy(pB);
    helixGroup.add(nodeA, nodeB);
    rungMeshes.push(nodeA, nodeB);
  }

  // ---------- Assemble rig ----------
  var spin = new THREE.Group();
  spin.add(helixGroup);

  var tilt = new THREE.Group();
  tilt.add(spin);
  scene.add(tilt);

  // ---------- Interaction state ----------
  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // Scroll through the hero: helix spins up slightly and eases back as it leaves view
  var scrollProgress = 0;
  function updateScrollProgress() {
    var rect = container.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var p = 1 - Math.min(Math.max((rect.top + rect.height) / (vh + rect.height), 0), 1);
    scrollProgress = p;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Click / tap: a quick glow pulse, purely for delight
  var pulse = 0;
  canvas.addEventListener('click', function () {
    pulse = 1;
  });

  // ---------- Resize (keeps the whole rig framed at any aspect ratio) ----------
  var boundingRadius = 1.75;
  var vFov = camera.fov * Math.PI / 180;

  function fitDistance(aspect) {
    var hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    var distV = boundingRadius / Math.sin(vFov / 2);
    var distH = boundingRadius / Math.sin(hFov / 2);
    return Math.max(distV, distH) * 1.05;
  }

  function resize() {
    var w = container.clientWidth || 1;
    var h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = fitDistance(camera.aspect);
    camera.updateProjectionMatrix();
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(container);
  } else {
    window.addEventListener('resize', resize);
  }
  window.addEventListener('load', resize);
  resize();

  // ---------- Visibility gating (pause when off-screen / tab hidden) ----------
  var isVisible = true;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      isVisible = entries[0].isIntersecting;
      if (isVisible) start();
    }, { threshold: 0.05 });
    io.observe(container);
  }
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) start();
  });

  // ---------- Animation loop ----------
  var rafId = null;
  var clock = new THREE.Clock();
  var baseSpin = reduceMotion ? 0.015 : 0.12;

  function tick() {
    if (!isVisible || document.hidden) { rafId = null; return; }
    var dt = clock.getDelta();

    spin.rotation.y += dt * (baseSpin + scrollProgress * 0.22);

    var targetTiltX = mouseY * 0.1;
    var targetTiltY = mouseX * 0.16;
    tilt.rotation.x += (targetTiltX - tilt.rotation.x) * 0.045;
    tilt.rotation.y += (targetTiltY - tilt.rotation.y) * 0.045;

    if (pulse > 0.002) {
      pulse *= 0.92;
      var boost = pulse * 0.6;
      matA.emissiveIntensity = 0.32 + boost;
      matB.emissiveIntensity = 0.32 + boost;
    } else if (pulse !== 0) {
      pulse = 0;
      matA.emissiveIntensity = 0.32;
      matB.emissiveIntensity = 0.32;
    }

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  function start() {
    if (rafId === null) { clock.getDelta(); rafId = requestAnimationFrame(tick); }
  }
  start();
})();
