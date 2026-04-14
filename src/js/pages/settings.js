import { state, categories } from '../data.js';
import { renderDashboard } from './dashboard.js';

export function loadSettingsForm() {
  document.getElementById('settPrenom').value          = state.prenom;
  document.getElementById('settNom').value             = state.nom;
  document.getElementById('settSolde').value           = state.solde;
  document.getElementById('settRevenus').value         = state.revenus;
  document.getElementById('settLoyer').value           = state.loyer;
  document.getElementById('settObjectifEpargne').value = state.objectifEpargne;
  document.getElementById('settProfil').value          = state.profil;
  document.getElementById('settFamille').value         = state.famille;
  document.getElementById('settObjectif').value        = state.objectif;
  document.getElementById('settHorizon').value         = state.horizon;
}

export function saveSettings() {
  state.prenom          = document.getElementById('settPrenom').value;
  state.nom             = document.getElementById('settNom').value;
  state.solde           = parseFloat(document.getElementById('settSolde').value) || 0;
  state.revenus         = parseFloat(document.getElementById('settRevenus').value) || 0;
  state.loyer           = parseFloat(document.getElementById('settLoyer').value) || 0;
  state.objectifEpargne = parseFloat(document.getElementById('settObjectifEpargne').value) || 0;
  state.profil          = document.getElementById('settProfil').value;
  state.famille         = document.getElementById('settFamille').value;
  state.objectif        = document.getElementById('settObjectif').value;
  state.horizon         = document.getElementById('settHorizon').value;

  const initials = (state.prenom[0] || '') + (state.nom[0] || '');
  document.getElementById('avatarInitials').textContent = initials.toUpperCase();
  document.getElementById('sidebarName').textContent    = state.prenom + ' ' + state.nom;

  categories[0].depenses = state.loyer;
  renderDashboard();

  const alertEl = document.getElementById('saveAlert');
  alertEl.style.display = 'flex';
  setTimeout(() => { alertEl.style.display = 'none'; }, 3000);
}

export function resetSettings() {
  loadSettingsForm();
}
