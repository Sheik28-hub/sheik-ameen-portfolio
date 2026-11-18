/**
 * SHEIK AMEEN PORTFOLIO — CORE ANIMATION & INTERACTION UTILITIES
 */

export const isMobile = window.innerWidth < 768;
export const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const hasPointerFine = window.matchMedia('(pointer: fine)').matches;

// Easing Helper: cubic ease out
export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Indian & Standard Number Formatter
export function formatNumber(val, useIndian = true) {
  if (useIndian) {
    return val.toLocaleString('en-IN');
  }
  return val.toLocaleString('en-US');
}

/**
 * Scroll Observer Helper with IntersectionObserver
 */
export function createScrollObserver(selectorOrElements, options = {}) {
  const elements = typeof selectorOrElements === 'string'
    ? document.querySelectorAll(selectorOrElements)
    : selectorOrElements;

  if (!elements || (elements.length !== undefined && elements.length === 0)) return null;

  const config = {
    threshold: options.threshold ?? 0.15,
    rootMargin: options.rootMargin ?? '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (options.onVisible) options.onVisible(entry.target);
        if (options.unobserve !== false) observer.unobserve(entry.target);
      }
    });
  }, config);

  if (elements.forEach) {
    elements.forEach((el) => observer.observe(el));
  } else {
    observer.observe(elements);
  }

  return observer;
}

/**
 * Smooth Number Counter Animation
 */
export function animateCounter(element, target, duration = 1800, suffix = '', useFormat = true) {
  if (!element) return;
  if (prefersReducedMotion) {
    element.textContent = (useFormat && target >= 1000 ? formatNumber(target) : target) + suffix;
    return;
  }

  const start = performance.now();
  function step(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = Math.floor(eased * target);

    element.textContent = (useFormat && target >= 1000 ? formatNumber(current) : current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = (useFormat && target >= 1000 ? formatNumber(target) : target) + suffix;
    }
  }
  requestAnimationFrame(step);
}

/**
 * 3D Tilt Effect on mousemove for interactive cards
 */
export function add3DTilt(element, maxDegree = 8) {
  if (!element || !hasPointerFine || prefersReducedMotion) return;

  function onMouseMove(e) {
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotX = (-y * maxDegree).toFixed(2);
    const rotY = (x * maxDegree).toFixed(2);

    element.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  }

  function onMouseLeave() {
    element.style.transition = 'transform 0.4s ease';
    element.style.transform = '';
    setTimeout(() => {
      element.style.transition = '';
    }, 400);
  }

  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);
}

/**
 * Custom Cursor Initializer (Desktop only)
 */
export function initCustomCursor() {
  if (!hasPointerFine || prefersReducedMotion) return;

  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  const interactives = document.querySelectorAll('a, button, .project-card, .skill-category, .cert-card, .stat-card, .timeline-card');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

/**
 * Loading Screen Controller: "INITIALIZING AMEEN.EXE"
 */
export function hideLoadingScreen(onComplete) {
  const loading = document.getElementById('loading-screen');
  if (!loading) {
    if (onComplete) onComplete();
    return;
  }

  const textEl = loading.querySelector('.loading-text-content');
  const barFill = loading.querySelector('.loading-bar-fill');
  const statusEl = loading.querySelector('.loading-status');

  const steps = [
    { text: 'INITIALIZING AMEEN.EXE', status: 'Verifying environment & modules...', progress: 25 },
    { text: 'LOADING FINANCIAL MODELS', status: 'Compiling portfolio datasets...', progress: 55 },
    { text: 'STARTING 3D ENGINE', status: 'Mounting Three.js render pipeline...', progress: 85 },
    { text: 'INITIALIZING AMEEN.EXE', status: 'System ready. Launching...', progress: 100 }
  ];

  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    if (currentStep < steps.length) {
      if (textEl) textEl.textContent = steps[currentStep].text;
      if (statusEl) statusEl.textContent = steps[currentStep].status;
      if (barFill) barFill.style.width = `${steps[currentStep].progress}%`;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        loading.classList.add('hide');
        setTimeout(() => {
          loading.style.display = 'none';
          if (onComplete) onComplete();
        }, 800);
      }, 400);
    }
  }, 450);

  // Set initial bar
  if (barFill) barFill.style.width = '20%';
}
