import * as THREE from 'three';
import CelestialPortals from '../universe/Portal.js';

/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * PortfolioScene: 8 Celestial Portals & Spatial Interaction Layer
 */

export class PortfolioScene {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.portals = new CelestialPortals(scene, camera);
    this.active = false;
  }

  activate() {
    this.active = true;
    this.group.visible = true;
  }

  deactivate() {
    this.active = false;
    this.group.visible = false;
  }

  update(elapsed) {
    if (this.portals) {
      this.portals.update(elapsed);
    }
  }
}

export default PortfolioScene;
