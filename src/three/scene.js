import * as THREE from 'three';

/**
 * SHEIK AMEEN PORTFOLIO — THREE.JS 3D HERO ENVIRONMENT
 * Premium Financial Technology Aesthetics · Dark Futuristic
 */

export function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return null;

  // Device detection
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  
  // Particle configuration
  const particleCount = isMobile ? 600 : isTablet ? 1200 : 2200;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 28;

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
  // 1. PARTICLE SYSTEM (FINANCIAL DATA GRID / NODES)
  // -------------------------------------------------------------------------
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  const cyan = new THREE.Color(0x00D4FF);
  const indigo = new THREE.Color(0x6366F1);
  const white = new THREE.Color(0xF8FAFC);

  for (let i = 0; i < particleCount; i++) {
    // Spread in a large 3D volume
    positions[i * 3]     = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

    // Gradient mix between cyan and indigo
    const mixed = Math.random();
    const c = mixed > 0.6 ? cyan : mixed > 0.15 ? indigo : white;
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    scales[i] = Math.random() * 0.8 + 0.3;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.14 : 0.11,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // -------------------------------------------------------------------------
  // 2. FLOATING GEOMETRIC STRUCTURES (WIRE FRAME CUBES & ICOSAHEDRONS)
  // -------------------------------------------------------------------------
  const shapes = [];
  if (!isMobile) {
    const wireframeConfigs = [
      {
        geo: new THREE.IcosahedronGeometry(3.5, 0),
        pos: [14, 6, -10],
        rot: [0.003, 0.005, 0.002],
        color: 0x00D4FF,
        opacity: 0.22
      },
      {
        geo: new THREE.OctahedronGeometry(2.8, 0),
        pos: [-16, -5, -8],
        rot: [0.004, 0.003, 0.005],
        color: 0x6366F1,
        opacity: 0.20
      },
      {
        geo: new THREE.TorusGeometry(3.2, 0.35, 8, 24),
        pos: [16, -8, -14],
        rot: [0.002, 0.006, 0.001],
        color: 0x00D4FF,
        opacity: 0.16
      },
      {
        geo: new THREE.TorusGeometry(2.2, 0.25, 6, 18),
        pos: [-12, 10, -12],
        rot: [0.005, 0.002, 0.004],
        color: 0x6366F1,
        opacity: 0.18
      },
      {
        geo: new THREE.BoxGeometry(2.5, 2.5, 2.5),
        pos: [4, 12, -16],
        rot: [0.003, 0.004, 0.002],
        color: 0x00D4FF,
        opacity: 0.15
      }
    ];

    wireframeConfigs.forEach((cfg) => {
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
        initialY: cfg.pos[1],
        initialX: cfg.pos[0]
      };
      scene.add(mesh);
      shapes.push(mesh);
    });
  }

  // -------------------------------------------------------------------------
  // 3. LIGHTING (ATMOSPHERIC GLOWS)
  // -------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0x070A12, 1.2);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00D4FF, 2.5, 100);
  cyanLight.position.set(15, 15, 15);
  scene.add(cyanLight);

  const indigoLight = new THREE.PointLight(0x6366F1, 2.0, 80);
  indigoLight.position.set(-15, -10, 10);
  scene.add(indigoLight);

  // -------------------------------------------------------------------------
  // 4. MOUSE TRACKING & PARALLAX LERP
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
    currentMouseX += (targetMouseX - currentMouseX) * 0.04;
    currentMouseY += (targetMouseY - currentMouseY) * 0.04;

    // Rotate particle system slowly
    particles.rotation.y = elapsed * 0.025 + currentMouseX * 0.12;
    particles.rotation.x = elapsed * 0.012 + currentMouseY * 0.08;

    // Animate floating wireframes
    shapes.forEach((shape, idx) => {
      const rs = shape.userData.rotSpeed;
      shape.rotation.x += rs[0];
      shape.rotation.y += rs[1];
      shape.rotation.z += rs[2];

      // Subtle sinusoidal float
      shape.position.y = shape.userData.initialY + Math.sin(elapsed * 0.6 + idx * 1.5) * 1.6;
      shape.position.x = shape.userData.initialX + Math.cos(elapsed * 0.4 + idx) * 0.8;
    });

    // Subtle camera tilt
    camera.position.x += (currentMouseX * 2.2 - camera.position.x) * 0.03;
    camera.position.y += (-currentMouseY * 1.8 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // -------------------------------------------------------------------------
  // 5. RESIZE LISTENER
  // -------------------------------------------------------------------------
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  window.addEventListener('resize', handleResize);

  // -------------------------------------------------------------------------
  // 6. TEARDOWN & API
  // -------------------------------------------------------------------------
  function destroy() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
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
