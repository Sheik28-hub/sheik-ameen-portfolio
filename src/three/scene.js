import * as THREE from 'three';

/**
 * SHEIK AMEEN — 3D FINANCIAL ENVIRONMENT
 * Pillar 2: Hero Globe, Metallic Objects, Multi-Layer Particles & Orbital Rings
 */

export function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return null;

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  // Scene setup with exponential atmospheric fog
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070D, 0.02);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.5, 32);

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
  // 1. LIGHTING FOR METALLIC REFLECTIONS
  // -------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0x0F172A, 1.8);
  scene.add(ambientLight);

  // Key Light (Luminescent Cyan)
  const cyanKeyLight = new THREE.PointLight(0x00D4FF, 4.5, 120);
  cyanKeyLight.position.set(18, 16, 20);
  scene.add(cyanKeyLight);

  // Fill Light (Royal Indigo)
  const indigoFillLight = new THREE.PointLight(0x6366F1, 3.8, 100);
  indigoFillLight.position.set(-20, -12, 16);
  scene.add(indigoFillLight);

  // Rim Light (Ice White Specular)
  const rimLight = new THREE.DirectionalLight(0xE0F7FA, 1.5);
  rimLight.position.set(0, 25, -15);
  scene.add(rimLight);

  // -------------------------------------------------------------------------
  // 2. HERO GLOBAL FINANCIAL SPHERE (POINT CLOUD GLOBE)
  // -------------------------------------------------------------------------
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Shift globe slightly to the right on desktop for perfect balance with hero typography
  const globeOffsetX = isMobile ? 0 : 7.5;
  const globeOffsetY = isMobile ? -2 : 0.5;
  globeGroup.position.set(globeOffsetX, globeOffsetY, -2);

  const globeRadius = isMobile ? 7.5 : 10.5;
  const globeSegments = isMobile ? 24 : 40;

  // Wireframe Core Globe
  const globeCoreGeo = new THREE.SphereGeometry(globeRadius, globeSegments, globeSegments);
  const globeCoreMat = new THREE.MeshBasicMaterial({
    color: 0x00D4FF,
    wireframe: true,
    transparent: true,
    opacity: 0.07
  });
  const globeCoreMesh = new THREE.Mesh(globeCoreGeo, globeCoreMat);
  globeGroup.add(globeCoreMesh);

  // Dot Matrix Surface Nodes (representing global capital nodes)
  const nodeCount = isMobile ? 350 : 800;
  const nodePositions = new Float32Array(nodeCount * 3);
  const nodeColors = new Float32Array(nodeCount * 3);

  const colCyan = new THREE.Color(0x00D4FF);
  const colIce = new THREE.Color(0xE0F7FA);
  const colIndigo = new THREE.Color(0x6366F1);

  for (let i = 0; i < nodeCount; i++) {
    // Fibonacci sphere distribution for uniform financial node distribution
    const phi = Math.acos(-1 + (2 * i) / nodeCount);
    const theta = Math.sqrt(nodeCount * Math.PI) * phi;

    const r = globeRadius * (1 + (Math.random() * 0.04));
    nodePositions[i * 3]     = r * Math.cos(theta) * Math.sin(phi);
    nodePositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    nodePositions[i * 3 + 2] = r * Math.cos(phi);

    const pick = Math.random();
    const c = pick > 0.6 ? colCyan : pick > 0.25 ? colIndigo : colIce;
    nodeColors[i * 3]     = c.r;
    nodeColors[i * 3 + 1] = c.g;
    nodeColors[i * 3 + 2] = c.b;
  }

  const globeNodesGeo = new THREE.BufferGeometry();
  globeNodesGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
  globeNodesGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

  const globeNodesMat = new THREE.PointsMaterial({
    size: isMobile ? 0.2 : 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const globeNodes = new THREE.Points(globeNodesGeo, globeNodesMat);
  globeGroup.add(globeNodes);

  // -------------------------------------------------------------------------
  // 3. CONCENTRIC ORBITAL RINGS
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

  const ring1 = createOrbitalRing(globeRadius * 1.35, 0.04, 0x00D4FF, Math.PI / 3, Math.PI / 6, 0.35);
  const ring2 = createOrbitalRing(globeRadius * 1.55, 0.03, 0x6366F1, -Math.PI / 4, Math.PI / 4, 0.25);
  const ring3 = createOrbitalRing(globeRadius * 1.75, 0.02, 0xE0F7FA, Math.PI / 2.2, 0, 0.18);

  ringGroup.add(ring1);
  ringGroup.add(ring2);
  ringGroup.add(ring3);

  // -------------------------------------------------------------------------
  // 4. FLOATING METALLIC PBR OBJECTS (HIGH-SPECULAR FINTECH ARTIFACTS)
  // -------------------------------------------------------------------------
  const metallicObjects = [];

  if (!isMobile) {
    // Metallic Shader Material with physical sheen
    const platinumMat = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      metalness: 0.95,
      roughness: 0.18,
      wireframe: false
    });

    const cyanChromeMat = new THREE.MeshStandardMaterial({
      color: 0x075985,
      emissive: 0x00D4FF,
      emissiveIntensity: 0.15,
      metalness: 0.9,
      roughness: 0.22,
      wireframe: false
    });

    const indigoChromeMat = new THREE.MeshStandardMaterial({
      color: 0x312E81,
      emissive: 0x6366F1,
      emissiveIntensity: 0.2,
      metalness: 0.88,
      roughness: 0.25
    });

    const metallicConfigs = [
      { geo: new THREE.OctahedronGeometry(2.4, 0), mat: platinumMat, pos: [-16, 8, -6], rot: [0.005, 0.007, 0.003] },
      { geo: new THREE.IcosahedronGeometry(2.2, 0), mat: cyanChromeMat, pos: [19, -8, -8], rot: [0.004, 0.005, 0.006] },
      { geo: new THREE.TorusGeometry(2.8, 0.4, 12, 32), mat: indigoChromeMat, pos: [-14, -9, -10], rot: [0.003, 0.004, 0.002] },
      { geo: new THREE.BoxGeometry(2.2, 2.2, 2.2), mat: platinumMat, pos: [17, 11, -12], rot: [0.004, 0.003, 0.005] }
    ];

    metallicConfigs.forEach((cfg) => {
      const mesh = new THREE.Mesh(cfg.geo, cfg.mat);
      mesh.position.set(...cfg.pos);
      mesh.userData = {
        rotSpeed: cfg.rot,
        baseY: cfg.pos[1],
        baseX: cfg.pos[0]
      };

      // Add a fine wireframe accent overlay on each metallic object
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x00D4FF,
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });
      const wireOverlay = new THREE.Mesh(cfg.geo, wireMat);
      mesh.add(wireOverlay);

      scene.add(mesh);
      metallicObjects.push(mesh);
    });
  }

  // -------------------------------------------------------------------------
  // 5. MULTI-LAYER AMBIENT PARTICLE FIELD
  // -------------------------------------------------------------------------
  const bgParticleCount = isMobile ? 400 : 1200;
  const bgPositions = new Float32Array(bgParticleCount * 3);
  const bgColors = new Float32Array(bgParticleCount * 3);

  for (let i = 0; i < bgParticleCount; i++) {
    bgPositions[i * 3]     = (Math.random() - 0.5) * 110;
    bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;

    const r = Math.random();
    const c = r > 0.7 ? colCyan : r > 0.3 ? colIndigo : colIce;
    bgColors[i * 3]     = c.r;
    bgColors[i * 3 + 1] = c.g;
    bgColors[i * 3 + 2] = c.b;
  }

  const bgParticleGeo = new THREE.BufferGeometry();
  bgParticleGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
  bgParticleGeo.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));

  const bgParticleMat = new THREE.PointsMaterial({
    size: 0.09,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const bgParticles = new THREE.Points(bgParticleGeo, bgParticleMat);
  scene.add(bgParticles);

  // -------------------------------------------------------------------------
  // 6. ANIMATION LOOP & MOUSE TRACKING
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

    // Lerp smooth mouse values
    currentMouseX += (targetMouseX - currentMouseX) * 0.045;
    currentMouseY += (targetMouseY - currentMouseY) * 0.045;

    // Rotate Globe
    globeGroup.rotation.y = elapsed * 0.06 + currentMouseX * 0.15;
    globeGroup.rotation.x = currentMouseY * 0.1;

    // Counter-rotate Orbital Rings
    ring1.rotation.z = elapsed * 0.12;
    ring2.rotation.z = -elapsed * 0.09;
    ring3.rotation.z = elapsed * 0.07;

    // Animate Metallic Objects
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

    // Camera micro-movement
    camera.position.x += (currentMouseX * 2.2 - camera.position.x) * 0.03;
    camera.position.y += (1.5 - currentMouseY * 1.8 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // -------------------------------------------------------------------------
  // 7. RESIZE & TEARDOWN
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
