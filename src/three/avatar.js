import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * SHEIK AMEEN — 3D EXECUTIVE AVATAR
 * 
 * Features:
 * - GLTF/GLB loader for external 3D model (looks for /assets/models/sheik-avatar.glb)
 * - High-detail procedural Executive Figurine fallback:
 *   - Luminous cylindrical podium with glowing cyan edge
 *   - Tailored business suit (midnight navy), white collar, electric cyan tie
 *   - Head with realistic proportions, hair, eyes with natural blinking
 *   - Animated mouth with lip-sync morphing during speech
 *   - Subtle conversational head nodding and breathing motion
 *   - 360-degree rotation support
 */

export function createExecutiveAvatar(scene) {
  const avatarGroup = new THREE.Group();
  avatarGroup.position.set(0, -6, 0);
  scene.add(avatarGroup);

  let avatarMesh = null;
  let mouthMesh = null;
  let leftEye = null;
  let rightEye = null;
  let headGroup = null;
  let bodyGroup = null;
  let isSpeaking = false;
  let isGlbLoaded = false;

  // -------------------------------------------------------------------------
  // 1. ILLUMINATED PODIUM / CYBER STAGE
  // -------------------------------------------------------------------------
  const podiumGroup = new THREE.Group();
  avatarGroup.add(podiumGroup);

  // Outer base cylinder
  const baseGeo = new THREE.CylinderGeometry(4.2, 4.6, 0.6, 40);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x0D1422,
    metalness: 0.9,
    roughness: 0.25
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = -0.3;
  podiumGroup.add(baseMesh);

  // Glowing cyan neon rim ring
  const neonRimGeo = new THREE.TorusGeometry(4.22, 0.06, 12, 48);
  const neonRimMat = new THREE.MeshBasicMaterial({
    color: 0x00D4FF,
    transparent: true,
    opacity: 0.9
  });
  const neonRim = new THREE.Mesh(neonRimGeo, neonRimMat);
  neonRim.rotation.x = Math.PI / 2;
  neonRim.position.y = 0.01;
  podiumGroup.add(neonRim);

  // Inner illuminated frosted glass platform
  const glassPlatformGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.08, 36);
  const glassPlatformMat = new THREE.MeshStandardMaterial({
    color: 0x141D2B,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.85
  });
  const glassPlatform = new THREE.Mesh(glassPlatformGeo, glassPlatformMat);
  glassPlatform.position.y = 0.05;
  podiumGroup.add(glassPlatform);

  // Decorative coordinate ring lines on podium
  const coordRingGeo = new THREE.RingGeometry(2.4, 2.45, 36);
  const coordRingMat = new THREE.MeshBasicMaterial({
    color: 0x00D4FF,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
  });
  const coordRing = new THREE.Mesh(coordRingGeo, coordRingMat);
  coordRing.rotation.x = -Math.PI / 2;
  coordRing.position.y = 0.1;
  podiumGroup.add(coordRing);

  // -------------------------------------------------------------------------
  // 2. PROCEDURAL EXECUTIVE FIGURINE (REALISTIC FALLBACK)
  // -------------------------------------------------------------------------
  function buildProceduralAvatar() {
    const figure = new THREE.Group();
    avatarGroup.add(figure);
    avatarMesh = figure;

    bodyGroup = new THREE.Group();
    figure.add(bodyGroup);

    // Common Materials
    const suitMat = new THREE.MeshStandardMaterial({
      color: 0x0B1220, // Midnight navy executive suit
      metalness: 0.3,
      roughness: 0.65
    });

    const lapelMat = new THREE.MeshStandardMaterial({
      color: 0x070B14,
      metalness: 0.4,
      roughness: 0.5
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xF8FAFC, // Crisp white shirt
      metalness: 0.1,
      roughness: 0.4
    });

    const tieMat = new THREE.MeshStandardMaterial({
      color: 0x00D4FF, // Electric cyan signature tie
      emissive: 0x00D4FF,
      emissiveIntensity: 0.15,
      metalness: 0.6,
      roughness: 0.35
    });

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0x8D5524, // Warm South Asian complexion
      metalness: 0.08,
      roughness: 0.72
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x111111, // Dark natural hair
      roughness: 0.9
    });

    // 2A. Legs & Trousers
    const legGeo = new THREE.CylinderGeometry(0.38, 0.42, 4.4, 16);
    const leftLeg = new THREE.Mesh(legGeo, suitMat);
    leftLeg.position.set(-0.6, 2.2, 0);
    bodyGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, suitMat);
    rightLeg.position.set(0.6, 2.2, 0);
    bodyGroup.add(rightLeg);

    // Formal Shoes
    const shoeGeo = new THREE.BoxGeometry(0.85, 0.45, 1.4);
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2, metalness: 0.8 });
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(-0.6, 0.25, 0.25);
    bodyGroup.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0.6, 0.25, 0.25);
    bodyGroup.add(rightShoe);

    // 2B. Torso / Tailored Suit Jacket
    const torsoGeo = new THREE.CylinderGeometry(1.4, 1.1, 4.2, 20);
    const torsoMesh = new THREE.Mesh(torsoGeo, suitMat);
    torsoMesh.position.y = 6.2;
    bodyGroup.add(torsoMesh);

    // Shirt insert
    const shirtGeo = new THREE.BoxGeometry(0.9, 2.8, 0.4);
    const shirtMesh = new THREE.Mesh(shirtGeo, shirtMat);
    shirtMesh.position.set(0, 6.7, 0.88);
    bodyGroup.add(shirtMesh);

    // Electric Cyan Necktie
    const tieGeo = new THREE.BoxGeometry(0.28, 2.4, 0.15);
    const tieMesh = new THREE.Mesh(tieGeo, tieMat);
    tieMesh.position.set(0, 6.6, 1.05);
    bodyGroup.add(tieMesh);

    // Tie knot
    const knotGeo = new THREE.BoxGeometry(0.35, 0.35, 0.2);
    const knotMesh = new THREE.Mesh(knotGeo, tieMat);
    knotMesh.position.set(0, 7.8, 1.02);
    bodyGroup.add(knotMesh);

    // Left and Right Shoulders / Arms
    const armGeo = new THREE.CylinderGeometry(0.34, 0.3, 3.6, 14);
    const leftArm = new THREE.Mesh(armGeo, suitMat);
    leftArm.position.set(-1.75, 6.2, 0);
    leftArm.rotation.z = 0.08;
    bodyGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, suitMat);
    rightArm.position.set(1.75, 6.2, 0);
    rightArm.rotation.z = -0.08;
    bodyGroup.add(rightArm);

    // Hands
    const handGeo = new THREE.SphereGeometry(0.28, 12, 12);
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.set(-1.9, 4.3, 0.1);
    bodyGroup.add(leftHand);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.set(1.9, 4.3, 0.1);
    bodyGroup.add(rightHand);

    // 2C. Head & Face Group
    headGroup = new THREE.Group();
    headGroup.position.set(0, 8.4, 0);
    figure.add(headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.42, 0.48, 0.8, 16);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.y = -0.2;
    headGroup.add(neckMesh);

    // Head base (oval shape)
    const headGeo = new THREE.SphereGeometry(1.05, 24, 24);
    headGeo.scale(0.9, 1.15, 0.95);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.y = 0.8;
    headGroup.add(headMesh);

    // Hair
    const hairGeo = new THREE.SphereGeometry(1.1, 20, 20);
    hairGeo.scale(0.92, 1.12, 0.98);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.95, -0.08);
    headGroup.add(hairMesh);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.12, 10, 10);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1A1A1A });

    leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.35, 0.9, 0.88);
    headGroup.add(leftEye);

    rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.35, 0.9, 0.88);
    headGroup.add(rightEye);

    // Mouth (Mouth mesh that morphs open/close during speech)
    const mouthGeo = new THREE.BoxGeometry(0.36, 0.1, 0.08);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x5C2418 });
    mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
    mouthMesh.position.set(0, 0.42, 0.92);
    headGroup.add(mouthMesh);
  }

  // -------------------------------------------------------------------------
  // 3. ATTEMPT TO LOAD EXTERNAL GLB MODEL (IF AVAILABLE)
  // -------------------------------------------------------------------------
  const loader = new GLTFLoader();
  loader.load(
    './assets/models/sheik-avatar.glb',
    (gltf) => {
      console.log('Successfully loaded external 3D avatar GLB model!');
      isGlbLoaded = true;
      if (avatarMesh) {
        avatarGroup.remove(avatarMesh);
      }
      avatarMesh = gltf.scene;
      avatarMesh.scale.set(4.5, 4.5, 4.5);
      avatarMesh.position.set(0, 0.1, 0);
      avatarGroup.add(avatarMesh);
    },
    undefined,
    () => {
      // Fallback cleanly to procedural avatar
      buildProceduralAvatar();
    }
  );

  // -------------------------------------------------------------------------
  // 4. ANIMATION LOOP & INTERACTIVE DYNAMICS
  // -------------------------------------------------------------------------
  let blinkTimer = 0;
  let nextBlink = 3.0;

  function update(elapsed, carouselAngle) {
    // 4A. Podium rotation and subtle ambient glow
    podiumGroup.rotation.y = elapsed * 0.12;

    // 4B. Avatar rotation tracks carousel angle
    if (avatarGroup) {
      avatarGroup.rotation.y = -carouselAngle;
    }

    // 4C. Breathing and natural idle posture animation
    if (bodyGroup) {
      bodyGroup.position.y = Math.sin(elapsed * 2.2) * 0.05;
      bodyGroup.rotation.z = Math.sin(elapsed * 1.1) * 0.015;
    }

    if (headGroup) {
      // Gentle conversational head gestures
      const headTilt = Math.sin(elapsed * 1.4) * 0.035;
      const headNod = isSpeaking ? Math.sin(elapsed * 8) * 0.08 : Math.sin(elapsed * 1.8) * 0.025;
      headGroup.rotation.z = headTilt;
      headGroup.rotation.x = headNod;

      // 4D. Natural Periodic Eye Blinking
      blinkTimer += 0.016;
      if (blinkTimer > nextBlink && leftEye && rightEye) {
        leftEye.scale.y = 0.1;
        rightEye.scale.y = 0.1;
        if (blinkTimer > nextBlink + 0.12) {
          leftEye.scale.y = 1.0;
          rightEye.scale.y = 1.0;
          blinkTimer = 0;
          nextBlink = 2.5 + Math.random() * 3.5;
        }
      }

      // 4E. Lip-sync synchronization during speech
      if (mouthMesh) {
        if (isSpeaking) {
          const mouthOpen = 1.0 + Math.abs(Math.sin(elapsed * 16)) * 2.2;
          mouthMesh.scale.y = mouthOpen;
          mouthMesh.scale.x = 1.0 + Math.sin(elapsed * 12) * 0.3;
        } else {
          mouthMesh.scale.set(1, 1, 1);
        }
      }
    }
  }

  function setSpeaking(speaking) {
    isSpeaking = Boolean(speaking);
    if (!speaking && mouthMesh) {
      mouthMesh.scale.set(1, 1, 1);
    }
  }

  function setRotation(rad) {
    if (avatarGroup) {
      avatarGroup.rotation.y = rad;
    }
  }

  return {
    group: avatarGroup,
    update,
    setSpeaking,
    setRotation,
    isGlbLoaded: () => isGlbLoaded
  };
}
