import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import LipSyncController from './LipSyncController.js';

/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * AvatarController: Hybrid miniature character manager
 * 
 * Features:
 * - Loads external rigged GLB model (`public/assets/models/ameen-avatar.glb`)
 * - High-detail procedural executive figurine fallback
 * - Rigged landing animation (descent from space with physics impact)
 * - Idle breathing, subtle conversational head gestures, periodic eye blinking
 * - Real-time lip-sync mouth morphing via LipSyncController
 * - 360-degree rotation synchronization
 */

export class AvatarController {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    // Default resting position
    this.group.position.set(0, -6, 0);
    this.scene.add(this.group);

    this.lipSync = new LipSyncController();

    this.avatarMesh = null;
    this.podiumGroup = null;
    this.headGroup = null;
    this.bodyGroup = null;
    this.leftEye = null;
    this.rightEye = null;
    this.mouthMesh = null;
    this.jawMorphTarget = null;

    this.isGlbLoaded = false;
    this.isLanding = false;
    this.landingProgress = 1.0; // 1.0 = landed

    // Blinking timer
    this.blinkTimer = 0;
    this.nextBlink = 3.2;

    this.initPodium();
    this.loadCharacter();
  }

  /**
   * Illuminated Cyber-Podium Platform
   */
  initPodium() {
    this.podiumGroup = new THREE.Group();
    this.group.add(this.podiumGroup);

    // 1. Dark graphite metallic base
    const baseGeo = new THREE.CylinderGeometry(4.2, 4.6, 0.6, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0D1422,
      metalness: 0.92,
      roughness: 0.2
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.3;
    this.podiumGroup.add(baseMesh);

    // 2. Neon Cyan Rim
    const neonRimGeo = new THREE.TorusGeometry(4.24, 0.07, 16, 64);
    const neonRimMat = new THREE.MeshBasicMaterial({
      color: 0x00D4FF,
      transparent: true,
      opacity: 0.95
    });
    const neonRim = new THREE.Mesh(neonRimGeo, neonRimMat);
    neonRim.rotation.x = Math.PI / 2;
    neonRim.position.y = 0.01;
    this.podiumGroup.add(neonRim);

    // 3. Frosted Glass Inner Floor
    const glassGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.08, 40);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x141D2B,
      metalness: 0.85,
      roughness: 0.18,
      transparent: true,
      opacity: 0.88
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = 0.05;
    this.podiumGroup.add(glassMesh);

    // 4. Concentric coordinate alignment rings
    const ringGeo = new THREE.RingGeometry(2.4, 2.45, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00D4FF,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.1;
    this.podiumGroup.add(ringMesh);
  }

  /**
   * Load external GLB or fall back cleanly to procedural figurine
   */
  loadCharacter() {
    const loader = new GLTFLoader();
    loader.load(
      './assets/models/ameen-avatar.glb',
      (gltf) => {
        console.info('[AvatarController] Loaded hybrid avatar GLB asset.');
        this.isGlbLoaded = true;
        if (this.avatarMesh) {
          this.group.remove(this.avatarMesh);
        }
        this.avatarMesh = gltf.scene;
        this.avatarMesh.scale.set(4.2, 4.2, 4.2);
        this.avatarMesh.position.set(0, 0.1, 0);

        // Check for blendshapes / morph targets on head mesh
        this.avatarMesh.traverse((child) => {
          if (child.isMesh && child.morphTargetDictionary) {
            console.log('[AvatarController] Morph targets detected:', Object.keys(child.morphTargetDictionary));
          }
        });

        this.group.add(this.avatarMesh);
      },
      undefined,
      () => {
        // Fallback cleanly to high-detail procedural figurine
        this.buildProceduralFigurine();
      }
    );
  }

  /**
   * High-Fidelity Procedural Figurine
   */
  buildProceduralFigurine() {
    const figure = new THREE.Group();
    this.group.add(figure);
    this.avatarMesh = figure;

    this.bodyGroup = new THREE.Group();
    figure.add(this.bodyGroup);

    // Materials
    const suitMat = new THREE.MeshStandardMaterial({
      color: 0x0B1220, // Midnight navy executive suit
      metalness: 0.35,
      roughness: 0.6
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xF8FAFC, // Crisp white shirt
      metalness: 0.1,
      roughness: 0.4
    });

    const tieMat = new THREE.MeshStandardMaterial({
      color: 0x00D4FF, // Signature electric cyan tie
      emissive: 0x00D4FF,
      emissiveIntensity: 0.16,
      metalness: 0.65,
      roughness: 0.3
    });

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0x8D5524, // Warm South Asian tone
      metalness: 0.08,
      roughness: 0.72
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x111111, // Dark styled executive hair
      roughness: 0.9
    });

    // Legs & Shoes
    const legGeo = new THREE.CylinderGeometry(0.38, 0.42, 4.4, 16);
    const leftLeg = new THREE.Mesh(legGeo, suitMat);
    leftLeg.position.set(-0.6, 2.2, 0);
    this.bodyGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, suitMat);
    rightLeg.position.set(0.6, 2.2, 0);
    this.bodyGroup.add(rightLeg);

    const shoeGeo = new THREE.BoxGeometry(0.85, 0.45, 1.4);
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2, metalness: 0.8 });
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(-0.6, 0.25, 0.25);
    this.bodyGroup.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0.6, 0.25, 0.25);
    this.bodyGroup.add(rightShoe);

    // Torso & Tailored Suit Jacket
    const torsoGeo = new THREE.CylinderGeometry(1.4, 1.1, 4.2, 20);
    const torsoMesh = new THREE.Mesh(torsoGeo, suitMat);
    torsoMesh.position.y = 6.2;
    this.bodyGroup.add(torsoMesh);

    // Shirt & Cyan Tie
    const shirtGeo = new THREE.BoxGeometry(0.9, 2.8, 0.4);
    const shirtMesh = new THREE.Mesh(shirtGeo, shirtMat);
    shirtMesh.position.set(0, 6.7, 0.88);
    this.bodyGroup.add(shirtMesh);

    const tieGeo = new THREE.BoxGeometry(0.28, 2.4, 0.15);
    const tieMesh = new THREE.Mesh(tieGeo, tieMat);
    tieMesh.position.set(0, 6.6, 1.05);
    this.bodyGroup.add(tieMesh);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.34, 0.3, 3.6, 14);
    const leftArm = new THREE.Mesh(armGeo, suitMat);
    leftArm.position.set(-1.75, 6.2, 0);
    leftArm.rotation.z = 0.08;
    this.bodyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, suitMat);
    rightArm.position.set(1.75, 6.2, 0);
    rightArm.rotation.z = -0.08;
    this.bodyGroup.add(rightArm);

    // Hands
    const handGeo = new THREE.SphereGeometry(0.28, 12, 12);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(-1.9, 4.3, 0.1);
    this.bodyGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(1.9, 4.3, 0.1);
    this.bodyGroup.add(rightHand);

    // Head & Face Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 8.4, 0);
    figure.add(this.headGroup);

    const neckGeo = new THREE.CylinderGeometry(0.42, 0.48, 0.8, 16);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.y = -0.2;
    this.headGroup.add(neckMesh);

    const headGeo = new THREE.SphereGeometry(1.05, 24, 24);
    headGeo.scale(0.9, 1.15, 0.95);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.y = 0.8;
    this.headGroup.add(headMesh);

    const hairGeo = new THREE.SphereGeometry(1.1, 20, 20);
    hairGeo.scale(0.92, 1.12, 0.98);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.95, -0.08);
    this.headGroup.add(hairMesh);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.12, 10, 10);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1A1A1A });

    this.leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.leftEye.position.set(-0.35, 0.9, 0.88);
    this.headGroup.add(this.leftEye);

    this.rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.rightEye.position.set(0.35, 0.9, 0.88);
    this.headGroup.add(this.rightEye);

    // Mouth for Lip-Sync
    const mouthGeo = new THREE.BoxGeometry(0.36, 0.1, 0.08);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x5C2418 });
    this.mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    this.mouthMesh.position.set(0, 0.42, 0.92);
    this.headGroup.add(this.mouthMesh);
  }

  /**
   * Launch avatar descent from space onto the podium
   */
  triggerLanding(duration = 4.0, onComplete = null) {
    this.isLanding = true;
    this.landingProgress = 0;
    const startY = 32;
    const targetY = -6;

    this.group.position.y = startY;

    const startTime = performance.now();
    const animateLanding = (now) => {
      const elapsed = (now - startTime) / 1000;
      const t = Math.min(1.0, elapsed / duration);
      // Heavy kinetic deceleration (easeOutBounce or cubic)
      const ease = 1 - Math.pow(1 - t, 4);

      this.group.position.y = startY + (targetY - startY) * ease;
      this.landingProgress = t;

      // Subtle landing spin into place
      this.group.rotation.y = (1 - ease) * Math.PI * 2;

      if (t < 1.0) {
        requestAnimationFrame(animateLanding);
      } else {
        this.group.position.y = targetY;
        this.group.rotation.y = 0;
        this.isLanding = false;
        if (onComplete) onComplete();
      }
    };
    requestAnimationFrame(animateLanding);
  }

  /**
   * Main per-frame update loop
   */
  update(elapsed, carouselAngle = 0) {
    // 1. Slow ambient rotation of the podium
    if (this.podiumGroup) {
      this.podiumGroup.rotation.y = elapsed * 0.12;
    }

    // 2. Avatar tracks carousel rotation angle
    if (!this.isLanding) {
      this.group.rotation.y = -carouselAngle;
    }

    // 3. Idle breathing
    if (this.bodyGroup && !this.isLanding) {
      this.bodyGroup.position.y = Math.sin(elapsed * 2.2) * 0.05;
      this.bodyGroup.rotation.z = Math.sin(elapsed * 1.1) * 0.012;
    }

    // 4. Head gestures and periodic eye blinking
    if (this.headGroup) {
      const isSpeaking = this.lipSync.isSpeaking;
      const headTilt = Math.sin(elapsed * 1.4) * 0.035;
      const headNod = isSpeaking ? Math.sin(elapsed * 8) * 0.075 : Math.sin(elapsed * 1.8) * 0.025;
      this.headGroup.rotation.z = headTilt;
      this.headGroup.rotation.x = headNod;

      // Eye blinking
      this.blinkTimer += 0.016;
      if (this.blinkTimer > this.nextBlink && this.leftEye && this.rightEye) {
        this.leftEye.scale.y = 0.1;
        this.rightEye.scale.y = 0.1;
        if (this.blinkTimer > this.nextBlink + 0.12) {
          this.leftEye.scale.y = 1.0;
          this.rightEye.scale.y = 1.0;
          this.blinkTimer = 0;
          this.nextBlink = 2.5 + Math.random() * 3.5;
        }
      }
    }

    // 5. Lip-Sync mouth morphing
    const viseme = this.lipSync.update(elapsed);
    if (this.mouthMesh) {
      if (this.lipSync.isSpeaking) {
        this.mouthMesh.scale.y = 1.0 + viseme.open * 2.8;
        this.mouthMesh.scale.x = viseme.width;
      } else {
        this.mouthMesh.scale.set(1, 1, 1);
      }
    }
  }

  setSpeaking(speaking) {
    this.lipSync.setSpeaking(speaking);
  }

  setRotation(rad) {
    this.group.rotation.y = rad;
  }
}

export default AvatarController;
