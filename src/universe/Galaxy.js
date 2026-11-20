import * as THREE from 'three';

/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * Galaxy: Procedural Logarithmic Spiral Galaxy & Accretion Disk
 */

export class Galaxy {
  constructor(scene, starCount = 8000) {
    this.scene = scene;
    this.group = new THREE.Group();
    // Tilt slightly for dramatic Interstellar cinematic angle
    this.group.rotation.x = Math.PI / 4.2;
    this.group.rotation.z = -Math.PI / 8;
    this.scene.add(this.group);

    this.starCount = starCount;
    this.arms = 4;
    this.radius = 55;
    this.spin = 1.25;
    this.randomness = 0.45;

    this.initSpiralGalaxy();
    this.initAccretionCore();
  }

  initSpiralGalaxy() {
    const positions = new Float32Array(this.starCount * 3);
    const colors = new Float32Array(this.starCount * 3);

    const colCore = new THREE.Color(0xFFFFFF);     // Hot white center
    const colCyan = new THREE.Color(0x00D4FF);     // Electric cyan arms
    const colIndigo = new THREE.Color(0x6865F2);   // Royal indigo fringe
    const colGold = new THREE.Color(0xF59E0B);     // Financial gold clusters

    for (let i = 0; i < this.starCount; i++) {
      // Distance from center with power curve for core density
      const r = Math.pow(Math.random(), 2.2) * this.radius;
      const armAngle = ((i % this.arms) * (Math.PI * 2)) / this.arms;
      const spinAngle = r * this.spin * 0.08;

      const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * this.randomness * r);
      const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * this.randomness * (r * 0.35));
      const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * this.randomness * r);

      positions[i * 3]     = Math.cos(armAngle + spinAngle) * r + randomX;
      positions[i * 3 + 1] = randomY;
      positions[i * 3 + 2] = Math.sin(armAngle + spinAngle) * r + randomZ;

      // Color interpolation: Core -> Gold/Cyan -> Indigo
      let mixedColor;
      const normRadius = r / this.radius;
      if (normRadius < 0.15) {
        mixedColor = colCore.clone().lerp(colGold, normRadius / 0.15);
      } else if (normRadius < 0.55) {
        mixedColor = colGold.clone().lerp(colCyan, (normRadius - 0.15) / 0.4);
      } else {
        mixedColor = colCyan.clone().lerp(colIndigo, (normRadius - 0.55) / 0.45);
      }

      colors[i * 3]     = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(geo, mat);
    this.group.add(this.points);
  }

  initAccretionCore() {
    // Interstellar Black-Hole Accretion Glow Ring
    const torusGeo = new THREE.TorusGeometry(3.8, 0.45, 16, 80);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x00D4FF,
      transparent: true,
      opacity: 0.65,
      wireframe: true
    });
    this.accretionDisk = new THREE.Mesh(torusGeo, torusMat);
    this.accretionDisk.rotation.x = Math.PI / 2;
    this.group.add(this.accretionDisk);

    // Event Horizon Core Shadow
    const coreGeo = new THREE.SphereGeometry(2.4, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x05070D });
    this.coreSphere = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.coreSphere);
  }

  update(elapsed) {
    // Slow majestic celestial rotation
    this.group.rotation.y = elapsed * 0.025;
    if (this.accretionDisk) {
      this.accretionDisk.rotation.z = -elapsed * 0.15;
    }
  }

  setOpacity(val) {
    if (this.points) this.points.material.opacity = val;
    if (this.accretionDisk) this.accretionDisk.material.opacity = val * 0.65;
  }
}

export default Galaxy;
