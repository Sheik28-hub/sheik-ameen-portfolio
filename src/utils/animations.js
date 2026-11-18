/**
 * SHEIK AMEEN PORTFOLIO — PREMIUM ANIMATION & INTERACTION UTILITIES
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
export function add3DTilt(element, maxDegree = 7) {
  if (!element || !hasPointerFine || prefersReducedMotion) return;

  function onMouseMove(e) {
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotX = (-y * maxDegree).toFixed(2);
    const rotY = (x * maxDegree).toFixed(2);

    element.style.transform = `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
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
 * Spotlight Mouse Follower on Cards (Vercel / Linear effect)
 */
export function initSpotlightCards() {
  if (!hasPointerFine || prefersReducedMotion) return;

  const cards = document.querySelectorAll('.spotlight-card, .project-card, .skill-category, .stat-card, .edu-card, .cert-card, .timeline-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
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

  const interactives = document.querySelectorAll('a, button, .project-card, .skill-category, .cert-card, .stat-card, .timeline-card, .calc-slider');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

/**
 * Interactive Live DCF & Financial Valuation Calculator
 */
export function initFinancialCalculator() {
  const waccSlider = document.getElementById('calc-wacc');
  const growthSlider = document.getElementById('calc-growth');
  const revenueSlider = document.getElementById('calc-revenue');

  const waccVal = document.getElementById('val-wacc');
  const growthVal = document.getElementById('val-growth');
  const revenueVal = document.getElementById('val-revenue');
  const outputEl = document.getElementById('calc-implied-equity');
  const statusEl = document.getElementById('calc-verdict');

  if (!waccSlider || !growthSlider || !revenueSlider || !outputEl) return;

  function calculateValuation() {
    const wacc = parseFloat(waccSlider.value); // e.g. 10.5%
    const g = parseFloat(growthSlider.value);   // e.g. 3.0%
    const rev = parseFloat(revenueSlider.value); // e.g. 1500 Cr

    if (waccVal) waccVal.textContent = `${wacc.toFixed(1)}%`;
    if (growthVal) growthVal.textContent = `${g.toFixed(1)}%`;
    if (revenueVal) revenueVal.textContent = `₹${rev.toLocaleString('en-IN')} Cr`;

    // Financial DCF Formula Approximation
    // Enterprise Value = (Normalized Free Cash Flow) / (WACC - g)
    // Assume 18% Free Cash Flow margin on Revenue
    const fcf = rev * 0.18;
    const discountRate = (wacc - g) / 100;
    
    // Prevent division by zero or negative
    const impliedEv = discountRate > 0.01 ? (fcf * (1 + g / 100)) / discountRate : 2500;
    
    // Implied Equity Value in Crores
    const impliedEquity = Math.round(impliedEv);
    outputEl.textContent = `₹${impliedEquity.toLocaleString('en-IN')} Cr`;

    if (statusEl) {
      if (impliedEquity > 3000) {
        statusEl.textContent = '● Premium Valuation · Strong Growth Upside';
        statusEl.style.color = '#10B981';
      } else if (impliedEquity >= 2000) {
        statusEl.textContent = '● Fair Value · Stable Operating Cash Flow';
        statusEl.style.color = '#00D4FF';
      } else {
        statusEl.textContent = '● Conservative / Stressed Macro Scenario';
        statusEl.style.color = '#F59E0B';
      }
    }
  }

  waccSlider.addEventListener('input', calculateValuation);
  growthSlider.addEventListener('input', calculateValuation);
  revenueSlider.addEventListener('input', calculateValuation);

  calculateValuation(); // Initial calculation
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
    { text: 'INITIALIZING AMEEN.EXE', status: 'Calibrating financial modeling engine...', progress: 28 },
    { text: 'SYNCHRONIZING PORTFOLIO', status: 'Mounting verified risk & valuation datasets...', progress: 60 },
    { text: 'COMPUTING 3D ENVIRONMENT', status: 'Rendering Three.js market terrain...', progress: 88 },
    { text: 'SYSTEM READY', status: 'Welcome to the portfolio.', progress: 100 }
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
      }, 350);
    }
  }, 420);

  if (barFill) barFill.style.width = '20%';
}
