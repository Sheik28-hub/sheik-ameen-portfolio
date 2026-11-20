import gsap from 'gsap';

/**
 * SHEIK AMEEN — BEYOND THE UNIVERSE
 * IntroTimeline: Master 29-31s Cinematic Sequence Orchestrator
 */

export class IntroTimeline {
  constructor(experienceController) {
    this.ec = experienceController;
    this.isPlaying = false;
    this.isCompleted = false;
  }

  /**
   * Start the complete cinematic choreography
   */
  start(onComplete = null) {
    if (this.isPlaying) return;
    this.isPlaying = true;

    console.info('[IntroTimeline] Starting 30-Second Cinematic Sequence...');
    const ec = this.ec;

    // Stage 1 (0–2s): Ambient Star Dust
    const tl = gsap.timeline({
      onComplete: () => {
        this.isPlaying = false;
        this.isCompleted = true;
        if (onComplete) onComplete();
      }
    });

    // 1. Camera starts elevated and slowly glides forward
    tl.to(ec.camera.position, {
      z: 32,
      y: 2.5,
      duration: 2.0,
      ease: "power1.inOut"
    });

    // Stage 2 (2–5s): 3D Falling Typography Sequence
    tl.call(() => {
      if (ec.identityScene) {
        ec.identityScene.triggerFallingName(3.0);
      }
    }, null, 2.0);

    // Stage 3 (5–9s): Avatar Arrival & Descent from Space
    tl.call(() => {
      if (ec.avatar) {
        ec.avatar.triggerLanding(4.0);
      }
    }, null, 5.0);

    // Stage 4 (9–16s): Dialogue & Synchronized Lip-Sync
    // "Hello Everyone, I'm Sheik Ameen. Welcome to my World."
    tl.call(() => {
      this.playDialogue();
    }, null, 9.2);

    // Stage 5 (16–21s): Cosmic Event — Fireball & Shockwave
    tl.call(() => {
      if (ec.universeScene) {
        ec.universeScene.triggerCosmicEvent();
      }
    }, null, 16.0);

    // Stage 6 (21–27s): Universe Formation (Galaxy illumination & camera sweep)
    tl.to(ec.camera.position, {
      x: 0,
      y: 4.5,
      z: 38,
      duration: 6.0,
      ease: "power2.inOut"
    }, 21.0);

    // Stage 7 (27–31s): Celestial Portals & Interactive World Reveal
    tl.call(() => {
      if (ec.portfolioScene) {
        ec.portfolioScene.activate();
      }
      // Reveal UI overlays smoothly
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) heroContent.classList.add('loaded');
      const navbar = document.getElementById('navbar');
      if (navbar) navbar.style.opacity = '1';
    }, null, 27.5);

    this.timeline = tl;
    return tl;
  }

  /**
   * Play Indian English Dialogue with Lip-Sync
   */
  playDialogue() {
    const text = "Hello Everyone, I'm Sheik Ameen. Welcome to my World.";
    const ec = this.ec;

    if (ec.avatar) {
      ec.avatar.setSpeaking(true);
    }

    // Try Web Speech API with Indian English voice
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      let indianVoice = voices.find(v => (v.lang === 'en-IN' || v.lang === 'en_IN') && /male|ravi|prabhat/i.test(v.name));
      if (!indianVoice) {
        indianVoice = voices.find(v => v.lang === 'en-IN' || v.lang === 'en_IN');
      }
      if (indianVoice) utterance.voice = indianVoice;
      utterance.pitch = 0.98;
      utterance.rate = 0.92;

      utterance.onend = () => {
        if (ec.avatar) ec.avatar.setSpeaking(false);
      };
      utterance.onerror = () => {
        if (ec.avatar) ec.avatar.setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Procedural timer fallback
      setTimeout(() => {
        if (ec.avatar) ec.avatar.setSpeaking(false);
      }, 5500);
    }
  }

  /**
   * Skip directly to the end of the cinematic sequence
   */
  skip() {
    if (this.timeline) {
      this.timeline.progress(1.0);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (this.ec.avatar) {
      this.ec.avatar.group.position.y = -6;
      this.ec.avatar.setSpeaking(false);
    }
    if (this.ec.portfolioScene) {
      this.ec.portfolioScene.activate();
    }
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.classList.add('loaded');
  }
}

export default IntroTimeline;
