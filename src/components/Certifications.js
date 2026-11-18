import { createScrollObserver, add3DTilt } from '../utils/animations.js';

/**
 * CERTIFICATIONS COMPONENT
 * Handles certification grid reveals and desktop card tilt.
 */

export default function initCertifications() {
  const certsSection = document.getElementById('certifications');
  if (!certsSection) return;

  createScrollObserver('#certifications .reveal');

  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach((card) => {
    add3DTilt(card, 6);
  });
}
