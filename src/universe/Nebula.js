import * as THREE from 'three';

/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * Nebula: Multi-octave cosmic dust & volumetric shader plane
 */

export class Nebula {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.initNebulaClouds();
  }

  initNebulaClouds() {
    // Multi-depth layered billowed planes with radial gradients
    const count = 4;
    const colors = [0x00D4FF, 0x6865F2, 0x0F172A, 0x1E1B4B];

    for (let i = 0; i < count; i++) {
      const geo = new THREE.PlaneGeometry(80, 60);
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.08 + i * 0.02,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (i - 1.5) * 14,
        (i - 1.5) * 6,
        -25 - i * 8
      );
      mesh.rotation.z = i * 0.45;
      this.group.add(mesh);
    }
  }

  update(elapsed) {
    this.group.rotation.z = Math.sin(elapsed * 0.05) * 0.04;
  }
}

export default Nebula;
