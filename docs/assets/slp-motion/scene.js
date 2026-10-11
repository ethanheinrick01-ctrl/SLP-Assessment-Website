import * as THREE from './vendor/three.module.js';
import { FontLoader } from './vendor/FontLoader.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import { buildSculpture } from './sculpture.js?v=20261011-letter-colors';
import { sampleCamera, DURATION, JOIN_PHASE } from './camera-path.mjs';

const stage = document.querySelector('#slp-motion');
const fallback = document.querySelector('#slp-motion-fallback');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

try {
  const response = await fetch(new URL('./assets/helvetiker-bold.json', import.meta.url));
  if (!response.ok) throw new Error('The sculpture font did not load.');
  const font = new FontLoader().parse(await response.json());
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.transmissionResolutionScale = 0.65;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  stage.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  // The host page shows through the canvas; the environment lights only the glass.
  scene.background = null;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.035);
  scene.environment = env.texture;
  room.dispose();
  pmrem.dispose();
  const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x726582, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(-6, 12, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -15, right: 15, top: 12, bottom: -12, near: 0.1, far: 40 });
  key.shadow.bias = -0.001;
  key.shadow.normalBias = 0.035;
  key.shadow.radius = 5;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.4);
  rim.position.set(6, 5, -9);
  scene.add(rim);
  const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), new THREE.ShadowMaterial({ color: '#5d3d51', opacity: 0.16 }));
  shadowFloor.rotation.x = -Math.PI / 2;
  shadowFloor.position.y = -0.165;
  shadowFloor.receiveShadow = true;
  scene.add(shadowFloor);

  const sculpture = await buildSculpture(font);
  scene.add(sculpture.group);
  const { width, depth } = sculpture;
  const meshCount = sculpture.pieceCount;
  const orientation = new THREE.Matrix4();
  const basisRight = new THREE.Vector3(), basisUp = new THREE.Vector3(), basisBack = new THREE.Vector3();
  let topZoom = 0.7;

  let phase = reduce.matches ? 1 : 0;
  let playing = !reduce.matches;
  let elapsed = 0;
  const duration = DURATION;
  let last = performance.now();
  let visible = true;
  let dirty = true;
  function updateCamera() {
    const pose = sampleCamera(phase);
    camera.position.fromArray(pose.position);
    basisRight.fromArray(pose.right); basisUp.fromArray(pose.up); basisBack.fromArray(pose.back);
    orientation.makeBasis(basisRight, basisUp, basisBack);
    camera.quaternion.setFromRotationMatrix(orientation);
    camera.zoom = topZoom + (1 - topZoom) * pose.zoomMix - 0.09 * Math.sin(Math.PI * pose.zoomMix) ** 2;
    sculpture.update(phase);
    shadowFloor.material.opacity = 0.1 * pose.zoomMix;
    camera.updateProjectionMatrix();
  }
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    // Atlas is hidden while the evidence ledger or shortlist is open.
    if (!w || !h) return;
    const aspect = w / h;
    const viewW = Math.max(width * 1.26, 9.2 * aspect);
    camera.left = -viewW / 2;
    camera.right = viewW / 2;
    camera.top = viewW / aspect / 2;
    camera.bottom = -viewW / aspect / 2;
    topZoom = Math.min(0.94, viewW / (width * 1.14), (viewW / aspect) / (depth * 1.14));
    renderer.setSize(w, h);
    dirty = true;
  }
  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; dirty = true; }, { threshold: 0.05 }).observe(stage);
  resize();
  updateCamera();
  renderer.render(scene, camera);
  // Sheets move during the reveal, so their shadows follow them.
  renderer.shadowMap.autoUpdate = true;
  fallback.hidden = true;
  stage.setAttribute('aria-disabled', String(reduce.matches));

  function replay() {
    if (reduce.matches || playing) return;
    phase = 0; elapsed = 0; playing = true; dirty = true;
  }
  stage.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      replay();
    }
  });
  // Pointer entry is a single trigger. Pointer motion and resize never restart it.
  stage.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' && !reduce.matches && !playing) replay();
  });
  let touchStart = null;
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') touchStart = { x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointerup', event => {
    if (event.pointerType !== 'touch' || !touchStart) return;
    const distance = Math.hypot(event.clientX-touchStart.x, event.clientY-touchStart.y);
    touchStart = null;
    if (distance < 12 && !reduce.matches && !playing) replay();
  });
  stage.addEventListener('pointercancel', () => { touchStart = null; });
  reduce.addEventListener('change', () => {
    stage.setAttribute('aria-disabled', String(reduce.matches));
    if (reduce.matches) { phase = 1; playing = false; dirty = true; }
  });
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault(); playing = false; fallback.hidden = false;
    stage.setAttribute('aria-disabled', 'true');
    fallback.querySelector('.fallback-message').textContent = 'The 3D view paused. Reload to restore the sculpture.';
  });

  window.slpMotion = { getState: () => ({ phase, playing, meshCount, panes: sculpture.panes, thickness: sculpture.thickness, gapCarriers: sculpture.gapCarriers, duration, joinPhase: JOIN_PHASE, segment: sampleCamera(phase).segment, reducedMotion: reduce.matches, camera: camera.position.toArray(), quaternion: camera.quaternion.toArray(), draws: renderer.info.render.calls }) };
  function frame(now) {
    const dt = Math.min((now-last)/1000, 0.1); last = now;
    if (visible && !document.hidden) {
      if (playing) {
        elapsed += dt; phase = Math.max(0, Math.min(1, elapsed/duration)); dirty = true;
        if (phase >= 1) playing = false;
      }
      if (dirty) { updateCamera(); renderer.render(scene, camera); dirty = false; }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
} catch (error) {
  console.error(error);
  fallback.hidden = false;
  fallback.querySelector('.fallback-message').textContent = 'This browser could not start the 3D view. Try opening this page in Chrome or Safari.';
  stage.setAttribute('aria-disabled', 'true');
}
