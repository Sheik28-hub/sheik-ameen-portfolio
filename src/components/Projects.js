import { createScrollObserver, add3DTilt } from '../utils/animations.js';

/**
 * PROJECTS COMPONENT
 * Handles project card reveal transitions and desktop 3D card tilt effects.
 */

export default function initProjects() {
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) return;

  // 1. Observe reveal of project cards with staggered entrance
  createScrollObserver('#projects .reveal');

  // 2. Add 3D card tilt effect to each project card on desktop
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    add3DTilt(card, 8);
  });
}
