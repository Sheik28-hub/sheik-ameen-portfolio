import * as THREE from 'three';

/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * Fireball: Plasma energy burst & shockwave eruption shader
 */

export class Fireball {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);
    this.scene.add(this.group);

    this.active = false;
    this.progress = 0; // 0 to 1
    this.duration = 4.5;
    this.onComplete = null;

    this.initPlasmaSphere();
    this.initShockwaveRing();
    this.initSparks();

    this.group.visible = false;
  }

  initPlasmaSphere() {
    const geo = new THREE.SphereGeometry(3.5, 32, 32);
    this.plasmaMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColorCore: { value: new THREE.Color(0xFFFFFF) },
        uColorMid: { value: new THREE.Color(0x00D4FF) },
        uColorOuter: { value: new THREE.Color(0x6865F2) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform float uProgress;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          // Plasma surface noise displacement
          float displacement = sin(position.x * 2.5 + uTime * 4.0) * 
                               cos(position.y * 2.5 + uTime * 3.5) * 
                               sin(position.z * 2.5 + uTime * 3.0) * 0.45;
          vec3 newPos = position + normal * displacement * (1.0 - uProgress);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float uTime;
        uniform float uProgress;
        uniform vec3 uColorCore;
        uniform vec3 uColorMid;
        uniform vec3 uColorOuter;

        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 color = mix(uColorCore, uColorMid, smoothstep(0.0, 0.6, intensity));
          color = mix(color, uColorOuter, smoothstep(0.4, 1.0, intensity));
          float alpha = (1.0 - uProgress) * (0.85 + 0.15 * sin(uTime * 10.0));
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    this.plasmaMesh = new THREE.Mesh(geo, this.plasmaMat);
    this.group.add(this.plasmaMesh);
  }

  initShockwaveRing() {
    const ringGeo = new THREE.RingGeometry(0.1, 1.2, 64);
    this.shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0x00D4FF,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.shockwaveMesh = new THREE.Mesh(ringGeo, this.shockwaveMat);
    this.shockwaveMesh.rotation.x = Math.PI / 2;
    this.group.add(this.shockwaveMesh);
  }

  initSparks() {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      // Random spherical outward velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 8.0 + Math.random() * 16.0;

      vel[i * 3]     = speed * Math.sin(phi) * Math.cos(theta);
      vel[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      vel[i * 3 + 2] = speed * Math.cos(phi);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.sparkVelocities = vel;

    const mat = new THREE.PointsMaterial({
      color: 0x00D4FF,
      size: 0.28,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.sparkPoints = new THREE.Points(geo, mat);
    this.group.add(this.sparkPoints);
  }

  trigger(duration = 4.5, onComplete = null) {
    this.active = true;
    this.group.visible = true;
    this.progress = 0;
    this.duration = duration;
    this.onComplete = onComplete;
    this.startTime = performance.now();
  }

  update(elapsed) {
    if (!this.active) return;

    const now = performance.now();
    const timeDelta = (now - this.startTime) / 1000;
    this.progress = Math.min(1.0, timeDelta / this.duration);

    // Update shader uniforms
    this.plasmaMat.uniforms.uTime.value = elapsed;
    this.plasmaMat.uniforms.uProgress.value = this.progress;

    // Expand plasma sphere then burst outward
    const scale = 1.0 + Math.pow(this.progress, 1.5) * 8.0;
    this.plasmaMesh.scale.set(scale, scale, scale);

    // Expand shockwave ring
    const ringRadius = this.progress * 45.0;
    this.shockwaveMesh.scale.set(ringRadius, ringRadius, 1);
    this.shockwaveMat.opacity = Math.max(0, (1.0 - this.progress) * 0.95);

    // Move sparks outward
    const pos = this.sparkPoints.geometry.attributes.position.array;
    for (let i = 0; i < pos.length / 3; i++) {
      pos[i * 3]     = this.sparkVelocities[i * 3] * this.progress;
      pos[i * 3 + 1] = this.sparkVelocities[i * 3 + 1] * this.progress;
      pos[i * 3 + 2] = this.sparkVelocities[i * 3 + 2] * this.progress;
    }
    this.sparkPoints.geometry.attributes.position.needsUpdate = true;
    this.sparkPoints.material.opacity = Math.max(0, 1.0 - this.progress);

    if (this.progress >= 1.0) {
      this.active = false;
      this.group.visible = false;
      if (this.onComplete) this.onComplete();
    }
  }
}

export default Fireball;
