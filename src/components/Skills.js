import { createScrollObserver, add3DTilt } from '../utils/animations.js';

/**
 * SKILLS COMPONENT
 * Advanced Interactive Capabilities:
 * - Dynamic Competency Search with Real-Time Cyan Highlights
 * - Category Tab Filtering (Finance, Risk, Analytics, BI)
 * - Match Counter & Reset
 * - Desktop 3D Tilt
 */

export default function initSkills() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  // 1. Observe category reveal on scroll
  createScrollObserver('#skills .reveal');

  // 2. Add subtle 3D tilt to skill category cards
  const skillCategories = document.querySelectorAll('.skill-category');
  skillCategories.forEach((cat) => {
    add3DTilt(cat, 6);
  });

  // 3. Category Tab Filtering
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedTab = btn.getAttribute('data-skill-tab');

      skillCategories.forEach((cat) => {
        const catDomain = cat.getAttribute('data-category');
        if (selectedTab === 'all' || catDomain === selectedTab) {
          cat.classList.remove('tab-hidden');
          cat.style.opacity = '0';
          cat.style.transform = 'translateY(12px) scale(0.98)';
          setTimeout(() => {
            cat.style.transition = 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
            cat.style.opacity = '1';
            cat.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          cat.classList.add('tab-hidden');
        }
      });
    });
  });

  // 4. Live Competency Search Input
  const searchInput = document.getElementById('skill-search-input');
  const searchClear = document.getElementById('skill-search-clear');
  const statusEl = document.getElementById('skills-search-status');
  const allSkillTags = document.querySelectorAll('.skill-tag');

  if (searchInput) {
    function performSearch() {
      const query = searchInput.value.trim().toLowerCase();

      if (searchClear) {
        if (query.length > 0) {
          searchClear.classList.add('visible');
        } else {
          searchClear.classList.remove('visible');
        }
      }

      if (!query) {
        // Reset highlights
        allSkillTags.forEach((tag) => {
          tag.classList.remove('search-match', 'search-dimmed');
        });
        if (statusEl) statusEl.textContent = '';
        return;
      }

      let matchCount = 0;

      allSkillTags.forEach((tag) => {
        const text = tag.textContent.toLowerCase();
        if (text.includes(query)) {
          tag.classList.add('search-match');
          tag.classList.remove('search-dimmed');
          matchCount++;
        } else {
          tag.classList.remove('search-match');
          tag.classList.add('search-dimmed');
        }
      });

      if (statusEl) {
        if (matchCount > 0) {
          statusEl.textContent = `● Found ${matchCount} matching competenc${matchCount === 1 ? 'y' : 'ies'}`;
          statusEl.style.color = '#00D4FF';
        } else {
          statusEl.textContent = `○ No exact match for "${searchInput.value}"`;
          statusEl.style.color = '#94A3B8';
        }
      }
    }

    searchInput.addEventListener('input', performSearch);

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        performSearch();
        searchInput.focus();
      });
    }
  }
}
