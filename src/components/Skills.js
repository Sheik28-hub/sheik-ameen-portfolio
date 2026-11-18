import { createScrollObserver, add3DTilt } from '../utils/animations.js';

/**
 * SKILLS COMPONENT
 * Handles category reveal, desktop 3D tilt, and interactive tag hover animations.
 */

export default function initSkills() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  // 1. Observe category reveal
  createScrollObserver('#skills .reveal');

  // 2. Add subtle tilt to skill category cards
  const skillCategories = document.querySelectorAll('.skill-category');
  skillCategories.forEach((cat) => {
    add3DTilt(cat, 6);
  });
}
