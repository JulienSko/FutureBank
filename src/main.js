// ── JS ───────────────────────────────────────────────────
import { navigate, initNavigation } from './js/navigation.js';
import { renderDashboard }          from './js/pages/dashboard.js';
import { renderTransactions }       from './js/pages/transactions.js';
import { saveApiKey, sendAI, askQuick } from './js/pages/ai.js';
import { saveSettings, resetSettings }  from './js/pages/settings.js';

// Expose les fonctions appelées depuis les attributs onclick du HTML
window.navigate           = navigate;
window.renderTransactions = renderTransactions;
window.saveApiKey         = saveApiKey;
window.sendAI             = sendAI;
window.askQuick           = askQuick;
window.saveSettings       = saveSettings;
window.resetSettings      = resetSettings;

// ── INIT ─────────────────────────────────────────────────
function initDate() {
  document.getElementById('topbarDate').textContent =
    new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

initDate();
initNavigation();
renderDashboard();
renderTransactions();
