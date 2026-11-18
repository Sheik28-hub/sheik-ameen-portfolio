import { createScrollObserver, animateCounter } from '../utils/animations.js';

/**
 * ABOUT ME COMPONENT
 * Handles scroll entrance transitions, image fallback, and verified statistics counter animation.
 */

export default function initAbout() {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  // 1. Observe general reveal elements in About section
  createScrollObserver('#about .reveal, #about .reveal-left, #about .reveal-right');

  // 2. Animate Verified Statistics when stats grid enters view
  const statsGrid = document.querySelector('.stats-grid');
  let animated = false;

  if (statsGrid) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          const statNumbers = statsGrid.querySelectorAll('.stat-number');
          statNumbers.forEach((el) => {
            const target = parseInt(el.getAttribute('data-target'), 10) || 0;
            const suffix = el.getAttribute('data-suffix') || '';
            animateCounter(el, target, 1600, suffix);
          });
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    statObserver.observe(statsGrid);
  }

  // 3. Image error fallback to styled monogram
  const profileImg = document.querySelector('.profile-img');
  const placeholder = document.querySelector('.profile-img-placeholder');

  if (profileImg && placeholder) {
    profileImg.addEventListener('error', () => {
      profileImg.style.display = 'none';
      placeholder.style.display = 'flex';
    });
  }
}
