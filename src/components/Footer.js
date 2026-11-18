/**
 * FOOTER COMPONENT
 * Handles back-to-top button and dynamic copyright year.
 */

export default function initFooter() {
  const backToTopBtn = document.getElementById('back-to-top');
  const yearSpan = document.getElementById('footer-year');

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
