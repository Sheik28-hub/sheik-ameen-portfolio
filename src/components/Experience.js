import { createScrollObserver, animateCounter } from '../utils/animations.js';

/**
 * EXPERIENCE COMPONENT
 * Handles timeline line draw animation, achievement metric counter, and interactive tech tags.
 */

export default function initExperience() {
  const expSection = document.getElementById('experience');
  if (!expSection) return;

  // 1. Observe general reveals
  createScrollObserver('#experience .reveal, #experience .timeline-card');

  // 2. Animate timeline vertical line draw
  const timelineLine = document.querySelector('.timeline-line');
  const timelineDot = document.querySelector('.timeline-dot');

  if (timelineLine) {
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timelineLine.classList.add('visible');
          if (timelineDot) timelineDot.classList.add('pulse');
          lineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    lineObserver.observe(expSection);
  }

  // 3. Animate 35,000+ achievement metric
  const achievementCard = document.querySelector('.achievement-card');
  const achievementNumber = document.querySelector('.achievement-number');
  let achievementAnimated = false;

  if (achievementCard && achievementNumber) {
    const achieveObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !achievementAnimated) {
          achievementAnimated = true;
          achievementCard.classList.add('highlight');
          const target = parseInt(achievementNumber.getAttribute('data-target'), 10) || 35000;
          const suffix = achievementNumber.getAttribute('data-suffix') || '+';
          animateCounter(achievementNumber, target, 2000, suffix);
          achieveObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    achieveObserver.observe(achievementCard);
  }
}
