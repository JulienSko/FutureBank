import { state } from '../data.js';
import { renderAides } from './aides.js';
import { saveAll } from '../storage.js';

// ─── Seuils officiels CROUS 2024-2025 (base : 0 frère/sœur à charge) ────────
// Chaque frère/sœur supplémentaire ajoute ~2 400 € au plafond de chaque échelon.
const SEUILS_BASE = [
  { echelon: 7, plafond: 6_738,  montant: '623 €/mois' },
  { echelon: 6, plafond: 9_386,  montant: '555 €/mois' },
  { echelon: 5, plafond: 11_741, montant: '487 €/mois' },
  { echelon: 4, plafond: 14_093, montant: '400 €/mois' },
  { echelon: 3, plafond: 17_751, montant: '320 €/mois' },
  { echelon: 2, plafond: 21_130, montant: '258 €/mois' },
  { echelon: 1, plafond: 24_855, montant: '185 €/mois' },
  { echelon: 0, plafond: 33_600, montant: '113 €/mois' },
];
const BONUS_PAR_SIBLING = 2_400;

export function calcEchelon(revenuParental, nbSiblings) {
  const bonus = (nbSiblings || 0) * BONUS_PAR_SIBLING;
  for (const s of SEUILS_BASE) {
    if (revenuParental <= s.plafond + bonus) {
      return { echelon: s.echelon, montant: s.montant, eligible: true };
    }
  }
  return { echelon: null, montant: null, eligible: false };
}

export function autoCalcEchelon() {
  const revenu     = parseFloat(document.getElementById('eligRevenuParental').value) || 0;
  const siblings   = parseInt(document.getElementById('eligNbSiblings').value) || 0;
  const result     = calcEchelon(revenu, siblings);
  const resultBox  = document.getElementById('echelonResult');
  if (!resultBox) return;

  if (revenu === 0) {
    resultBox.innerHTML = `<div style="color:var(--gray-400); font-size:13px;">Entrez les revenus parentaux pour calculer.</div>`;
    return;
  }

  if (!result.eligible) {
    resultBox.innerHTML = `
      <div style="padding:14px; background:#fef2f2; border:1px solid #fecaca; border-radius:10px;">
        <div style="font-size:14px; font-weight:700; color:#991b1b;">❌ Non éligible à la bourse CROUS</div>
        <div style="font-size:12px; color:#b91c1c; margin-top:4px;">
          Revenus parentaux (${revenu.toLocaleString('fr-FR')} €) supérieurs au plafond échelon 0
          (${(SEUILS_BASE[SEUILS_BASE.length-1].plafond + siblings * BONUS_PAR_SIBLING).toLocaleString('fr-FR')} €).
        </div>
      </div>
    `;
    document.getElementById('eligBoursier').value = 'non';
    toggleEchelon();
    return;
  }

  const plafondApplique = (SEUILS_BASE.find(s => s.echelon === result.echelon).plafond + siblings * BONUS_PAR_SIBLING).toLocaleString('fr-FR');

  resultBox.innerHTML = `
    <div style="padding:14px; background:var(--blue-50); border:1px solid var(--blue-200); border-radius:10px;">
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
        <div style="font-size:28px; font-family:'DM Serif Display', serif; color:var(--blue-600); font-weight:700;">Échelon ${result.echelon}</div>
        <div>
          <div style="font-size:15px; font-weight:700; color:var(--blue-900);">${result.montant}</div>
          <div style="font-size:11px; color:var(--blue-600);">Bourse mensuelle estimée</div>
        </div>
      </div>
      <div style="font-size:12px; color:var(--gray-600); line-height:1.6;">
        Plafond appliqué : <strong>${plafondApplique} €</strong>
        ${siblings > 0 ? `(base + ${siblings} × 2 400 € pour ${siblings} frère${siblings > 1 ? 's/sœurs' : '/sœur'})` : ''}
      </div>
      <div style="font-size:11px; color:var(--gray-400); margin-top:6px;">
        ⚠️ Estimation basée sur les seuils 2024-2025. Le montant réel peut varier selon d'autres critères (distance, situation familiale…).
      </div>
    </div>
  `;

  // Mettre à jour les champs boursier et échelon automatiquement
  document.getElementById('eligBoursier').value = 'oui';
  document.getElementById('eligEchelon').value  = result.echelon;
  toggleEchelon();
}

export function loadEligibiliteForm() {
  document.getElementById('eligStatut').value          = state.statut || 'etudiant';
  document.getElementById('eligNiveau').value          = state.niveau || 'licence';
  document.getElementById('eligBoursier').value        = state.boursier ? 'oui' : 'non';
  document.getElementById('eligEchelon').value         = state.echelon || 0;
  document.getElementById('eligRevenuParental').value  = state.revenuParental || 0;
  document.getElementById('eligNbSiblings').value      = state.nbSiblings || 0;
  document.getElementById('eligLogementCrous').value   = state.logementCrous ? 'oui' : 'non';
  document.getElementById('eligAnneeEtudes').value     = state.anneeEtudes || 1;
  document.getElementById('eligHandicap').value        = state.handicap ? 'oui' : 'non';
  document.getElementById('eligPratiqueSport').value   = state.pratiqueSport ? 'oui' : 'non';
  document.getElementById('eligMobilite').value        = state.mobiliteInternationale ? 'oui' : 'non';
  toggleEchelon();
  if (state.revenuParental) autoCalcEchelon();
}

export function saveEligibiliteForm() {
  state.statut                 = document.getElementById('eligStatut').value;
  state.niveau                 = document.getElementById('eligNiveau').value;
  state.boursier               = document.getElementById('eligBoursier').value === 'oui';
  state.echelon                = parseInt(document.getElementById('eligEchelon').value) || 0;
  state.revenuParental         = parseFloat(document.getElementById('eligRevenuParental').value) || 0;
  state.nbSiblings             = parseInt(document.getElementById('eligNbSiblings').value) || 0;
  state.logementCrous          = document.getElementById('eligLogementCrous').value === 'oui';
  state.anneeEtudes            = parseInt(document.getElementById('eligAnneeEtudes').value) || 1;
  state.handicap               = document.getElementById('eligHandicap').value === 'oui';
  state.pratiqueSport          = document.getElementById('eligPratiqueSport').value === 'oui';
  state.mobiliteInternationale = document.getElementById('eligMobilite').value === 'oui';

  renderEligibiliteSummary();

  const aidesContent = document.getElementById('aidesContent');
  if (aidesContent && aidesContent.innerHTML) renderAides();

  saveAll();
  const alertEl = document.getElementById('eligAlert');
  alertEl.style.display = 'flex';
  setTimeout(() => { alertEl.style.display = 'none'; }, 3000);
}

export function toggleEchelon() {
  const boursier     = document.getElementById('eligBoursier').value === 'oui';
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
    results.push({ emoji: '💻', titre: "Aide à l'équipement numérique", montant: '200 – 500 €' });

  return results;
}
