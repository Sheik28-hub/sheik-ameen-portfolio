/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * PerformanceManager: Adaptive resolution, device capability tiering & FPS optimization
 */

class PerformanceManager {
  constructor() {
    this.isMobile = window.innerWidth < 768;
    this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    this.isDesktop = window.innerWidth >= 1024;
    this.hasPointerFine = window.matchMedia('(pointer: fine)').matches;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Quality profiles: 'high', 'medium', 'low'
    this.quality = this.determineInitialQuality();

    // Live FPS monitoring
    this.fps = 60;
    this.frames = 0;
    this.lastTime = performance.now();
    this.lowFpsCount = 0;
    this.adaptiveListeners = new Set();
  }

  determineInitialQuality() {
    if (this.isMobile) return 'low';
    if (this.isTablet) return 'medium';

    // Check device hardware concurrency & memory if available
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 8;
    if (cores < 4 || memory < 4) {
      return 'medium';
    }
    return 'high';
  }

  getQualitySettings() {
    switch (this.quality) {
      case 'low':
        return {
          pixelRatio: Math.min(window.devicePixelRatio, 1.25),
          particleCount: 450,
          galaxyStars: 3000,
          shadows: false,
          bloom: false,
          antialias: false,
          volumetricSteps: 8
        };
      case 'medium':
        return {
          pixelRatio: Math.min(window.devicePixelRatio, 1.5),
          particleCount: 850,
          galaxyStars: 7000,
          shadows: true,
          bloom: true,
          antialias: true,
          volumetricSteps: 16
        };
      case 'high':
      default:
        return {
          pixelRatio: Math.min(window.devicePixelRatio, 2.0),
          particleCount: 1400,
          galaxyStars: 14000,
          shadows: true,
          bloom: true,
          antialias: true,
          volumetricSteps: 24
        };
    }
  }

  /**
   * Called every frame in the render loop to monitor FPS
   */
  tick(currentTime = performance.now()) {
    this.frames++;
    const delta = currentTime - this.lastTime;

    if (delta >= 1000) {
      this.fps = Math.round((this.frames * 1000) / delta);
      this.frames = 0;
      this.lastTime = currentTime;

      // If FPS drops below 35 for 3 consecutive seconds on high quality, downgrade to save battery/performance
      if (this.fps < 35 && this.quality === 'high') {
        this.lowFpsCount++;
        if (this.lowFpsCount >= 3) {
          this.setQuality('medium');
          this.lowFpsCount = 0;
        }
      } else if (this.fps < 28 && this.quality === 'medium') {
        this.lowFpsCount++;
        if (this.lowFpsCount >= 3) {
          this.setQuality('low');
          this.lowFpsCount = 0;
        }
      } else {
        this.lowFpsCount = Math.max(0, this.lowFpsCount - 1);
      }
    }
  }

  setQuality(newQuality) {
    if (this.quality === newQuality) return;
    console.info(`[PerformanceManager] Adaptive quality shifted to: ${newQuality}`);
    this.quality = newQuality;
    const settings = this.getQualitySettings();
    this.adaptiveListeners.forEach((fn) => fn(settings));
  }

  onQualityChange(fn) {
    this.adaptiveListeners.add(fn);
    return () => this.adaptiveListeners.delete(fn);
  }
}

export const performanceManager = new PerformanceManager();
export default performanceManager;
