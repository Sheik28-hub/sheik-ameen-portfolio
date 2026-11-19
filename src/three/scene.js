import * as THREE from 'three';

/**
 * SHEIK AMEEN — THE FINANCIAL UNIVERSE
 * Phase 2 & Phase 3: Signature 3D Cinematic Environment
 * 
 * Features:
 * - Interactive 3D Point-Cloud Globe with Global Capital Nodes
 * - 6 Key Financial Hubs (NYC, London, Frankfurt, Tokyo, Singapore, Hyderabad/Mumbai)
 * - Great-Circle 3D Connection Arcs with Traveling Light Pulses
 * - Multiple Concentric Counter-Rotating Orbital Rings
 * - High-Specular Metallic PBR Floating Objects (Platinum, Cyan Chrome, Indigo)
 * - Multi-Depth Ambient Data Particles & Procedural Nebula
 * - Perspective Cyber-Financial Horizon Grid
 * - Dynamic Atmospheric Lighting (Key, Fill, Rim)
 * - Smooth Mouse Parallax & Scroll-based Depth Transition
 */

export function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return null;

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  // -------------------------------------------------------------------------
  // 1. SCENE & CAMERA SETUP
  // -------------------------------------------------------------------------
  const scene = new THREE.Scene();
  // Atmospheric Fog using Midnight Black (#070A12)
  scene.fog = new THREE.FogExp2(0x070A12, isMobile ? 0.024 : 0.018);

  const camera = new THREE.PerspectiveCamera(
    52,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.2, 34);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance'
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x070A12, 0);

  // -------------------------------------------------------------------------
  // 2. ATMOSPHERIC LIGHTING SYSTEM
  // -------------------------------------------------------------------------
  // Ambient Navy Tone
  const ambientLight = new THREE.AmbientLight(0x0D1422, 2.2);
  scene.add(ambientLight);

  // Key Light: Electric Cyan (#00D4FF)
  const cyanKeyLight = new THREE.PointLight(0x00D4FF, 5.0, 140);
  cyanKeyLight.position.set(22, 18, 24);
  scene.add(cyanKeyLight);

  // Fill Light: Royal Indigo (#6865F2)
  const indigoFillLight = new THREE.PointLight(0x6865F2, 4.2, 120);
  indigoFillLight.position.set(-24, -14, 18);
  scene.add(indigoFillLight);

  // Specular Rim Light: Platinum (#C8D0DC)
  const rimLight = new THREE.DirectionalLight(0xC8D0DC, 1.8);
  rimLight.position.set(0, 30, -20);
  scene.add(rimLight);

  // -------------------------------------------------------------------------
  // 3. PERSPECTIVE CYBER-FINANCIAL HORIZON GRID
  // -------------------------------------------------------------------------
  const gridHelper = new THREE.GridHelper(160, 36, 0x00D4FF, 0x263447);
  gridHelper.position.y = -19;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = isMobile ? 0.12 : 0.22;
  scene.add(gridHelper);

  // -------------------------------------------------------------------------
  // 4. THE SIGNATURE HERO GLOBE (THE FINANCIAL UNIVERSE)
  // -------------------------------------------------------------------------
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Offset globe to the right on desktop for perfect balance with hero typography
  const globeOffsetX = isMobile ? 0 : 8.2;
  const globeOffsetY = isMobile ? -2.2 : 0.4;
  globeGroup.position.set(globeOffsetX, globeOffsetY, -2);

  const globeRadius = isMobile ? 7.2 : 10.2;
  const globeSegments = isMobile ? 24 : 40;

  // 4A. Wireframe Core Sphere
  const globeCoreGeo = new THREE.SphereGeometry(globeRadius, globeSegments, globeSegments);
  const globeCoreMat = new THREE.MeshBasicMaterial({
    color: 0x00D4FF,
    wireframe: true,
    transparent: true,
    opacity: 0.06
  });
  const globeCoreMesh = new THREE.Mesh(globeCoreGeo, globeCoreMat);
  globeGroup.add(globeCoreMesh);

  // 4B. Inner Luminous Core
  const innerGlowGeo = new THREE.SphereGeometry(globeRadius * 0.94, 24, 24);
  const innerGlowMat = new THREE.MeshBasicMaterial({
    color: 0x0A1628,
    transparent: true,
    opacity: 0.75
  });
  const innerGlowMesh = new THREE.Mesh(innerGlowGeo, innerGlowMat);
  globeGroup.add(innerGlowMesh);

  // 4C. Fibonacci Surface Data Nodes
  const nodeCount = isMobile ? 360 : 850;
  const nodePositions = new Float32Array(nodeCount * 3);
  const nodeColors = new Float32Array(nodeCount * 3);

  const colCyan = new THREE.Color(0x00D4FF);
  const colIce = new THREE.Color(0xC8D0DC);
  const colIndigo = new THREE.Color(0x6865F2);

  for (let i = 0; i < nodeCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / nodeCount);
    const theta = Math.sqrt(nodeCount * Math.PI) * phi;

    const r = globeRadius * (1 + Math.random() * 0.035);
    nodePositions[i * 3]     = r * Math.cos(theta) * Math.sin(phi);
    nodePositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    nodePositions[i * 3 + 2] = r * Math.cos(phi);

    const pick = Math.random();
    const c = pick > 0.55 ? colCyan : pick > 0.2 ? colIndigo : colIce;
    nodeColors[i * 3]     = c.r;
    nodeColors[i * 3 + 1] = c.g;
    nodeColors[i * 3 + 2] = c.b;
  }

  const globeNodesGeo = new THREE.BufferGeometry();
  globeNodesGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
  globeNodesGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

  const globeNodesMat = new THREE.PointsMaterial({
    size: isMobile ? 0.22 : 0.17,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending
  });

  const globeNodes = new THREE.Points(globeNodesGeo, globeNodesMat);
  globeGroup.add(globeNodes);

  // -------------------------------------------------------------------------
  // 5. GLOBAL FINANCIAL HUBS & GREAT-CIRCLE ARCS
  // -------------------------------------------------------------------------
  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  // Major Financial Centers
  const hubs = [
    { name: 'NYC', lat: 40.71, lon: -74.00 },
    { name: 'LON', lat: 51.50, lon: -0.12 },
    { name: 'FRA', lat: 50.11, lon: 8.68 },
    { name: 'TYO', lat: 35.68, lon: 139.69 },
    { name: 'SIN', lat: 1.35, lon: 103.82 },
    { name: 'HYD', lat: 17.38, lon: 78.48 } // Hyderabad / KFin HQ
  ];

  const hubObjects = [];
  const hubMarkerGeo = new THREE.SphereGeometry(0.24, 12, 12);
  const hubRingGeo = new THREE.RingGeometry(0.28, 0.45, 16);

  hubs.forEach((h) => {
    const pos = latLonToVector3(h.lat, h.lon, globeRadius * 1.02);

    // Glowing core dot
    const hubMat = new THREE.MeshBasicMaterial({
      color: 0x00D4FF,
      transparent: true,
      opacity: 0.95
    });
    const hubMesh = new THREE.Mesh(hubMarkerGeo, hubMat);
    hubMesh.position.copy(pos);
    globeGroup.add(hubMesh);

    // Outer pulsing target ring
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00D4FF,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(hubRingGeo, ringMat);
    ringMesh.position.copy(pos);
    ringMesh.lookAt(globeGroup.position);
    globeGroup.add(ringMesh);

    hubObjects.push({ mesh: hubMesh, ring: ringMesh, baseScale: 1 });
  });

  // Great-Circle 3D Connection Arcs
  const arcRoutes = [
    ['HYD', 'LON'],
    ['LON', 'NYC'],
    ['NYC', 'TYO'],
    ['TYO', 'SIN'],
    ['SIN', 'HYD'],
    ['LON', 'FRA']
  ];

  const arcMeshes = [];
  const pulseBeads = [];

  const beadGeo = new THREE.SphereGeometry(0.22, 8, 8);
  const beadMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.95
  });

  arcRoutes.forEach(([srcName, dstName], idx) => {
    const srcHub = hubs.find(h => h.name === srcName);
    const dstHub = hubs.find(h => h.name === dstName);
    if (!srcHub || !dstHub) return;

    const p1 = latLonToVector3(srcHub.lat, srcHub.lon, globeRadius * 1.02);
    const p2 = latLonToVector3(dstHub.lat, dstHub.lon, globeRadius * 1.02);

    // Calculate elevated midpoint for 3D curved trajectory
    const distance = p1.distanceTo(p2);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const elevatedRadius = Math.max(globeRadius * 1.18, mid.length() + distance * 0.22);
    mid.normalize().multiplyScalar(elevatedRadius);

    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    const points = curve.getPoints(40);
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

    const curveMat = new THREE.LineBasicMaterial({
      color: idx % 2 === 0 ? 0x00D4FF : 0x6865F2,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending
    });

    const curveLine = new THREE.Line(curveGeo, curveMat);
    globeGroup.add(curveLine);
    arcMeshes.push(curveLine);

    // Add traveling pulse bead along the route
    const bead = new THREE.Mesh(beadGeo, beadMat);
    globeGroup.add(bead);
    pulseBeads.push({ mesh: bead, curve, speed: 0.15 + (idx * 0.03), offset: (idx * 0.18) % 1 });
  });

  // -------------------------------------------------------------------------
  // 6. CONCENTRIC COUNTER-ROTATING ORBITAL RINGS
  // -------------------------------------------------------------------------
  const ringGroup = new THREE.Group();
  globeGroup.add(ringGroup);

  function createOrbitalRing(radius, tubeRadius, color, rotX, rotY, opacity) {
    const ringGeo = new THREE.TorusGeometry(radius, tubeRadius, 6, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      wireframe: true
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = rotX;
    ring.rotation.y = rotY;
    return ring;
  }

  const ring1 = createOrbitalRing(globeRadius * 1.35, 0.038, 0x00D4FF, Math.PI / 3, Math.PI / 6, 0.35);
  const ring2 = createOrbitalRing(globeRadius * 1.55, 0.028, 0x6865F2, -Math.PI / 4, Math.PI / 4, 0.28);
  const ring3 = createOrbitalRing(globeRadius * 1.75, 0.022, 0xC8D0DC, Math.PI / 2.2, 0, 0.2);

  ringGroup.add(ring1);
  ringGroup.add(ring2);
  ringGroup.add(ring3);

  // -------------------------------------------------------------------------
  // 7. HIGH-SPECULAR METALLIC PBR OBJECTS (FINTECH ARTIFACTS)
  // -------------------------------------------------------------------------
  const metallicObjects = [];

  if (!isMobile) {
    // Physical Platinum Material
    const platinumMat = new THREE.MeshStandardMaterial({
      color: 0xC8D0DC,
      metalness: 0.95,
      roughness: 0.16
    });

    // Electric Cyan Chrome Material
    const cyanChromeMat = new THREE.MeshStandardMaterial({
      color: 0x075985,
      emissive: 0x00D4FF,
      emissiveIntensity: 0.18,
      metalness: 0.92,
      roughness: 0.20
    });

    // Royal Indigo Material
    const indigoChromeMat = new THREE.MeshStandardMaterial({
      color: 0x2A2775,
      emissive: 0x6865F2,
      emissiveIntensity: 0.22,
      metalness: 0.88,
      roughness: 0.24
    });

    const metallicConfigs = [
      { geo: new THREE.OctahedronGeometry(2.4, 0), mat: platinumMat, pos: [-16, 8, -6], rot: [0.005, 0.007, 0.003] },
      { geo: new THREE.IcosahedronGeometry(2.2, 0), mat: cyanChromeMat, pos: [19, -8, -8], rot: [0.004, 0.005, 0.006] },
      { geo: new THREE.TorusGeometry(2.8, 0.38, 12, 32), mat: indigoChromeMat, pos: [-14, -9, -10], rot: [0.003, 0.004, 0.002] },
      { geo: new THREE.BoxGeometry(2.0, 2.0, 2.0), mat: platinumMat, pos: [17, 11, -12], rot: [0.004, 0.003, 0.005] }
    ];

    metallicConfigs.forEach((cfg) => {
      const mesh = new THREE.Mesh(cfg.geo, cfg.mat);
      mesh.position.set(...cfg.pos);
      mesh.userData = {
        rotSpeed: cfg.rot,
        baseY: cfg.pos[1],
        baseX: cfg.pos[0]
      };

      // Subtle cyan wireframe overlay
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x00D4FF,
        wireframe: true,
        transparent: true,
        opacity: 0.18
      });
      const wireMesh = new THREE.Mesh(cfg.geo, wireMat);
      mesh.add(wireMesh);

      scene.add(mesh);
      metallicObjects.push(mesh);
    });
  }

  // -------------------------------------------------------------------------
  // 8. MULTI-DEPTH AMBIENT DATA PARTICLES & NEBULA
  // -------------------------------------------------------------------------
  const bgParticleCount = isMobile ? 450 : 1300;
  const bgPositions = new Float32Array(bgParticleCount * 3);
  const bgColors = new Float32Array(bgParticleCount * 3);

  for (let i = 0; i < bgParticleCount; i++) {
    bgPositions[i * 3]     = (Math.random() - 0.5) * 120;
    bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 90;
    bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 70;

    const r = Math.random();
    const c = r > 0.65 ? colCyan : r > 0.3 ? colIndigo : colIce;
    bgColors[i * 3]     = c.r;
    bgColors[i * 3 + 1] = c.g;
    bgColors[i * 3 + 2] = c.b;
  }

  const bgParticleGeo = new THREE.BufferGeometry();
  bgParticleGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
  bgParticleGeo.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));

  const bgParticleMat = new THREE.PointsMaterial({
    size: 0.10,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const bgParticles = new THREE.Points(bgParticleGeo, bgParticleMat);
  scene.add(bgParticles);

  // -------------------------------------------------------------------------
  // 9. ANIMATION LOOP & SMOOTH INTERACTIVITY
  // -------------------------------------------------------------------------
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;
  let scrollY = 0;
  let currentScrollY = 0;

  const clock = new THREE.Clock();
  let animationFrameId = null;
  let isVisible = true;

  // Pause when off-screen/tab hidden to conserve CPU/GPU
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    if (!isVisible) return;

    const elapsed = clock.getElapsedTime();

    // Smooth Lerp Mouse values
    currentMouseX += (targetMouseX - currentMouseX) * 0.045;
    currentMouseY += (targetMouseY - currentMouseY) * 0.045;
    currentScrollY += (scrollY - currentScrollY) * 0.05;

    // Rotate Globe
    globeGroup.rotation.y = elapsed * 0.065 + currentMouseX * 0.16;
    globeGroup.rotation.x = currentMouseY * 0.1 + (currentScrollY * 0.0003);

    // Pulse Financial Hubs
    hubObjects.forEach((h, i) => {
      const pulse = 1 + Math.sin(elapsed * 3 + i) * 0.25;
      h.ring.scale.set(pulse, pulse, pulse);
    });

    // Animate Traveling Light Pulses along Great Circle Arcs
    pulseBeads.forEach((p) => {
      const t = (elapsed * p.speed + p.offset) % 1.0;
      const pt = p.curve.getPoint(t);
      p.mesh.position.copy(pt);
    });

    // Counter-rotate Orbital Rings
    ring1.rotation.z = elapsed * 0.11;
    ring2.rotation.z = -elapsed * 0.085;
    ring3.rotation.z = elapsed * 0.065;

    // Animate Floating Metallic Objects
    metallicObjects.forEach((obj, idx) => {
      const rs = obj.userData.rotSpeed;
      obj.rotation.x += rs[0];
      obj.rotation.y += rs[1];
      obj.rotation.z += rs[2];

      obj.position.y = obj.userData.baseY + Math.sin(elapsed * 0.8 + idx * 1.5) * 1.8;
      obj.position.x = obj.userData.baseX + Math.cos(elapsed * 0.5 + idx) * 0.9;
    });

    // Slow ambient drift of background particles
    bgParticles.rotation.y = elapsed * 0.012 + currentMouseX * 0.04;

    // Dynamic Horizon Grid shift with scroll
    gridHelper.position.z = (currentScrollY * 0.008) % 4 - 4;

    // Camera parallax and scroll depth easing
    camera.position.x += (currentMouseX * 2.2 - camera.position.x) * 0.03;
    camera.position.y += (1.2 - currentMouseY * 1.8 - (currentScrollY * 0.006) - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // -------------------------------------------------------------------------
  // 10. RESIZE & TEARDOWN
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
    globeCoreGeo.dispose();
    globeCoreMat.dispose();
    globeNodesGeo.dispose();
    globeNodesMat.dispose();
    innerGlowGeo.dispose();
    innerGlowMat.dispose();
    hubMarkerGeo.dispose();
    hubRingGeo.dispose();
    beadGeo.dispose();
    beadMat.dispose();
    bgParticleGeo.dispose();
    bgParticleMat.dispose();
    metallicObjects.forEach((m) => {
      m.geometry.dispose();
      m.material.dispose();
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
