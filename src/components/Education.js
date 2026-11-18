import { createScrollObserver, add3DTilt } from '../utils/animations.js';

/**
 * EDUCATION COMPONENT
 * Handles education card reveals and desktop tilt.
 */

export default function initEducation() {
  const eduSection = document.getElementById('education');
  if (!eduSection) return;

  createScrollObserver('#education .reveal, #education .reveal-left, #education .reveal-right');

  const eduCards = document.querySelectorAll('.edu-card');
  eduCards.forEach((card) => {
    add3DTilt(card, 6);
  });
}
