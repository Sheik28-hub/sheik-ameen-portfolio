import * as THREE from 'three';

/**
 * SHEIK AMEEN PORTFOLIO — BESPOKE 3D HERO ENVIRONMENT
 * Premium Financial Technology & Analytics Architecture
 */

export function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return null;

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  
  // Node counts tuned for cinematic richness and performance
  const particleCount = isMobile ? 700 : isTablet ? 1400 : 2500;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070D, 0.018);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 30);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance'
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // -------------------------------------------------------------------------
  // 1. FINANCIAL TERRAIN GRID / UNDULATING MARKET WAVE
  // -------------------------------------------------------------------------
  const gridWidth = 90;
  const gridDepth = 70;
  const gridSegments = isMobile ? 32 : 55;
  const planeGeo = new THREE.PlaneGeometry(gridWidth, gridDepth, gridSegments, gridSegments);
  planeGeo.rotateX(-Math.PI / 2);
  planeGeo.translate(0, -12, -5);

  const planeMat = new THREE.MeshBasicMaterial({
    color: 0x00D4FF,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });

  const terrainMesh = new THREE.Mesh(planeGeo, planeMat);
  scene.add(terrainMesh);

  const posAttr = planeGeo.attributes.position;
  const initialY = new Float32Array(posAttr.count);
  for (let i = 0; i < posAttr.count; i++) {
    initialY[i] = posAttr.getY(i);
  }

  // -------------------------------------------------------------------------
  // 2. PARTICLE SYSTEM (FINANCIAL DATA CLOUD)
  // -------------------------------------------------------------------------
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const cyan = new THREE.Color(0x00D4FF);
  const ice = new THREE.Color(0xE0F7FA);
  const indigo = new THREE.Color(0x6366F1);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 85;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 65;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 55;

    const rnd = Math.random();
    const c = rnd > 0.65 ? cyan : rnd > 0.25 ? indigo : ice;
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.14 : 0.11,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // -------------------------------------------------------------------------
  // 3. CINEMATIC FLOATING GEOMETRIES
  // -------------------------------------------------------------------------
  const shapes = [];
  if (!isMobile) {
    const geoConfigs = [
      {
        geo: new THREE.IcosahedronGeometry(3.6, 0),
        pos: [16, 7, -10],
        rot: [0.003, 0.004, 0.002],
        color: 0x00D4FF,
        opacity: 0.24
      },
      {
        geo: new THREE.OctahedronGeometry(2.8, 0),
        pos: [-17, -4, -8],
        rot: [0.004, 0.003, 0.005],
        color: 0x6366F1,
        opacity: 0.22
      },
      {
        geo: new THREE.TorusGeometry(3.6, 0.35, 10, 28),
        pos: [18, -9, -15],
        rot: [0.002, 0.005, 0.001],
        color: 0x00D4FF,
        opacity: 0.18
      },
      {
        geo: new THREE.TorusGeometry(2.4, 0.28, 8, 22),
        pos: [-14, 11, -12],
        rot: [0.004, 0.002, 0.004],
        color: 0x6366F1,
        opacity: 0.20
      },
      {
        geo: new THREE.BoxGeometry(2.8, 2.8, 2.8),
        pos: [3, 14, -18],
        rot: [0.002, 0.004, 0.003],
        color: 0x00D4FF,
        opacity: 0.16
      }
    ];

    geoConfigs.forEach((cfg) => {
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: cfg.opacity
      });
      const mesh = new THREE.Mesh(cfg.geo, mat);
      mesh.position.set(...cfg.pos);
      mesh.userData = {
        rotSpeed: cfg.rot,
        baseY: cfg.pos[1],
        baseX: cfg.pos[0]
      };
      scene.add(mesh);
      shapes.push(mesh);
    });
  }

  // -------------------------------------------------------------------------
  // 4. ATMOSPHERIC LIGHTING
  // -------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0x05070D, 1.5);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00D4FF, 3.2, 100);
  cyanLight.position.set(15, 15, 15);
  scene.add(cyanLight);

  const indigoLight = new THREE.PointLight(0x6366F1, 2.5, 90);
  indigoLight.position.set(-15, -12, 10);
  scene.add(indigoLight);

  // -------------------------------------------------------------------------
  // 5. ANIMATION LOOP WITH UNDULATING WAVE & PARALLAX
  // -------------------------------------------------------------------------
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  const clock = new THREE.Clock();
  let animationFrameId = null;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth Lerp Mouse values
    currentMouseX += (targetMouseX - currentMouseX) * 0.045;
    currentMouseY += (targetMouseY - currentMouseY) * 0.045;

    // 1. Undulate the Market Terrain Wave
    const positions = posAttr.array;
    for (let i = 0; i < posAttr.count; i++) {
      const u = (i % (gridSegments + 1)) / gridSegments;
      const v = Math.floor(i / (gridSegments + 1)) / gridSegments;
      const wave = Math.sin(u * 7 + elapsed * 1.2) * Math.cos(v * 6 + elapsed * 0.9) * 2.2;
      positions[i * 3 + 1] = initialY[i] + wave;
    }
    posAttr.needsUpdate = true;

    // 2. Rotate Data Cloud
    particles.rotation.y = elapsed * 0.025 + currentMouseX * 0.12;
    particles.rotation.x = elapsed * 0.01 + currentMouseY * 0.08;

    // 3. Float Wireframe Shapes
    shapes.forEach((shape, idx) => {
      const rs = shape.userData.rotSpeed;
      shape.rotation.x += rs[0];
      shape.rotation.y += rs[1];
      shape.rotation.z += rs[2];

      shape.position.y = shape.userData.baseY + Math.sin(elapsed * 0.7 + idx * 1.4) * 1.8;
      shape.position.x = shape.userData.baseX + Math.cos(elapsed * 0.5 + idx) * 0.9;
    });

    // 4. Subtle Dynamic Camera Tilt
    camera.position.x += (currentMouseX * 2.8 - camera.position.x) * 0.035;
    camera.position.y += (2 - currentMouseY * 2.0 - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // -------------------------------------------------------------------------
  // 6. RESIZE LISTENER & CLEANUP
  // -------------------------------------------------------------------------
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  window.addEventListener('resize', handleResize);

  function destroy() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
    planeGeo.dispose();
    planeMat.dispose();
    particleGeometry.dispose();
    particleMaterial.dispose();
    shapes.forEach((s) => {
      s.geometry.dispose();
      s.material.dispose();
    });
    renderer.dispose();
  }

  return {
    updateMouse(x, y) {
      targetMouseX = x;
      targetMouseY = y;
    },
    destroy
  };
}
