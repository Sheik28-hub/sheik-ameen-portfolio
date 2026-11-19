import { createScrollObserver, add3DTilt } from '../utils/animations.js';

/**
 * PROJECTS COMPONENT
 * Handles project category filtering, card reveal transitions, and desktop 3D card tilt effects.
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

  // 3. Interactive Category Filter Switcher
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.classList.remove('filter-hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.98)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.classList.add('filter-hidden');
        }
      });
    });
  });
}
