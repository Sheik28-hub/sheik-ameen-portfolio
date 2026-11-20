/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * LipSyncController: Audio-driven viseme & mouth morph target synchronizer
 */

export class LipSyncController {
  constructor() {
    this.isSpeaking = false;
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.currentViseme = { open: 0, width: 1 };
    this.visemeHistory = [];
  }

  /**
   * Connect an HTMLAudioElement or Web Audio source for real-time frequency analysis
   */
  connectAudioElement(audioElement) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaElementSource(audioElement);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
    } catch (err) {
      console.warn('[LipSyncController] Web Audio connection fallback:', err);
    }
  }

  setSpeaking(speaking) {
    this.isSpeaking = Boolean(speaking);
    if (!this.isSpeaking) {
      this.currentViseme = { open: 0, width: 1 };
    }
  }

  /**
   * Update method called in the animation loop
   * Computes mouth open (jaw) and width values
   */
  update(elapsed) {
    if (!this.isSpeaking) {
      this.currentViseme.open = 0;
      this.currentViseme.width = 1;
      return this.currentViseme;
    }

    // 1. If Web Audio analyser is available and active, read real spectrum energy
    if (this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray);
      // Low to mid frequencies (vowels, voice formant range ~100Hz - 2500Hz)
      let energy = 0;
      const sampleCount = Math.min(16, this.dataArray.length);
      for (let i = 1; i < sampleCount; i++) {
        energy += this.dataArray[i];
      }
      const avgEnergy = energy / (sampleCount - 1) / 255; // 0 to 1

      const targetOpen = Math.min(1.0, avgEnergy * 1.8);
      this.currentViseme.open += (targetOpen - this.currentViseme.open) * 0.35;
      this.currentViseme.width = 1.0 + Math.sin(elapsed * 10) * 0.2;
    } else {
      // 2. High-fidelity procedural speech cadence (formant emulation)
      // Combines 3 harmonic frequencies mimicking natural English syllabic rhythm
      const syllableCadence = Math.sin(elapsed * 14.5) * 0.45 
                            + Math.sin(elapsed * 21.2) * 0.35 
                            + Math.sin(elapsed * 7.8) * 0.20;
      const openAmount = Math.max(0.08, Math.abs(syllableCadence) * 1.25);
      
      this.currentViseme.open = openAmount;
      this.currentViseme.width = 1.0 + Math.sin(elapsed * 11) * 0.25;
    }

    return this.currentViseme;
  }
}

export default LipSyncController;
