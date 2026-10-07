// Theme handling for light/dark mode based on OS preference and user choice.
const THEME_KEY = 'streak-tracker-theme';
const root = document.documentElement;

function getSystemThemePreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  const selectedTheme = theme || getSystemThemePreference();
  root.setAttribute('data-theme', selectedTheme);
  localStorage.setItem(THEME_KEY, selectedTheme);

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.querySelector('.theme-icon').textContent = selectedTheme === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label', selectedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const preferredTheme = savedTheme || getSystemThemePreference();
  applyTheme(preferredTheme);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener?.('change', (event) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
    });
  }
}

initializeTheme();
