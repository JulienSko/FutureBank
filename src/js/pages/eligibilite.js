import { state } from '../data.js';
import { renderAides } from './aides.js';

export function loadEligibiliteForm() {
  document.getElementById('eligStatut').value          = state.statut || 'etudiant';
  document.getElementById('eligNiveau').value          = state.niveau || 'licence';
  document.getElementById('eligBoursier').value        = state.boursier ? 'oui' : 'non';
  document.getElementById('eligEchelon').value         = state.echelon || 0;
  document.getElementById('eligRevenuParental').value  = state.revenuParental || 0;
  document.getElementById('eligLogementCrous').value   = state.logementCrous ? 'oui' : 'non';
  document.getElementById('eligAnneeEtudes').value     = state.anneeEtudes || 1;
  document.getElementById('eligHandicap').value        = state.handicap ? 'oui' : 'non';
  document.getElementById('eligPratiqueSport').value   = state.pratiqueSport ? 'oui' : 'non';
  document.getElementById('eligMobilite').value        = state.mobiliteInternationale ? 'oui' : 'non';
  toggleEchelon();
}

export function saveEligibiliteForm() {
  state.statut                 = document.getElementById('eligStatut').value;
  state.niveau                 = document.getElementById('eligNiveau').value;
  state.boursier               = document.getElementById('eligBoursier').value === 'oui';
  state.echelon                = parseInt(document.getElementById('eligEchelon').value) || 0;
  state.revenuParental         = parseFloat(document.getElementById('eligRevenuParental').value) || 0;
  state.logementCrous          = document.getElementById('eligLogementCrous').value === 'oui';
  state.anneeEtudes            = parseInt(document.getElementById('eligAnneeEtudes').value) || 1;
  state.handicap               = document.getElementById('eligHandicap').value === 'oui';
  state.pratiqueSport          = document.getElementById('eligPratiqueSport').value === 'oui';
  state.mobiliteInternationale = document.getElementById('eligMobilite').value === 'oui';

  // Mettre à jour le résumé d'éligibilité
  renderEligibiliteSummary();

  // Mettre à jour la page des aides si elle a déjà été rendue
  const aidesContent = document.getElementById('aidesContent');
  if (aidesContent && aidesContent.innerHTML) renderAides();

  const alertEl = document.getElementById('eligAlert');
  alertEl.style.display = 'flex';
  setTimeout(() => { alertEl.style.display = 'none'; }, 3000);
}

export function toggleEchelon() {
  const boursier = document.getElementById('eligBoursier').value === 'oui';
  const echelonGroup = document.getElementById('echelonGroup');
  if (echelonGroup) echelonGroup.style.display = boursier ? '' : 'none';
}

export function renderEligibiliteSummary() {
  const summary = document.getElementById('eligSummary');
  if (!summary) return;

  const aides = computeEligibleAides();
  if (aides.length === 0) {
    summary.innerHTML = `<div style="text-align:center; color:var(--gray-400); padding:20px;">Aucune aide détectée. Remplissez le formulaire et sauvegardez.</div>`;
    return;
  }

  summary.innerHTML = `
    <div style="font-size:13px; font-weight:600; color:var(--blue-950); margin-bottom:12px;">
      ${aides.length} aide(s) potentiellement accessible(s) :
    </div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${aides.map(a => `
        <div style="display:flex; align-items:center; gap:10px; padding:10px 14px; background:var(--blue-50); border-radius:10px; border-left:3px solid var(--blue-500);">
          <span style="font-size:18px;">${a.emoji}</span>
          <div style="flex:1;">
            <div style="font-size:13px; font-weight:600; color:var(--blue-900);">${a.titre}</div>
            <div style="font-size:12px; color:var(--blue-600);">${a.montant}</div>
          </div>
          <span class="reco-tag tag-aide" style="font-size:11px;">Éligible</span>
        </div>
      `).join('')}
    </div>
    <div style="margin-top:16px; padding:12px; background:var(--gray-50); border-radius:10px; font-size:12px; color:var(--gray-500);">
      Ces résultats sont indicatifs. Consultez l'onglet <strong>Aides Étudiantes</strong> pour plus de détails ou vérifiez votre situation sur service-public.fr.
    </div>
  `;
}

function computeEligibleAides() {
  const revPar   = state.revenuParental || 0;
  const etudiant = state.statut === 'etudiant';
  const boursier = state.boursier;
  const results  = [];

  if (etudiant && boursier && revPar < 35000)
    results.push({ emoji: '🎓', titre: 'Bourse CROUS', montant: state.echelon >= 5 ? '487 – 623 €/mois' : '113 – 487 €/mois' });
  if (etudiant && (state.logementCrous || state.revenus < 1200))
    results.push({ emoji: '🏠', titre: 'APL / Aide au logement (CAF)', montant: '80 – 280 €/mois' });
  if (etudiant)
    results.push({ emoji: '🔑', titre: 'Garantie Visale', montant: 'Gratuit' });
  if (etudiant && boursier)
    results.push({ emoji: '⚽', titre: "Pass'Sport", montant: '50 € / an' });
  if (etudiant && boursier && state.mobiliteInternationale)
    results.push({ emoji: '✈️', titre: 'Aide à la mobilité internationale', montant: '400 €/mois' });
  if (state.revenus < 900)
    results.push({ emoji: '🏥', titre: 'Complémentaire Santé Solidaire', montant: 'Gratuit ou < 1 €/jour' });
  if (etudiant && boursier)
    results.push({ emoji: '🍽️', titre: 'Tarif social RU (1 €/repas)', montant: '1 € / repas' });
  if (state.pratiqueSport && boursier)
    results.push({ emoji: '🏆', titre: 'Aide au mérite', montant: '900 €/an' });
  if (state.revenus >= 948 && state.revenus < 1500)
    results.push({ emoji: '💼', titre: "Prime d'activité", montant: '50 – 300 €/mois' });
  if (state.handicap)
    results.push({ emoji: '♿', titre: 'Allocation Adulte Handicapé (AAH)', montant: "Jusqu'à 971 €/mois" });
  if (etudiant && boursier)
    results.push({ emoji: '💻', titre: 'Aide à l\'équipement numérique', montant: '200 – 500 €' });

  return results;
}
