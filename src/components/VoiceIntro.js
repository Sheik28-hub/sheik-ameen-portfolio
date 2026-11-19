/**
 * SHEIK AMEEN — AI VOICE INTRODUCTION
 * 
 * Script:
 * "Hello everyone! I'm Sheik Ameen. Welcome to my world, where Finance, Analytics and Technology come together."
 * 
 * Features:
 * - Natural Indian-English male voice selection via Web Speech API (with fallback)
 * - Play / Pause toggle controls
 * - Real-time animated soundwave bars
 * - Lip-sync and gesture synchronization with the 3D Avatar
 */

export default function initVoiceIntro(threeScene) {
  const introBtn = document.getElementById('voice-intro-btn');
  const soundwave = document.getElementById('soundwave-visualizer');
  const introTextEl = document.getElementById('voice-intro-status');

  if (!introBtn) return;

  const scriptText = "Hello everyone! I'm Sheik Ameen. Welcome to my world, where Finance, Analytics and Technology come together.";
  let isSpeaking = false;
  let currentUtterance = null;
  let synth = window.speechSynthesis;

  function getIndianEnglishVoice() {
    if (!synth) return null;
    const voices = synth.getVoices();
    // 1. First priority: Indian English Male (e.g., Ravi, Prabhat, Mohan)
    let selected = voices.find(v => (v.lang === 'en-IN' || v.lang === 'en_IN') && /male|ravi|prabhat|mohan/i.test(v.name));
    if (!selected) {
      selected = voices.find(v => v.lang === 'en-IN' || v.lang === 'en_IN');
    }
    // 2. Second priority: Natural English Male (e.g., George, Guy, David, Daniel)
    if (!selected) {
      selected = voices.find(v => v.lang.startsWith('en') && /male|george|david|daniel|guy|natural/i.test(v.name));
    }
    // 3. Fallback: Any English voice
    if (!selected) {
      selected = voices.find(v => v.lang.startsWith('en'));
    }
    return selected || (voices.length > 0 ? voices[0] : null);
  }

  // Pre-fetch voices on load
  if (synth) {
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => {
        getIndianEnglishVoice();
      };
    }
  }

  function startSpeaking() {
    if (!synth) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    synth.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(scriptText);
    currentUtterance = utterance;

    const voice = getIndianEnglishVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.pitch = 0.98;
    utterance.rate = 0.95;

    utterance.onstart = () => {
      isSpeaking = true;
      introBtn.classList.add('playing');
      introBtn.setAttribute('aria-label', 'Pause Voice Introduction');
      const btnLabel = introBtn.querySelector('.voice-btn-text');
      if (btnLabel) btnLabel.textContent = 'Pause AI Intro';
      if (soundwave) soundwave.classList.add('active');
      if (introTextEl) introTextEl.textContent = 'Speaking...';

      // Trigger Avatar Lip-Sync & Head Gestures
      if (threeScene && threeScene.setAvatarSpeaking) {
        threeScene.setAvatarSpeaking(true);
      }
    };

    utterance.onend = () => {
      stopSpeaking();
    };

    utterance.onerror = () => {
      stopSpeaking();
    };

    synth.speak(utterance);
  }

  function stopSpeaking() {
    if (synth) synth.cancel();
    isSpeaking = false;
    introBtn.classList.remove('playing');
    introBtn.setAttribute('aria-label', 'Play Voice Introduction');
    const btnLabel = introBtn.querySelector('.voice-btn-text');
    if (btnLabel) btnLabel.textContent = 'Listen to AI Intro';
    if (soundwave) soundwave.classList.remove('active');
    if (introTextEl) introTextEl.textContent = 'AI Voice Introduction';

    // Stop Avatar Lip-Sync
    if (threeScene && threeScene.setAvatarSpeaking) {
      threeScene.setAvatarSpeaking(false);
    }
  }

  introBtn.addEventListener('click', () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      startSpeaking();
    }
  });

  // Stop speech if page is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isSpeaking) {
      stopSpeaking();
    }
  });
}
