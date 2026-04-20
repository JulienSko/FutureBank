import { renderBudget }           from './pages/budget.js';
import { renderRecommandations }  from './pages/recommandations.js';
import { renderAides }            from './pages/aides.js';
import { loadSettingsForm }       from './pages/settings.js';
import { loadEligibiliteForm, renderEligibiliteSummary } from './pages/eligibilite.js';
import { renderSimulation }       from './pages/simulation.js';
import { renderComptes }          from './pages/comptes.js';

export const pageNames = {
  dashboard:       'Tableau de bord',
  comptes:         'Mes comptes',
  transactions:    'Transactions',
  budget:          'Budget prévisionnel',
  conseiller:      'Conseiller IA Étudiant',
  recommandations: 'Recommandations',
  aides:           'Aides Étudiantes',
  eligibilite:     'Mon Profil Étudiant',
  simulation:      'Ma Simulation Bancaire',
  compte:          'Paramètres du compte',
};

export function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  document.getElementById('topbarTitle').textContent = pageNames[page];

  // Sync mobile bottom nav
  document.querySelectorAll('.mobile-nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });

  // Close sidebar on mobile
  if (window.closeSidebar) window.closeSidebar();

  if (page === 'recommandations') renderRecommandations();
  if (page === 'aides')           renderAides();
  if (page === 'budget')          renderBudget();
  if (page === 'compte')          loadSettingsForm();
  if (page === 'eligibilite')     { loadEligibiliteForm(); renderEligibiliteSummary(); }
  if (page === 'simulation')      renderSimulation();
  if (page === 'comptes')         renderComptes();
}

export function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });
}
