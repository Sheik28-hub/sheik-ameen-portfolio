/**
 * SHEIK AMEEN PORTFOLIO — PREMIUM ANIMATION & FINANCIAL INTERACTION UTILITIES
 * Pillars: Interactive Experience & Financial Visualizations
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

  const interactives = document.querySelectorAll('a, button, .project-card, .skill-category, .cert-card, .stat-card, .timeline-card, .calc-slider, .scenario-btn');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

/**
 * Interactive Live DCF & Financial Valuation Calculator with Scenario Switcher
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

  const scenarioBtns = document.querySelectorAll('.scenario-btn');

  if (!waccSlider || !growthSlider || !revenueSlider || !outputEl) return;

  function calculateValuation() {
    const wacc = parseFloat(waccSlider.value);
    const g = parseFloat(growthSlider.value);
    const rev = parseFloat(revenueSlider.value);

    if (waccVal) waccVal.textContent = `${wacc.toFixed(1)}%`;
    if (growthVal) growthVal.textContent = `${g.toFixed(1)}%`;
    if (revenueVal) revenueVal.textContent = `₹${rev.toLocaleString('en-IN')} Cr`;

    // Normalized Free Cash Flow (18% margin on revenue)
    const fcf = rev * 0.18;
    const discountRate = (wacc - g) / 100;
    
    const impliedEv = discountRate > 0.01 ? (fcf * (1 + g / 100)) / discountRate : 2500;
    const impliedEquity = Math.round(impliedEv);
    outputEl.textContent = `₹${impliedEquity.toLocaleString('en-IN')} Cr`;

    // 5-Year Forward Cash Flow Projections
    const y1 = Math.round(fcf);
    const y2 = Math.round(y1 * (1 + g / 100));
    const y3 = Math.round(y2 * (1 + g / 100));
    const y4 = Math.round(y3 * (1 + g / 100));
    const y5 = Math.round(y4 * (1 + g / 100));

    const fcfVals = [y1, y2, y3, y4, y5];
    const maxVal = Math.max(...fcfVals, 350);

    for (let yr = 1; yr <= 5; yr++) {
      const barFill = document.getElementById(`fcf-bar-${yr}`);
      const valEl = document.getElementById(`fcf-val-${yr}`);
      if (barFill) {
        const pct = Math.min(95, Math.max(25, (fcfVals[yr - 1] / maxVal) * 88));
        barFill.style.height = `${pct.toFixed(0)}%`;
      }
      if (valEl) {
        valEl.textContent = fcfVals[yr - 1];
      }
    }

    if (statusEl) {
      if (impliedEquity >= 4500) {
        statusEl.textContent = '● Premium Valuation · Strong Growth Upside';
        statusEl.style.color = '#10B981';
      } else if (impliedEquity >= 2200) {
        statusEl.textContent = '● Fair Value · Stable Operating Cash Flow';
        statusEl.style.color = '#00D4FF';
      } else {
        statusEl.textContent = '● Conservative / Stressed Macro Scenario';
        statusEl.style.color = '#F59E0B';
      }
    }
  }

  // Sliders input listener
  waccSlider.addEventListener('input', () => {
    scenarioBtns.forEach(btn => btn.classList.remove('active'));
    calculateValuation();
  });
  growthSlider.addEventListener('input', () => {
    scenarioBtns.forEach(btn => btn.classList.remove('active'));
    calculateValuation();
  });
  revenueSlider.addEventListener('input', () => {
    scenarioBtns.forEach(btn => btn.classList.remove('active'));
    calculateValuation();
  });

  // Scenario Buttons (Base, Bull, Bear)
  const scenarios = {
    base: { wacc: 10.5, g: 3.0, rev: 1500 },
    bull: { wacc: 9.2, g: 4.2, rev: 2200 },
    bear: { wacc: 13.0, g: 2.0, rev: 1100 }
  };

  scenarioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const scKey = btn.getAttribute('data-scenario');
      const sc = scenarios[scKey];
      if (sc) {
        waccSlider.value = sc.wacc;
        growthSlider.value = sc.g;
        revenueSlider.value = sc.rev;
        calculateValuation();
      }
    });
  });

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
    { text: 'COMPUTING 3D ENVIRONMENT', status: 'Rendering Three.js market globe & orbital rings...', progress: 88 },
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

      const actionsEl = document.getElementById('loading-actions');
      const startBtn = document.getElementById('start-experience-btn');
      const skipBtn = document.getElementById('skip-experience-btn');

      const dismissScreen = (startCinematic) => {
        loading.classList.add('hide');
        setTimeout(() => {
          loading.style.display = 'none';
          if (onComplete) onComplete(startCinematic);
        }, 700);
      };

      if (actionsEl && startBtn && skipBtn) {
        actionsEl.style.display = 'flex';

        startBtn.addEventListener('click', () => {
          dismissScreen(true);
        }, { once: true });

        skipBtn.addEventListener('click', () => {
          dismissScreen(false);
        }, { once: true });
      } else {
        setTimeout(() => {
          dismissScreen(false);
        }, 450);
      }
    }
  }, 350);

  if (barFill) barFill.style.width = '20%';
}

/**
 * 10. Magnetic Button Hover Physics
 * Subtle spring attraction toward cursor for premium tactile feel
 */
export function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const buttons = document.querySelectorAll('.btn, .nav-cta-btn, .scenario-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
}

/**
 * 11. Live Global Financial Telemetry Clock
 * Displays real-time IST time and live BSE/NSE trading market status
 */
export function initMarketClock() {
  const telemetryEls = document.querySelectorAll('.market-clock-telemetry');
  if (!telemetryEls.length) return;

  function updateClock() {
    const now = new Date();
    // IST = UTC + 5:30
    const istTotalMin = now.getUTCHours() * 60 + now.getUTCMinutes() + 330;
    const istHours = Math.floor(istTotalMin / 60) % 24;
    const istMinutes = istTotalMin % 60;
    const istSeconds = now.getUTCSeconds();

    const timeStr = `${String(istHours).padStart(2, '0')}:${String(istMinutes).padStart(2, '0')}:${String(istSeconds).padStart(2, '0')} IST`;

    // NSE Trading Session: 09:15 - 15:30 IST on Mon-Fri
    const day = now.getUTCDay();
    const isWeekday = day >= 1 && day <= 5;
    const istDecimal = istHours + istMinutes / 60;
    const isNSEOpen = isWeekday && istDecimal >= 9.25 && istDecimal <= 15.5;

    const htmlContent = `<span class="market-time">${timeStr}</span> · <span class="${isNSEOpen ? 'market-open' : 'market-closed'}">${isNSEOpen ? '● NSE OPEN' : '○ NSE CLOSED'}</span>`;

    telemetryEls.forEach((el) => {
      el.innerHTML = htmlContent;
    });
  }

  updateClock();
  setInterval(updateClock, 1000);
}
