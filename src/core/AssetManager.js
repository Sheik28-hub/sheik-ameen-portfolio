import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * AssetManager: Centralized preloader & cache for 3D models, textures, audio & shaders
 */
class AssetManager {
  constructor() {
    this.cache = new Map();
    this.loadingManager = new THREE.LoadingManager();
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.audioContext = null;
    this.audioBuffers = new Map();

    this.onProgress = null;
    this.onComplete = null;
    this.onError = null;

    this.setupLoadingManager();
  }

  setupLoadingManager() {
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = itemsLoaded / itemsTotal;
      if (this.onProgress) {
        this.onProgress(progress, url, itemsLoaded, itemsTotal);
      }
    };

    this.loadingManager.onLoad = () => {
      if (this.onComplete) {
        this.onComplete();
      }
    };

    this.loadingManager.onError = (url) => {
      console.warn(`[AssetManager] Asset failed to load: ${url}`);
      if (this.onError) {
        this.onError(url);
      }
    };
  }

  /**
   * Load a GLTF / GLB model with automatic caching
   */
  async loadGLTF(path) {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf) => {
          this.cache.set(path, gltf);
          resolve(gltf);
        },
        undefined,
        (err) => {
          console.warn(`[AssetManager] GLTF loading fallback for ${path}:`, err);
          reject(err);
        }
      );
    });
  }

  /**
   * Load a Texture with automatic caching
   */
  loadTexture(path) {
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }
    const texture = this.textureLoader.load(path);
    this.cache.set(path, texture);
    return texture;
  }

  /**
   * Get or initialize Web Audio context
   */
  getAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  /**
   * Preload an audio file into an AudioBuffer
   */
  async loadAudio(path) {
    if (this.audioBuffers.has(path)) {
      return this.audioBuffers.get(path);
    }

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return null;

      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const decoded = await ctx.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(path, decoded);
      return decoded;
    } catch (err) {
      console.warn(`[AssetManager] Audio preload failed for ${path}:`, err);
      return null;
    }
  }

  /**
   * Play cached audio buffer with optional gain node
   */
  playAudio(path, volume = 1.0, loop = false) {
    const ctx = this.getAudioContext();
    const buffer = this.audioBuffers.get(path);
    if (!ctx || !buffer) return null;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(0);

    return { source, gainNode };
  }

  /**
   * Clean up and dispose all cached textures and geometries
   */
  dispose() {
    this.cache.forEach((asset) => {
      if (asset && asset.dispose) {
        asset.dispose();
      } else if (asset && asset.scene) {
        asset.scene.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    });
    this.cache.clear();
    this.audioBuffers.clear();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

export const assetManager = new AssetManager();
export default assetManager;
