import { state, categories, accountHistory, accounts } from './data.js';

export function saveAll() {
  try {
    localStorage.setItem('fb_state',      JSON.stringify(state));
    localStorage.setItem('fb_categories', JSON.stringify(categories));
    localStorage.setItem('fb_history',    JSON.stringify(accountHistory));
    localStorage.setItem('fb_theme',      document.documentElement.getAttribute('data-theme') || 'light');
  } catch (e) {
    console.warn('FutureBank: impossible de sauvegarder', e);
  }
}

export function loadAll() {
  try {
    const savedState = localStorage.getItem('fb_state');
    if (savedState) Object.assign(state, JSON.parse(savedState));

    const savedCats = localStorage.getItem('fb_categories');
    if (savedCats) {
      const cats = JSON.parse(savedCats);
      categories.splice(0, categories.length, ...cats);
    }

    const savedAccounts = localStorage.getItem('fb_accounts');
    if (savedAccounts) {
      const accs = JSON.parse(savedAccounts);
      accounts.splice(0, accounts.length, ...accs);
    }

    const savedHistory = localStorage.getItem('fb_history');
    if (savedHistory) {
      const hist = JSON.parse(savedHistory);
      accountHistory.splice(0, accountHistory.length, ...hist);
    }

    const savedTheme = localStorage.getItem('fb_theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {
    console.warn('FutureBank: impossible de charger les données', e);
  }
}

export function toggleTheme() {
  const html    = document.documentElement;
  const isDark  = html.getAttribute('data-theme') === 'dark';
  const next    = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  document.getElementById('themeToggle').textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('fb_theme', next);
}

export function resetAll() {
  localStorage.clear();
  location.reload();
}
