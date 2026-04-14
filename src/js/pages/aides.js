import { state } from '../data.js';

export function renderAides() {
  const aides = [
    {
      titre:   'Aide au logement (APL)',
      desc:    'Aide personnalisée au logement versée par la CAF. Montant variable selon revenus, loyer et situation familiale.',
      eligible: state.revenus < 2500,
      lien:    'caf.fr',
    },
    {
      titre:   'Prime d\'activité',
      desc:    'Complément de revenus pour les travailleurs modestes. Versée mensuellement par la CAF.',
      eligible: state.revenus < 1800,
      lien:    'caf.fr',
    },
    {
      titre:   'Crédit d\'impôt Transition Énergétique (MaPrimeRénov)',
      desc:    'Aide pour financer des travaux de rénovation énergétique dans votre logement.',
      eligible: true,
      lien:    'maprimerenov.gouv.fr',
    },
    {
      titre:   'PTZ (Prêt à Taux Zéro)',
      desc:    'Prêt immobilier sans intérêts pour l\'achat d\'une première résidence principale.',
      eligible: state.objectif === 'immobilier',
      lien:    'service-public.fr',
    },
    {
      titre:   'CEL / PEL',
      desc:    'Comptes épargne logement permettant d\'obtenir un prêt immobilier à taux préférentiel.',
      eligible: state.objectif === 'immobilier' || state.objectif === 'epargne',
      lien:    'service-public.fr',
    },
    {
      titre:   'Allocations Familiales',
      desc:    'Prestations versées aux familles avec enfants. Montant selon nombre d\'enfants et revenus.',
      eligible: state.famille === 'famille',
      lien:    'caf.fr',
    },
  ];

  const ctn   = document.getElementById('aidesContent');
  const elig  = aides.filter(a => a.eligible);
  const other = aides.filter(a => !a.eligible);

  ctn.innerHTML = `
    <div class="form-section-title" style="margin-top:0;">Aides potentiellement éligibles (${elig.length})</div>
    <div class="grid-2">${elig.map(aideCard).join('')}</div>
    ${other.length
      ? `<div class="form-section-title">Autres aides disponibles</div><div class="grid-2">${other.map(aideCard).join('')}</div>`
      : ''
    }
  `;
}

function aideCard(a) {
  const badge = a.eligible
    ? `<span class="reco-tag tag-aide" style="white-space:nowrap;">Éligible</span>`
    : `<span class="reco-tag" style="background:var(--gray-100);color:var(--gray-400);white-space:nowrap;">À vérifier</span>`;
  return `
    <div class="card" style="margin-bottom:0;">
      <div class="card-body">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div style="font-size:14px; font-weight:700; color:var(--blue-950);">${a.titre}</div>
          ${badge}
        </div>
        <div style="font-size:13px; color:var(--gray-600); line-height:1.6; margin-bottom:8px;">${a.desc}</div>
        <a href="https://${a.lien}" target="_blank" style="font-size:12px; color:var(--blue-600); text-decoration:none; font-weight:600;">🔗 ${a.lien}</a>
      </div>
    </div>
  `;
}
