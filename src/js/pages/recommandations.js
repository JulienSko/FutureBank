import { state, categories } from '../data.js';
import { fmt } from '../utils.js';

export function renderRecommandations() {
  const depenses = categories.reduce((s, c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);

  document.getElementById('recoAlert').textContent =
    `✨ Recommandations personnalisées — Solde : ${fmt(state.solde)} € · Épargne mensuelle estimée : ${fmt(epargne)} €`;

  document.getElementById('recoInvest').innerHTML  = getPlacementsForProfile().map(recoCard).join('');
  document.getElementById('recoEpargne').innerHTML = getEpargneRecos(epargne).map(recoCard).join('');
}

function getPlacementsForProfile() {
  if (state.profil === 'prudent') {
    return [
      { icon: '🏦', title: 'Livret A',               desc: 'Sécurisé, garanti par l\'État. Taux : 3%. Idéal comme épargne de précaution.',                  tag: 'epargne' },
      { icon: '📋', title: 'LDDS',                   desc: 'Livret Développement Durable. Complément parfait du Livret A, mêmes avantages fiscaux.',       tag: 'epargne' },
      { icon: '🛡️', title: 'Fonds euros assurance vie', desc: 'Capital garanti, rendement stable ~2.5%. Enveloppe fiscalement avantageuse.',              tag: 'invest'  },
    ];
  }
  if (state.profil === 'equilibre') {
    return [
      { icon: '📈', title: 'Assurance vie multisupport', desc: 'Mix fonds euros + ETF. Rendement potentiel 4–6% sur le moyen terme.',                     tag: 'invest' },
      { icon: '🏠', title: 'SCPI',                      desc: 'Immobilier papier. Rendement ~4.5% sans contrainte de gestion.',                           tag: 'invest' },
      { icon: '💼', title: 'PEA',                       desc: state.horizon === 'long'
          ? 'Parfait pour votre horizon long terme. Actions européennes exonérées d\'impôts après 5 ans.'
          : 'Investissement en actions avec fiscalité avantageuse après 5 ans.',                                                                             tag: 'invest' },
    ];
  }
  return [
    { icon: '🚀', title: 'ETF Monde (CW8)',   desc: 'Exposition mondiale diversifiée. Performances historiques ~7%/an sur le long terme.',                 tag: 'invest' },
    { icon: '💻', title: 'ETF Technologie',   desc: 'Secteur à fort potentiel. Profil dynamique recommandé. Volatilité élevée.',                          tag: 'invest' },
    { icon: '₿',  title: 'Crypto (< 5%)',     desc: 'Petite exposition en Bitcoin sur CTO. Risque élevé, potentiel de croissance fort.',                  tag: 'invest' },
  ];
}

function getEpargneRecos(epargne) {
  const recos = [];
  if (state.objectif === 'immobilier') {
    recos.push({ icon: '🏡', title: 'PEL', desc: `Préparez votre achat immobilier. Taux à 2.25%, plafond 61 200 €. Idéal pour votre objectif.`, tag: 'epargne' });
  }
  recos.push({
    icon:  '💰',
    title: 'Fonds d\'urgence',
    desc:  `Objectif : ${fmt(state.revenus * 3)} € (3 mois de revenus). Votre solde actuel : ${fmt(state.solde)} €.`,
    tag:   'epargne',
  });
  if (epargne >= 200) {
    recos.push({
      icon:  '🎯',
      title: `Épargne mensuelle ${fmt(state.objectifEpargne)} €`,
      desc:  `Avec ${fmt(epargne)} € d'épargne possible, vous pouvez atteindre votre objectif de ${fmt(state.objectifEpargne * 12)} € par an.`,
      tag:   'epargne',
    });
  }
  return recos;
}

function recoCard(r) {
  const tagCls = r.tag === 'invest' ? 'tag-invest' : r.tag === 'aide' ? 'tag-aide' : 'tag-epargne';
  const tagLbl = r.tag === 'invest' ? 'Placement'  : r.tag === 'aide' ? 'Aide État' : 'Épargne';
  return `
    <div class="reco-card">
      <div class="reco-icon">${r.icon}</div>
      <div class="reco-title">${r.title}</div>
      <div class="reco-desc">${r.desc}</div>
      <span class="reco-tag ${tagCls}">${tagLbl}</span>
    </div>
  `;
}
