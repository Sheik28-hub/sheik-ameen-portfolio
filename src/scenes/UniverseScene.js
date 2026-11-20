import * as THREE from 'three';
import Fireball from '../universe/Fireball.js';
import Galaxy from '../universe/Galaxy.js';
import Nebula from '../universe/Nebula.js';

/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * UniverseScene: Cosmic Fireball Shockwave, Procedural Spiral Galaxy, 
 * Volumetric Nebula & Signature Financial Point-Cloud Globe
 */

export class UniverseScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.fireball = new Fireball(scene);
    this.galaxy = new Galaxy(scene, 9000);
    this.nebula = new Nebula(scene);

    // Initial state: galaxy is faint until fireball triggers universe creation
    this.galaxy.setOpacity(0.2);

    this.initFinancialGlobe();
  }

  initFinancialGlobe() {
    this.globeGroup = new THREE.Group();
    this.group.add(this.globeGroup);

    const isMobile = window.innerWidth < 768;
    const globeOffsetX = isMobile ? 0 : 10.5;
    const globeOffsetY = isMobile ? -2.2 : 1.2;
    this.globeGroup.position.set(globeOffsetX, globeOffsetY, -10);

    const globeRadius = isMobile ? 7.2 : 10.2;
    const globeSegments = isMobile ? 24 : 36;

    // 1. Wireframe core
    const coreGeo = new THREE.SphereGeometry(globeRadius, globeSegments, globeSegments);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00D4FF,
      wireframe: true,
      transparent: true,
      opacity: 0.06
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.globeGroup.add(coreMesh);

    // 2. Fibonacci surface point cloud
    const nodeCount = isMobile ? 360 : 750;
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    const colCyan = new THREE.Color(0x00D4FF);
    const colIce = new THREE.Color(0xC8D0DC);
    const colIndigo = new THREE.Color(0x6865F2);

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const r = globeRadius * (1 + Math.random() * 0.03);

      positions[i * 3]     = r * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const pick = Math.random();
      const c = pick > 0.55 ? colCyan : pick > 0.2 ? colIndigo : colIce;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nodesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const nodesMat = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    this.globeGroup.add(this.nodesMesh);

    // 3. Financial Hubs (NYC, LON, FRA, TYO, SIN, HYD)
    this.hubs = [
      { name: 'NYC', lat: 40.71, lon: -74.00 },
      { name: 'LON', lat: 51.50, lon: -0.12 },
      { name: 'FRA', lat: 50.11, lon: 8.68 },
      { name: 'TYO', lat: 35.68, lon: 139.69 },
      { name: 'SIN', lat: 1.35, lon: 103.82 },
      { name: 'HYD', lat: 17.38, lon: 78.48 }
    ];

    this.hubObjects = [];
    const markerGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const ringGeo = new THREE.RingGeometry(0.28, 0.45, 16);

    const latLonToVec = (lat, lon, rad) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(rad * Math.sin(phi) * Math.cos(theta));
      const z = rad * Math.sin(phi) * Math.sin(theta);
      const y = rad * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    this.hubs.forEach((h) => {
      const pos = latLonToVec(h.lat, h.lon, globeRadius * 1.02);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00D4FF, transparent: true, opacity: 0.95 });
      const mesh = new THREE.Mesh(markerGeo, mat);
      mesh.position.copy(pos);
      this.globeGroup.add(mesh);

      const rMat = new THREE.MeshBasicMaterial({ color: 0x00D4FF, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
      const rMesh = new THREE.Mesh(ringGeo, rMat);
      rMesh.position.copy(pos);
      rMesh.lookAt(this.globeGroup.position);
      this.globeGroup.add(rMesh);

      this.hubObjects.push({ mesh, ring: rMesh });
    });
  }

  /**
   * Erupt the Fireball & expand the universe
   */
  triggerCosmicEvent(onComplete = null) {
    console.info('[UniverseScene] Triggering Cosmic Event: Fireball & Shockwave.');
    this.fireball.trigger(4.5, () => {
      // Fade galaxy into full brilliance
      const startTime = performance.now();
      const fadeGalaxy = (now) => {
        const progress = Math.min(1.0, (now - startTime) / 3000);
        this.galaxy.setOpacity(0.2 + progress * 0.8);
        if (progress < 1.0) {
          requestAnimationFrame(fadeGalaxy);
        } else {
          if (onComplete) onComplete();
        }
      };
      requestAnimationFrame(fadeGalaxy);
    });
  }

  update(elapsed) {
    if (this.fireball) this.fireball.update(elapsed);
    if (this.galaxy) this.galaxy.update(elapsed);
    if (this.nebula) this.nebula.update(elapsed);

    // Rotate financial point-cloud globe
    if (this.globeGroup) {
      this.globeGroup.rotation.y = elapsed * 0.055;
    }

    // Pulse financial hubs
    if (this.hubObjects) {
      this.hubObjects.forEach((h, i) => {
        const pulse = 1 + Math.sin(elapsed * 3 + i) * 0.25;
        h.ring.scale.set(pulse, pulse, pulse);
      });
    }
  }
}

export default UniverseScene;
