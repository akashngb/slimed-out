/**
 * SlimedOut — Content Script
 * Injects a red "Slime" button next to LinkedIn's Connect/Message button.
 * Uses MutationObserver to survive React re-renders.
 *
 * LinkedIn uses hashed/obfuscated CSS class names that change constantly.
 * We anchor on stable semantic attributes: aria-labels, data attributes,
 * and structural DOM position instead of fragile class names.
 */

(() => {
  'use strict';

  const SLIME_BTN_ID = 'slimed-out-btn';

  /**
   * Find the primary action button (Connect / Message / Follow / Unfollow)
   * using aria-label attributes — these are stable across LinkedIn deploys.
   */
  function findActionButton() {
    const ariaLabels = [
      'Message', 'Connect', 'Follow', 'Unfollow',
      'Pending', 'More actions'
    ];
    
    // Only look within the main top card area to avoid header nav buttons
    const topCard = document.querySelector('main');
    if (!topCard) return null;

    for (const label of ariaLabels) {
      // Look for the primary action button
      const btn = topCard.querySelector(`button[aria-label^="${label}"]`) || 
                  topCard.querySelector(`button[aria-label*="${label}"]`);
      if (btn) return btn;
    }
    
    // Fallback: any button inside the top card
    return topCard.querySelector('button');
  }

  /**
   * Extract profile data using stable semantic selectors.
   * LinkedIn has switched from h1 to h2 for the name in recent updates.
   */
  function extractProfileData() {
    // Name: try h1 first, then h2
    const nameEl =
      document.querySelector('h1') ||
      document.querySelector('h2');

    // Headline
    const headlineEl =
      document.querySelector('[data-generated-suggestion-target]') ||
      document.querySelector('div[class*="headline"]') ||
      document.querySelector('div[class*="subline"]') ||
      (() => {
        const nameParent = nameEl ? nameEl.closest('section, div[class*="top"]') : null;
        if (nameParent) {
          const paras = nameParent.querySelectorAll('div, span');
          for (const p of paras) {
            if (p !== nameEl && p.children.length === 0 && p.innerText && p.innerText.trim().length > 5) {
              return p;
            }
          }
        }
        return null;
      })();

    // Profile photo
    const photoEl =
      document.querySelector('img[class*="profile-photo"]') ||
      document.querySelector('img[class*="photo"]') ||
      document.querySelector('button[aria-label*="photo"] img') ||
      document.querySelector('button[aria-label*="profile"] img') ||
      document.querySelector('.pv-top-card-profile-picture__image--show') ||
      document.querySelector('section img[src*="profile-displayphoto"]') ||
      document.querySelector('img[src*="media.licdn.com"]');

    // Seeker (Current User) info
    const seekerPhotoEl = 
      document.querySelector('.global-nav__me-photo') ||
      document.querySelector('img[alt="Me"]') ||
      document.querySelector('button[aria-label="Me"] img') ||
      document.querySelector('.global-nav__me img');
    const seekerNameEl = document.querySelector('.global-nav__me-title'); // Sometimes hidden, but let's try

    return {
      opponent: {
        name: nameEl ? nameEl.innerText.trim().split('\n')[0] : 'Challenger',
        headline: headlineEl ? headlineEl.innerText.trim().split('\n')[0] : 'LinkedIn User',
        photo: photoEl ? photoEl.src : null
      },
      seeker: {
        name: seekerNameEl ? seekerNameEl.innerText.trim() : 'You',
        photo: seekerPhotoEl ? seekerPhotoEl.src : null
      }
    };
  }

  /**
   * Create the Slime button element explicitly matching the target CSS.
   */
  function createSlimeButton() {
    const btn = document.createElement('a');
    btn.id = SLIME_BTN_ID;
    btn.className = 'slime-native-btn slime-override';
    btn.setAttribute('aria-label', 'Slime this person');
    btn.setAttribute('href', '#'); // Prevent default on click

    btn.innerHTML = `
      <span class="slime-native-btn__inner">
        <svg xmlns="http://www.w3.org/2000/svg" id="slime-small" fill="currentColor" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" class="slime-native-btn__icon">
          <path d="M9 4a3 3 0 1 1-3-3 3 3 0 0 1 3 3M6.75 8h-1.5A2.25 2.25 0 0 0 3 10.25V15h6v-4.75A2.25 2.25 0 0 0 6.75 8M13 8V6h-1v2h-2v1h2v2h1V9h2V8z"></path>
        </svg>
        <div class="slime-native-btn__text-wrap">
          <span class="slime-native-btn__text">Slime</span>
        </div>
      </span>
    `;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const profileData = extractProfileData();
      if (window.SlimeModal) {
        window.SlimeModal.open(profileData);
      } else {
        console.error('[SlimedOut] Modal module not loaded.');
      }
    });

    return btn;
  }

  /**
   * Attempt to inject the Slime button into the LinkedIn profile action bar.
   * Returns true if injected successfully.
   */
  function injectButton() {
    // Check if we already injected it and it's still in the DOM
    if (document.getElementById(SLIME_BTN_ID)) return true;

    // Only run on profile pages
    if (!location.pathname.startsWith('/in/')) return false;

    const actionBtn = findActionButton();
    if (!actionBtn) return false;

    // Create the button
    const slimeBtn = createSlimeButton();

    // NEW: Climb to the shared flex container for all buttons
    // LinkedIn often wraps individual buttons in single-column grids.
    // We aim for the parent that holds multiple action items (Follow, Message, etc.)
    let container = actionBtn.parentElement;
    
    // Safety: don't climb above the header area
    let depth = 0;
    while (container && container.tagName !== 'SECTION' && depth < 5) {
      // If we find a parent that has 2+ children (likely the bar), or is the main row, stop.
      if (container.children.length > 1) break;
      container = container.parentElement;
      depth++;
    }

    if (!container) container = actionBtn.parentNode;

    // Append to the shared container to maintain horizontal flow
    container.appendChild(slimeBtn);

    return true;
  }

  /**
   * Set up MutationObserver to re-inject button when LinkedIn's SPA
   * re-renders the DOM. We do NOT use debounce for this, because debounce
   * causes the button to 'flicker' out and in when React aggressively replacing nodes.
   */
  function setupObserver() {
    const observer = new MutationObserver(() => {
      // We check for absence synchronously, so if React just detached it,
      // it is put back literally entirely in the same frame render step.
      if (!document.getElementById(SLIME_BTN_ID)) {
        injectButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Handle LinkedIn SPA navigation by listening to URL changes.
   */
  function setupNavigationListener() {
    let lastUrl = location.href;

    const urlObserver = new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        // On navigation, try injection once the URL updates
        setTimeout(() => injectButton(), 100);
      }
    });

    urlObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ── INIT ──────────────────────────────────────────────────
  function init() {
    // Initial injection attempt
    if (!injectButton()) {
      let attempts = 0;
      const retryInterval = setInterval(() => {
        attempts++;
        if (injectButton() || attempts > 20) {
          clearInterval(retryInterval);
        }
      }, 50); // Aggressive retry until it finds the layout
    }

    // Watch for DOM changes (React re-renders)
    setupObserver();

    // Watch for SPA navigation
    setupNavigationListener();
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

