import { renderBudget }          from './pages/budget.js';
import { renderRecommandations } from './pages/recommandations.js';
import { renderAides }           from './pages/aides.js';
import { loadSettingsForm }      from './pages/settings.js';

export const pageNames = {
  dashboard:       'Tableau de bord',
  transactions:    'Transactions',
  budget:          'Budget prévisionnel',
  conseiller:      'Conseiller IA',
  recommandations: 'Recommandations',
  aides:           'Aides & Subventions',
  compte:          'Paramètres du compte',
};

export function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  document.getElementById('topbarTitle').textContent = pageNames[page];

  if (page === 'recommandations') renderRecommandations();
  if (page === 'aides')           renderAides();
  if (page === 'budget')          renderBudget();
  if (page === 'compte')          loadSettingsForm();
}

export function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });
}
