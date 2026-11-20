import * as THREE from 'three';
import assetManager from './AssetManager.js';
import performanceManager from './PerformanceManager.js';
import AvatarController from '../avatar/AvatarController.js';
import IdentityScene from '../scenes/IdentityScene.js';
import UniverseScene from '../scenes/UniverseScene.js';
import PortfolioScene from '../scenes/PortfolioScene.js';
import IntroTimeline from '../animations/IntroTimeline.js';

/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * ExperienceController: Master State Machine, Scene Coordinator & Render Loop
 */

export class ExperienceController {
  constructor(canvasId = 'three-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`[ExperienceController] Canvas #${canvasId} not found.`);
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Sub-controllers
    this.avatar = null;
    this.identityScene = null;
    this.universeScene = null;
    this.portfolioScene = null;
    this.introTimeline = null;

    // Mouse & Parallax tracking
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.currentMouseX = 0;
    this.currentMouseY = 0;
    this.scrollY = 0;
    this.currentScrollY = 0;

    this.clock = new THREE.Clock();
    this.animationFrameId = null;
    this.isVisible = true;

    this.initCore();
    this.initSubsystems();
    this.bindEvents();
    this.startRenderLoop();
  }

  initCore() {
    const isMobile = performanceManager.isMobile;
    const settings = performanceManager.getQualitySettings();

    // 1. Master Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070A12, isMobile ? 0.024 : 0.016);

    // 2. Cinematic Camera
    this.camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.2, 34);

    // 3. WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: settings.antialias,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(settings.pixelRatio);
    this.renderer.setClearColor(0x070A12, 0);

    // 4. Atmospheric Lighting
    const ambientLight = new THREE.AmbientLight(0x0D1422, 2.2);
    this.scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00D4FF, 5.0, 140);
    cyanLight.position.set(22, 18, 24);
    this.scene.add(cyanLight);

    const indigoLight = new THREE.PointLight(0x6865F2, 4.2, 120);
    indigoLight.position.set(-24, -14, 18);
    this.scene.add(indigoLight);

    const rimLight = new THREE.DirectionalLight(0xC8D0DC, 1.8);
    rimLight.position.set(0, 30, -20);
    this.scene.add(rimLight);
  }

  initSubsystems() {
    // 1. Avatar Controller (Podium + Figurine/GLB + Lip-Sync)
    this.avatar = new AvatarController(this.scene);

    // 2. Identity Scene (Falling Typography)
    this.identityScene = new IdentityScene(this.scene, this.avatar);

    // 3. Universe Scene (Fireball + Galaxy + Nebula)
    this.universeScene = new UniverseScene(this.scene);

    // 4. Portfolio Scene (8 Celestial Portals)
    this.portfolioScene = new PortfolioScene(this.scene, this.camera);

    // 5. Cinematic Timeline Orchestrator
    this.introTimeline = new IntroTimeline(this);
  }

  bindEvents() {
    // Tab visibility handling
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
    });

    // Window scroll tracking
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    }, { passive: true });

    // Window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      const settings = performanceManager.getQualitySettings();
      this.renderer.setPixelRatio(settings.pixelRatio);
    });

    // Adaptive quality listener
    performanceManager.onQualityChange((settings) => {
      this.renderer.setPixelRatio(settings.pixelRatio);
    });
  }

  updateMouse(x, y) {
    this.targetMouseX = x;
    this.targetMouseY = y;
  }

  updateCarouselAngle(rad) {
    if (this.avatar) {
      this.avatar.setRotation(-rad);
    }
  }

  setAvatarSpeaking(speaking) {
    if (this.avatar) {
      this.avatar.setSpeaking(speaking);
    }
  }

  startRenderLoop() {
    const render = () => {
      this.animationFrameId = requestAnimationFrame(render);
      if (!this.isVisible) return;

      const elapsed = this.clock.getElapsedTime();
      performanceManager.tick();

      // Lerp mouse coordinates
      this.currentMouseX += (this.targetMouseX - this.currentMouseX) * 0.045;
      this.currentMouseY += (this.targetMouseY - this.currentMouseY) * 0.045;
      this.currentScrollY += (this.scrollY - this.currentScrollY) * 0.05;

      // Update active sub-scenes
      if (this.avatar) this.avatar.update(elapsed);
      if (this.identityScene) this.identityScene.update(elapsed);
      if (this.universeScene) this.universeScene.update(elapsed);
      if (this.portfolioScene) this.portfolioScene.update(elapsed);

      // Camera parallax
      this.camera.position.x += (this.currentMouseX * 1.8 - this.camera.position.x) * 0.03;
      this.camera.position.y += (1.2 - this.currentMouseY * 1.4 - (this.currentScrollY * 0.005) - this.camera.position.y) * 0.03;
      this.camera.lookAt(0, 0, 0);

      this.renderer.render(this.scene, this.camera);
    };

    render();
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) this.renderer.dispose();
  }
}

export default ExperienceController;
