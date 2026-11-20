import * as THREE from 'three';
import gsap from 'gsap';

/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * IdentityScene: 3D Falling Typography, Avatar Arrival & Synchronized Speech
 */

export class IdentityScene {
  constructor(scene, avatarController) {
    this.scene = scene;
    this.avatar = avatarController;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.letters = [];
    this.isFalling = false;
    this.speechPlayed = false;

    this.initFallingLetters();
  }

  initFallingLetters() {
    // 3D Block Letter meshes representing S H E I K   A M E E N
    const nameStr = "SHEIK AMEEN";
    const letterWidth = 1.35;
    const startX = -((nameStr.length * letterWidth) / 2);

    const matWhite = new THREE.MeshStandardMaterial({
      color: 0xF8FAFC,
      metalness: 0.85,
      roughness: 0.2
    });

    const matCyan = new THREE.MeshStandardMaterial({
      color: 0x00D4FF,
      emissive: 0x00D4FF,
      emissiveIntensity: 0.25,
      metalness: 0.9,
      roughness: 0.15
    });

    for (let i = 0; i < nameStr.length; i++) {
      const char = nameStr[i];
      if (char === ' ') continue;

      const isAmeen = i >= 6;
      const boxGeo = new THREE.BoxGeometry(1.0, 1.25, 0.4);
      const mesh = new THREE.Mesh(boxGeo, isAmeen ? matCyan : matWhite);

      const targetX = startX + i * letterWidth;
      const targetY = 1.5;
      const targetZ = 8.0;

      // Start position high above camera
      mesh.position.set(
        targetX + (Math.random() - 0.5) * 4,
        28 + Math.random() * 8,
        targetZ + (Math.random() - 0.5) * 4
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.userData = {
        targetX,
        targetY,
        targetZ,
        index: i,
        char
      };

      this.group.add(mesh);
      this.letters.push(mesh);
    }
  }

  /**
   * Launch 3D Falling Typography Sequence
   */
  triggerFallingName(duration = 3.0, onComplete = null) {
    this.isFalling = true;

    this.letters.forEach((mesh, idx) => {
      gsap.to(mesh.position, {
        x: mesh.userData.targetX,
        y: mesh.userData.targetY,
        z: mesh.userData.targetZ,
        duration: duration * 0.75,
        delay: idx * 0.08,
        ease: "bounce.out"
      });

      gsap.to(mesh.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: duration * 0.65,
        delay: idx * 0.08,
        ease: "power2.out"
      });
    });

    // After letters land, transition letters forward or fade softly into hero UI
    setTimeout(() => {
      this.letters.forEach((mesh) => {
        gsap.to(mesh.position, {
          y: mesh.userData.targetY - 10,
          opacity: 0,
          duration: 1.2,
          ease: "power2.in"
        });
      });
      if (onComplete) onComplete();
    }, (duration + 1.2) * 1000);
  }

  update(elapsed) {
    // Subtle float if resting
    if (!this.isFalling) {
      this.letters.forEach((mesh, idx) => {
        mesh.position.y += Math.sin(elapsed * 2.0 + idx) * 0.005;
      });
    }
  }

  dispose() {
    this.letters.forEach((m) => {
      m.geometry.dispose();
      m.material.dispose();
    });
    this.scene.remove(this.group);
  }
}

export default IdentityScene;
