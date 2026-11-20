/**
 * SHEIK AMEEN — 3D PORTFOLIO
 * Main Application Entry Point
 * Finance × Analytics
 */

import {
  hideLoadingScreen,
  initCustomCursor,
  initSpotlightCards,
  initFinancialCalculator,
  initMagneticButtons,
  initMarketClock,
  prefersReducedMotion
} from './utils/animations.js';
import ExperienceController from './core/ExperienceController.js';
import initNavbar from './components/Navbar.js';
import initHero from './components/Hero.js';
import initAbout from './components/About.js';
import initExperience from './components/Experience.js';
import initProjects from './components/Projects.js';
import initSkills from './components/Skills.js';
import initEducation from './components/Education.js';
import initCertifications from './components/Certifications.js';
import initContact from './components/Contact.js';
import initFooter from './components/Footer.js';
import initCarousel360 from './components/Carousel360.js';
import initVoiceIntro from './components/VoiceIntro.js';

function initPortfolioApp(startCinematic = false) {
  // 1. Initialize desktop custom cursor
  initCustomCursor();

  // 2. Initialize Vercel / Linear-style spotlight tracking across cards
  initSpotlightCards();

  // 3. Initialize Interactive Financial Valuation Simulator
  initFinancialCalculator();

  // 4. Initialize Magnetic Button Micro-interactions
  initMagneticButtons();

  // 5. Initialize Live Global Financial Telemetry Clock
  initMarketClock();

  // 6. Initialize Master Experience Controller (Beyond The Universe 3D Engine)
  let threeScene = null;
  if (!prefersReducedMotion) {
    try {
      threeScene = new ExperienceController('three-canvas');
    } catch (err) {
      console.warn('[main.js] ExperienceController failed to initialize, using fallback:', err);
    }
  }

  // 7. Initialize Navbar
  initNavbar();

  // 8. Initialize 360° Cylindrical Rotating Digital World Carousel
  initCarousel360(threeScene);

  // 9. Initialize AI Voice Introduction Experience
  initVoiceIntro(threeScene);

  // 10. Initialize All Website Sections
  initHero();
  initAbout();
  initExperience();
  initProjects();
  initSkills();
  initEducation();
  initCertifications();
  initContact();
  initFooter();

  // 11. Connect Global Mouse Coordinates to ExperienceController for Parallax
  if (threeScene && threeScene.updateMouse) {
    window.addEventListener('mousemove', (e) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      threeScene.updateMouse(normalizedX, normalizedY);
    }, { passive: true });
  }

  // 12. Handle Cinematic Opening Sequence vs Direct Skip
  if (threeScene && threeScene.introTimeline) {
    if (startCinematic) {
      threeScene.introTimeline.start();
    } else {
      threeScene.introTimeline.skip();
    }
  }

  // 13. Professional Console Branding
  console.log(
    '%c SHEIK AMEEN — BEYOND THE UNIVERSE %c Finance × Analytics × Technology ',
    'background: #00D4FF; color: #070A12; font-weight: 800; font-size: 14px; padding: 5px 10px; border-radius: 4px 0 0 4px;',
    'background: #141D2B; color: #94A3B8; font-size: 14px; padding: 5px 10px; border-radius: 0 4px 4px 0;'
  );
}

// Bootstrap lifecycle: show loading animation, then mount portfolio
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    hideLoadingScreen(initPortfolioApp);
  });
} else {
  hideLoadingScreen(initPortfolioApp);
}
