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
  prefersReducedMotion
} from './utils/animations.js';
import { initThreeScene } from './three/scene.js';
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

function initPortfolioApp() {
  // 1. Initialize desktop custom cursor
  initCustomCursor();

  // 2. Initialize Vercel / Linear-style spotlight tracking across cards
  initSpotlightCards();

  // 3. Initialize Interactive Financial Valuation Simulator
  initFinancialCalculator();

  // 4. Initialize Magnetic Button Micro-interactions
  initMagneticButtons();

  // 4. Initialize Three.js 3D Background with Market Wave
  let threeScene = null;
  if (!prefersReducedMotion) {
    try {
      threeScene = initThreeScene();
    } catch (err) {
      console.warn('Three.js failed to initialize, using CSS fallback:', err);
    }
  }

  // 5. Initialize Navbar
  initNavbar();

  // 6. Initialize All Website Sections
  initHero();
  initAbout();
  initExperience();
  initProjects();
  initSkills();
  initEducation();
  initCertifications();
  initContact();
  initFooter();

  // 7. Connect Global Mouse Coordinates to Three.js for Parallax
  if (threeScene && threeScene.updateMouse) {
    window.addEventListener('mousemove', (e) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      threeScene.updateMouse(normalizedX, normalizedY);
    }, { passive: true });
  }

  // 9. Professional Console Branding
  console.log(
    '%c SHEIK AMEEN %c Finance × Analytics × Technology ',
    'background: #00D4FF; color: #070A12; font-weight: 800; font-size: 14px; padding: 5px 10px; border-radius: 4px 0 0 4px;',
    'background: #141D2B; color: #94A3B8; font-size: 14px; padding: 5px 10px; border-radius: 0 4px 4px 0;'
  );
  console.log(
    '%cTransforming Financial Data into Strategic Decisions.%c\nEmail: ameensheik2902@gmail.com | LinkedIn: linkedin.com/in/sheik-ameen',
    'color: #00D4FF; font-weight: 600; font-size: 12px;',
    'color: #64748B; font-size: 11px;'
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
