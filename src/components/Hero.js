/**
 * HERO COMPONENT
 * Handles letter-by-letter name reveal (S H E I K   A M E E N),
 * parallax mouse tracking, and scroll indicator behavior.
 */

export default function initHero() {
  const heroContent = document.querySelector('.hero-content');
  const letters = document.querySelectorAll('.hero-name .letter');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (!heroContent) return;

  // 1. Letter-by-letter reveal sequence
  // Trigger after loading screen
  setTimeout(() => {
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('animate');
      }, index * 65);
    });

    // Reveal the eyebrow, tagline, description, and buttons
    setTimeout(() => {
      heroContent.classList.add('loaded');
    }, letters.length * 65 + 150);
  }, 200);

  // 2. Parallax mouse tracking on hero text (desktop fine pointer)
  if (window.matchMedia('(pointer: fine)').matches) {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
      });

      heroSection.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
      });

      function updateParallax() {
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;

        heroContent.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
        requestAnimationFrame(updateParallax);
      }
      updateParallax();
    }
  }

  // 3. Hide scroll indicator when user scrolls
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        scrollIndicator.classList.add('hidden');
      } else {
        scrollIndicator.classList.remove('hidden');
      }
    }, { passive: true });
  }
}
