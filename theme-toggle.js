/**
 * Mahi Shopy Universal Dark/Light Theme Controller & Right-Corner Component
 */
(function(window, document) {
  'use strict';

  const STORAGE_KEY = 'mahi_theme_mode';
  const DEFAULT_THEME = 'dark';

  function getStoredTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (e) {
      console.warn('LocalStorage error reading theme:', e);
    }
    return DEFAULT_THEME;
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
    }
    updateToggleButton(theme);
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('LocalStorage error saving theme:', e);
    }
    window.dispatchEvent(new CustomEvent('mahiThemeChanged', { detail: { theme } }));
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
    return next;
  }

  function ensureStylesheet() {
    if (document.getElementById('mahi-theme-stylesheet')) return;
    
    // Find appropriate relative path to theme-toggle.css
    const isSubdir = window.location.pathname.includes('/user/') || window.location.pathname.includes('/admin/');
    const cssPath = isSubdir ? '../theme-toggle.css' : 'theme-toggle.css';

    const link = document.createElement('link');
    link.id = 'mahi-theme-stylesheet';
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
  }

  function createToggleButton() {
    if (document.getElementById('mahiThemeToggleBtn')) return;

    const btn = document.createElement('button');
    btn.className = 'mahi-theme-toggle-btn';
    btn.id = 'mahiThemeToggleBtn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle light and dark mode');
    btn.title = 'Switch between Dark and Light mode';

    const iconSlot = document.createElement('span');
    iconSlot.className = 'mahi-theme-icon-slot';
    iconSlot.id = 'mahiThemeIconSlot';

    const label = document.createElement('span');
    label.className = 'mahi-theme-label';
    label.id = 'mahiThemeLabel';

    btn.appendChild(iconSlot);
    btn.appendChild(label);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });

    // Check if an explicit slot or a header exists
    const explicitSlot = document.getElementById('themeToggleSlot');
    const headerActions = document.querySelector('.header-right-actions') || document.querySelector('.header-actions');
    const header = document.querySelector('header');
    const logoutBtn = document.getElementById('logoutBtn');

    if (explicitSlot) {
      explicitSlot.appendChild(btn);
    } else if (headerActions) {
      headerActions.insertBefore(btn, headerActions.firstChild);
    } else if (logoutBtn && logoutBtn.parentNode) {
      // Place right before or after the logout button in header
      logoutBtn.parentNode.insertBefore(btn, logoutBtn);
    } else if (header) {
      const container = document.createElement('div');
      container.className = 'mahi-theme-toggle-header-wrapper';
      container.appendChild(btn);
      header.appendChild(container);
    } else {
      // Standalone floating toggle on corner for portal / login / signup
      const container = document.createElement('div');
      container.className = 'mahi-theme-toggle-container';
      container.id = 'mahiThemeToggleContainer';
      container.appendChild(btn);
      document.body.appendChild(container);
    }

    const current = document.documentElement.getAttribute('data-theme') || getStoredTheme();
    updateToggleButton(current);
  }

  function updateToggleButton(theme) {
    const iconSlot = document.getElementById('mahiThemeIconSlot');
    const label = document.getElementById('mahiThemeLabel');
    if (!iconSlot || !label) return;

    if (theme === 'light') {
      iconSlot.textContent = '☀️';
      label.textContent = 'Light';
    } else {
      iconSlot.textContent = '🌙';
      label.textContent = 'Dark';
    }
  }

  // Initial immediate application to prevent flash of wrong theme
  const initialTheme = getStoredTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  // Initialize DOM-dependent elements
  function init() {
    ensureStylesheet();
    applyTheme(initialTheme);
    createToggleButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  window.MahiTheme = {
    getTheme: () => document.documentElement.getAttribute('data-theme') || getStoredTheme(),
    setTheme: (t) => { applyTheme(t); saveTheme(t); },
    toggleTheme: toggleTheme
  };

})(window, document);
