/**
 * SlimedOut — Duel Modal
 * Full-screen overlay with Google Maps arena and a simple countdown timer.
 */

(() => {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────────
  const MAPS_API_KEY = window.CONFIG?.MAPS_API_KEY;

  // ── STATE ──────────────────────────────────────────────────
  let state = {
    isOpen: false,
    timerSeconds: 3600,
    timerInterval: null,
    userLocation: null,
    participants: null,
    theme: 'dark'
  };



  // ── GLASS FILTER (SVG) ────────────────────────────────────
  function injectGlassFilter() {
    if (document.getElementById('slime-glass-filter')) return;
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.id = 'slime-glass-filter';
    svg.style.display = 'none';
    svg.innerHTML = `
      <filter id="glass-distortion" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="1" seed="17" result="turbulence" />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
        <feDisplacementMap in="SourceGraphic" in2="softMap" scale="30" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    `;
    document.body.appendChild(svg);
  }

  // ── BUILD DOM ─────────────────────────────────────────────
  function buildModal() {
    // Prevent duplicate
    if (document.getElementById('slimed-out-modal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'slimed-out-modal';
    overlay.className = 'slime-modal-overlay';
    // Minimal DOM: A map container, and a centered card overlay.
    overlay.innerHTML = `
      <div class="slime-modal-container">
        <!-- MAP -->
        <div class="slime-map-container" id="slime-map-container">
          <div class="slime-map-loading">
            <span>Acquiring target coordinates...</span>
          </div>
        </div>

        <!-- TIMER CARD (Floating over map) -->
        <div class="slime-timer-card" id="slime-timer-card">
          <!-- Glass Layers from reference -->
          <div class="slime-glass-layer slime-glass-distort"></div>
          <div class="slime-glass-layer slime-glass-tint"></div>
          <div class="slime-glass-layer slime-glass-gloss"></div>
          
          <div class="slime-timer-flex-container">
            <div class="slime-timer-content">
              <div class="slime-spotlight" id="slime-spotlight"></div>
              <div class="slime-timer-header">TIME REMAINING</div>
              <div class="slime-timer-digits" id="slime-timer-digits">60:00</div>
            </div>

            <!-- ACTION MENU -->
            <div class="slime-action-bar">
              <div class="slime-menu-divider"></div>
              <div class="slime-action-menu">
                <button class="slime-menu-btn" id="slime-theme-toggle" title="Toggle Theme">
                  <svg class="slime-icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"/></svg>
                  <svg class="slime-icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                </button>
                <button class="slime-menu-btn" id="slime-info-btn" title="Match Info">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    attachEventListeners(overlay);
  }

  // ── EVENT LISTENERS ───────────────────────────────────────
  function attachEventListeners(overlay) {
    const timerCard = overlay.querySelector('#slime-timer-card');
    const themeToggle = overlay.querySelector('#slime-theme-toggle');
    const infoBtn = overlay.querySelector('#slime-info-btn');

    // Initial theme class
    timerCard.classList.add(`slime-theme-${state.theme}`);

    // Theme Toggle
    themeToggle.addEventListener('click', () => toggleTheme(timerCard));

    // Info Button
    infoBtn.addEventListener('click', () => {
      console.log('[SlimedOut] Info clicked');
      // Tooltip logic later
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isOpen) close();
    });

    // Tilt Effect
    if (timerCard) {
      setupTilt(timerCard);
    }
  }

  /**
   * Vanilla JS Tilt Implementation — replicated from the requested React component.
   */
  function setupTilt(card) {
    const spotlight = card.querySelector('#slime-spotlight');
    const tiltLimit = 15;
    const perspective = 1200;
    const scale = 1.05;

    function handleMove(e) {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      // "Evade" direction logic
      const xRot = (py - 0.5) * (tiltLimit * 2) * -1;
      const yRot = (px - 0.5) * -(tiltLimit * 2) * -1;

      // CRITICAL: We must maintain the translate(-50%, 0) from CSS to keep it centered!
      card.style.transform = `translate(-50%, 0) perspective(${perspective}px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(${scale}, ${scale}, ${scale})`;
      
      if (spotlight) {
        spotlight.style.opacity = '1';
        spotlight.style.left = `${px * 100}%`;
        spotlight.style.top = `${py * 100}%`;
      }
    }

    function handleLeave() {
      card.style.transform = `translate(-50%, 0) perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      if (spotlight) spotlight.style.opacity = '0';
    }

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
  }

  // ── TIMER ─────────────────────────────────────────────────
  function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);

    state.timerInterval = setInterval(() => {
      if (state.timerSeconds > 0) {
        state.timerSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(state.timerInterval);
        handleTimerEnd();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const digits = document.getElementById('slime-timer-digits');
    if (digits) {
      digits.textContent = formatTime(state.timerSeconds);
    }
  }

  function handleTimerEnd() {
    const digits = document.getElementById('slime-timer-digits');
    if (digits) digits.textContent = '00:00';
  }

  // ── UTILITIES ──────────────────────────────────────────────
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // ── MAP ───────────────────────────────────────────────────
  function initMap() {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported.');
      injectMapIframe();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.userLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        injectMapIframe();
      },
      () => {
        // Fallback to NYC
        state.userLocation = { lat: 40.7128, lng: -74.006 };
        injectMapIframe();
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }

  function injectMapIframe() {
    const container = document.getElementById('slime-map-container');
    if (!container) return;
    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('sandbox.html');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    iframe.onload = () => {
      iframe.contentWindow.postMessage({
        type: 'INIT_MAP',
        payload: {
          apiKey: MAPS_API_KEY,
          userLocation: state.userLocation || { lat: 40.7128, lng: -74.006 },
          participants: state.participants,
          theme: state.theme
        }
      }, '*');
    };

    container.appendChild(iframe);
  }

  // ── OPEN / CLOSE ──────────────────────────────────────────
  function open(participants) {
    if (state.isOpen) return;
    state.isOpen = true;
    state.participants = participants;
    state.timerSeconds = 3600;

    injectGlassFilter();
    buildModal();

    const overlay = document.getElementById('slimed-out-modal');
    if (!overlay) return;

    requestAnimationFrame(() => {
      overlay.classList.add('slime-modal-visible');
    });

    document.body.style.overflow = 'hidden';

    updateTimerDisplay();
    startTimer();
    initMap();
  }

  function close() {
    state.isOpen = false;

    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }



    const overlay = document.getElementById('slimed-out-modal');
    if (overlay) {
      overlay.classList.remove('slime-modal-visible');
      setTimeout(() => overlay.remove(), 300);
    }

    document.body.style.overflow = '';
  }

  function toggleTheme(card) {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    
    card.classList.remove('slime-theme-dark', 'slime-theme-light');
    card.classList.add(`slime-theme-${state.theme}`);

    // Toggle icons
    const sun = card.querySelector('.slime-icon-sun');
    const moon = card.querySelector('.slime-icon-moon');
    if (state.theme === 'dark') {
      sun.style.display = 'block';
      moon.style.display = 'none';
    } else {
      sun.style.display = 'none';
      moon.style.display = 'block';
    }

    // Inform sandbox
    const iframe = document.querySelector('.slime-map-container iframe');
    if (iframe) {
      iframe.contentWindow.postMessage({
        type: 'CHANGE_THEME',
        payload: { theme: state.theme }
      }, '*');
    }
  }

  // ── PUBLIC API ────────────────────────────────────────────
  window.SlimeModal = { open, close };

})();
