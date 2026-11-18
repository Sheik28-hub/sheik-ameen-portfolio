import { createScrollObserver } from '../utils/animations.js';

/**
 * CONTACT COMPONENT
 * Handles scroll reveals, copy email functionality with clipboard feedback, and external links.
 */

export default function initContact() {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  createScrollObserver('#contact .reveal');

  // Copy Email Button Functionality
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'ameensheik2902@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <span class="contact-btn-icon">✓</span>
          <span>Email Copied!</span>
        `;
        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.classList.remove('copied');
        }, 2200);
      } catch (err) {
        // Fallback for older browsers or restricted permissions
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = `
            <span class="contact-btn-icon">✓</span>
            <span>Email Copied!</span>
          `;
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `
              <span class="contact-btn-icon">📋</span>
              <span>Copy Email</span>
            `;
          }, 2200);
        } catch (e) {
          window.location.href = `mailto:${email}`;
        }
        document.body.removeChild(textArea);
      }
    });
  }
}
