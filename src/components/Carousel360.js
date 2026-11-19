/**
 * SHEIK AMEEN — 360° DIGITAL WORLD CYLINDRICAL CAROUSEL
 * 
 * Arranges 6 interactive portfolio panels in a 3D cylindrical track around
 * the central 3D Avatar.
 * 
 * Features:
 * - 60-degree cylindrical geometry (6 panels, radius R)
 * - Mouse drag / touch swipe for free 360-degree orbiting
 * - Mouse wheel stepped navigation
 * - Left (<) / Right (>) navigation buttons
 * - Direct panel click to bring to front
 * - Smooth snapping to active slide
 * - Auto-rotation with pause on hover/interaction
 * - Synchronized 360° avatar rotation via Three.js
 */

export default function initCarousel360(threeScene) {
  const carouselContainer = document.getElementById('carousel-360-container');
  const stage = document.getElementById('carousel-stage');
  const panels = document.querySelectorAll('.carousel-panel');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots = document.querySelectorAll('.carousel-dot');
  const counterCurrent = document.getElementById('carousel-counter-current');

  if (!carouselContainer || !stage || !panels.length) return;

  const totalPanels = 6;
  const anglePerPanel = 360 / totalPanels; // 60 deg

  let currentAngle = 0;
  let targetAngle = 0;
  let isDragging = false;
  let startX = 0;
  let startAngle = 0;
  let hasDragged = false;
  let autoRotate = true;
  let autoRotateSpeed = 0.05;
  let autoResumeTimer = null;
  let animationFrameId = null;

  // Compute radius based on viewport width
  function getRadius() {
    const w = window.innerWidth;
    if (w < 480) return 260;
    if (w < 768) return 320;
    if (w < 1024) return 400;
    if (w < 1440) return 470;
    return 520;
  }

  let radius = getRadius();

  // Position panels in 3D cylindrical coordinates
  function layoutPanels() {
    radius = getRadius();
    panels.forEach((panel, i) => {
      const panelAngle = i * anglePerPanel;
      panel.style.transform = `rotateY(${panelAngle}deg) translateZ(${radius}px)`;
    });
  }

  layoutPanels();
  window.addEventListener('resize', layoutPanels);

  // Normalize angle to [0, 5] index
  function getActiveIndex() {
    const normalized = Math.round(targetAngle / anglePerPanel) % totalPanels;
    return (normalized + totalPanels) % totalPanels;
  }

  // Update visual states of panels and dots
  function updateActiveStates() {
    const activeIdx = getActiveIndex();

    panels.forEach((panel, i) => {
      if (i === activeIdx) {
        panel.classList.add('active');
        panel.classList.remove('blurred');
      } else {
        panel.classList.remove('active');
        // Angular distance from active
        const dist = Math.min(
          Math.abs(i - activeIdx),
          totalPanels - Math.abs(i - activeIdx)
        );
        if (dist >= 2) {
          panel.classList.add('blurred');
        } else {
          panel.classList.remove('blurred');
        }
      }
    });

    dots.forEach((dot, i) => {
      if (i === activeIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (counterCurrent) {
      counterCurrent.textContent = `0${activeIdx + 1}`;
    }
  }

  function pauseAutoRotation(resumeDelay = 6000) {
    autoRotate = false;
    clearTimeout(autoResumeTimer);
    autoResumeTimer = setTimeout(() => {
      autoRotate = true;
    }, resumeDelay);
  }

  // Snap to target angle
  function snapToNearest() {
    targetAngle = Math.round(targetAngle / anglePerPanel) * anglePerPanel;
  }

  function goToSlide(index) {
    pauseAutoRotation(7000);
    const currentIdx = getActiveIndex();
    let diff = index - currentIdx;
    if (diff > totalPanels / 2) diff -= totalPanels;
    if (diff < -totalPanels / 2) diff += totalPanels;
    targetAngle += diff * anglePerPanel;
    updateActiveStates();
  }

  // Navigation Arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      pauseAutoRotation();
      targetAngle -= anglePerPanel;
      updateActiveStates();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      pauseAutoRotation();
      targetAngle += anglePerPanel;
      updateActiveStates();
    });
  }

  // Click on Dots
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide-index'), 10);
      if (!isNaN(idx)) goToSlide(idx);
    });
  });

  // Click on Panels
  panels.forEach((panel, i) => {
    panel.addEventListener('click', (e) => {
      // Don't trigger if clicking an interactive element inside
      if (e.target.closest('a, button, input')) return;
      if (hasDragged) return;

      const activeIdx = getActiveIndex();
      if (i !== activeIdx) {
        goToSlide(i);
      }
    });
  });

  // Pointer / Drag Interactions
  carouselContainer.addEventListener('pointerdown', (e) => {
    isDragging = true;
    hasDragged = false;
    startX = e.clientX;
    startAngle = targetAngle;
    pauseAutoRotation();
    carouselContainer.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 6) hasDragged = true;
    const sensitivity = window.innerWidth < 768 ? 0.35 : 0.22;
    targetAngle = startAngle - deltaX * sensitivity;
  });

  window.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;
    carouselContainer.style.cursor = 'grab';
    snapToNearest();
    updateActiveStates();
    pauseAutoRotation(5000);
  });

  // Mouse Wheel navigation
  let wheelTimeout = null;
  carouselContainer.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) < 15 && Math.abs(e.deltaX) < 15) return;
    e.preventDefault();
    pauseAutoRotation(6000);

    if (!wheelTimeout) {
      if (e.deltaY > 0 || e.deltaX > 0) {
        targetAngle += anglePerPanel;
      } else {
        targetAngle -= anglePerPanel;
      }
      updateActiveStates();
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 400);
    }
  }, { passive: false });

  // Hover Pause
  carouselContainer.addEventListener('mouseenter', () => {
    autoRotate = false;
  });

  carouselContainer.addEventListener('mouseleave', () => {
    if (!isDragging) {
      autoResumeTimer = setTimeout(() => {
        autoRotate = true;
      }, 2000);
    }
  });

  // Main Render / Interpolation Loop
  function render() {
    animationFrameId = requestAnimationFrame(render);

    if (autoRotate && !isDragging) {
      targetAngle += autoRotateSpeed;
    }

    // Smooth Lerp Easing
    currentAngle += (targetAngle - currentAngle) * 0.085;

    // Apply rotation to CSS 3D stage
    stage.style.transform = `rotateY(${-currentAngle}deg)`;

    // Sync rotation angle with Three.js central 3D Avatar
    if (threeScene && threeScene.updateCarouselAngle) {
      const rad = (currentAngle * Math.PI) / 180;
      threeScene.updateCarouselAngle(rad);
    }
  }

  render();
  updateActiveStates();

  return {
    destroy() {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', layoutPanels);
    }
  };
}
