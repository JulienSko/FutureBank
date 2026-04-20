import { navigate, initNavigation }                          from './js/navigation.js';
import { renderDashboard }                                    from './js/pages/dashboard.js';
import { renderTransactions, exportCSV }                     from './js/pages/transactions.js';
import { saveApiKey, sendAI, askQuick }                        from './js/pages/ai.js';
import { saveBudgetEditor, addBudgetCategory, deleteBudgetCategory } from './js/pages/budget.js';
import { saveSettings, resetSettings }                        from './js/pages/settings.js';
import { saveEligibiliteForm, toggleEchelon, autoCalcEchelon } from './js/pages/eligibilite.js';
import { addSimMonth, deleteSimMonth, updateSolde }           from './js/pages/simulation.js';
import { openAddCompteModal, closeAddCompteModal, addCompte, deleteCompte } from './js/pages/comptes.js';
import { loadAll, toggleTheme, resetAll }                     from './js/storage.js';

window.navigate              = navigate;
window.renderTransactions    = renderTransactions;
window.exportCSV             = exportCSV;
window.saveApiKey            = saveApiKey;
window.sendAI                = sendAI;
window.askQuick              = askQuick;
window.saveSettings          = saveSettings;
window.resetSettings         = resetSettings;
window.saveEligibiliteForm   = saveEligibiliteForm;
window.toggleEchelon         = toggleEchelon;
window.autoCalcEchelon       = autoCalcEchelon;
window.addSimMonth           = addSimMonth;
window.deleteSimMonth        = deleteSimMonth;
window.updateSolde           = updateSolde;
window.toggleTheme           = toggleTheme;
window.resetAll              = resetAll;
window.openAddCompteModal   = openAddCompteModal;
window.closeAddCompteModal  = closeAddCompteModal;
window.addCompte            = addCompte;
window.deleteCompte         = deleteCompte;

// Mobile sidebar
window.toggleSidebar = function() {
  document.querySelector(".sidebar").classList.toggle("open");
  document.getElementById("sidebarOverlay").classList.toggle("open");
};
window.closeSidebar = function() {
  document.querySelector(".sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay").classList.remove("open");
};
window.saveBudgetEditor      = saveBudgetEditor;
window.addBudgetCategory     = addBudgetCategory;
window.deleteBudgetCategory  = deleteBudgetCategory;

function initDate() {
  document.getElementById('topbarDate').textContent =
    new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function initThemeIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

loadAll();
initDate();
initThemeIcon();
initNavigation();
renderDashboard();
renderTransactions();
