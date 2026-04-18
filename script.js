// ════════════════════════════════════════════════════════
//  STATE — source unique de vérité
// ════════════════════════════════════════════════════════
const state = {
  prenom: 'Marie',
  nom: 'Fontaine',
  solde: 4250,
  revenus: 2800,
  loyer: 750,
  objectifEpargne: 500,
  profil: 'equilibre',
  famille: 'famille',
  objectif: 'immobilier',
  horizon: 'moyen',
  apiKey: '',
};

const categories = [
  { name: 'Logement',     emoji: '🏠', color: '#6366f1', budget: 800,  depenses: 750 },
  { name: 'Alimentaire',  emoji: '🛒', color: '#10b981', budget: 400,  depenses: 382 },
  { name: 'Transport',    emoji: '🚗', color: '#f59e0b', budget: 200,  depenses: 230 },
  { name: 'Loisirs',      emoji: '🎬', color: '#ec4899', budget: 150,  depenses: 165 },
  { name: 'Santé',        emoji: '⚕️', color: '#3b82f6', budget: 100,  depenses: 85  },
  { name: 'Divers',       emoji: '📦', color: '#94a3b8', budget: 200,  depenses: 258 },
];

const transactions = [
  { date:'2025-06-28', desc:'Salaire SARL Dupont',       cat:'Revenus',      amount:+2800 },
  { date:'2025-06-27', desc:'EDF Électricité',           cat:'Logement',     amount:-89  },
  { date:'2025-06-26', desc:'Carrefour Market',          cat:'Alimentaire',  amount:-67  },
  { date:'2025-06-25', desc:'Freenow – Taxi',            cat:'Transport',    amount:-22  },
  { date:'2025-06-24', desc:'Netflix',                   cat:'Loisirs',      amount:-17  },
  { date:'2025-06-23', desc:'Pharmacie du Centre',       cat:'Santé',        amount:-45  },
  { date:'2025-06-22', desc:'Loyer Juin',                cat:'Logement',     amount:-750 },
  { date:'2025-06-21', desc:'Monoprix – Courses',        cat:'Alimentaire',  amount:-54  },
  { date:'2025-06-20', desc:'RATP Navigo',               cat:'Transport',    amount:-86  },
  { date:'2025-06-19', desc:'Amazon Prime',              cat:'Loisirs',      amount:-7   },
  { date:'2025-06-18', desc:'Docteur Lemaire',           cat:'Santé',        amount:-30  },
  { date:'2025-06-17', desc:'Boulangerie Paul',          cat:'Alimentaire',  amount:-12  },
  { date:'2025-06-16', desc:'Spotify',                   cat:'Loisirs',      amount:-10  },
  { date:'2025-06-15', desc:'Lidl – Courses hebdo',      cat:'Alimentaire',  amount:-78  },
  { date:'2025-06-14', desc:'Assurance Auto Maif',       cat:'Transport',    amount:-56  },
  { date:'2025-06-13', desc:'Virement épargne Livret A', cat:'Virement',     amount:-400 },
  { date:'2025-06-12', desc:'Bouygues Telecom',          cat:'Divers',       amount:-22  },
  { date:'2025-06-11', desc:'H&M',                       cat:'Loisirs',      amount:-89  },
  { date:'2025-06-10', desc:'Uber Eats',                 cat:'Alimentaire',  amount:-35  },
  { date:'2025-06-09', desc:'Ikea',                      cat:'Divers',       amount:-145 },
];

const chartData = [
  { month:'Jan', revenus:2700, depenses:1900 },
  { month:'Fév', revenus:2700, depenses:2100 },
  { month:'Mar', revenus:2800, depenses:1750 },
  { month:'Avr', revenus:2800, depenses:1980 },
  { month:'Mai', revenus:2800, depenses:1820 },
  { month:'Jun', revenus:2800, depenses:1870 },
];

// ════════════════════════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════════════════════════
const pageNames = {
  dashboard: 'Tableau de bord',
  transactions: 'Transactions',
  budget: 'Budget prévisionnel',
  conseiller: 'Conseiller IA',
  recommandations: 'Recommandations',
  aides: 'Aides & Subventions',
  compte: 'Paramètres du compte',
};

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  document.getElementById('topbarTitle').textContent = pageNames[page];

  if (page === 'recommandations') renderRecommandations();
  if (page === 'aides') renderAides();
  if (page === 'budget') renderBudget();
  if (page === 'compte') loadSettingsForm();
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.page));
});

// ════════════════════════════════════════════════════════
//  DATE
// ════════════════════════════════════════════════════════
function initDate() {
  const d = new Date();
  document.getElementById('topbarDate').textContent =
    d.toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

// ════════════════════════════════════════════════════════
//  DASHBOARD
// ════════════════════════════════════════════════════════
function renderDashboard() {
  const depenses = categories.reduce((s,c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);
  const rate     = Math.round(epargne / state.revenus * 100);

  document.getElementById('statSolde').textContent     = fmt(state.solde) + ' €';
  document.getElementById('statRevenus').textContent   = fmt(state.revenus) + ' €';
  document.getElementById('statDepenses').textContent  = fmt(depenses) + ' €';
  document.getElementById('statEpargne').textContent   = fmt(epargne) + ' €';
  document.getElementById('statEpargneRate').textContent = `Taux d'épargne : ${rate}%`;
  document.getElementById('topbarBalance').textContent = `Solde : ${fmt(state.solde)} €`;

  const maxVal = Math.max(...chartData.map(d => Math.max(d.revenus, d.depenses)));
  const barsCtn = document.getElementById('chartBars');
  const lblsCtn = document.getElementById('chartLabels');
  barsCtn.innerHTML = '';
  lblsCtn.innerHTML = '';

  chartData.forEach(d => {
    const col = document.createElement('div');
    col.className = 'bar-col';
    const h1 = Math.round((d.revenus  / maxVal) * 110);
    const h2 = Math.round((d.depenses / maxVal) * 110);
    col.innerHTML = `
      <div style="display:flex; gap:3px; align-items:flex-end; height:120px;">
        <div class="bar income" style="height:${h1}px; flex:1;" title="Revenus: ${fmt(d.revenus)} €"></div>
        <div class="bar expense" style="height:${h2}px; flex:1;" title="Dépenses: ${fmt(d.depenses)} €"></div>
      </div>
    `;
    barsCtn.appendChild(col);

    const lbl = document.createElement('div');
    lbl.className = 'bar-label';
    lbl.style.flex = '1';
    lbl.style.textAlign = 'center';
    lbl.textContent = d.month;
    lblsCtn.appendChild(lbl);
  });

  const catList = document.getElementById('catList');
  catList.innerHTML = '';
  const totalDep = categories.reduce((s,c) => s + c.depenses, 0);
  categories.forEach(c => {
    const pct = Math.round(c.depenses / totalDep * 100);
    catList.innerHTML += `
      <div class="cat-row">
        <div class="cat-row-top">
          <div class="cat-name">${c.emoji} ${c.name}</div>
          <div class="cat-pct">${fmt(c.depenses)} € (${pct}%)</div>
        </div>
        <div class="cat-bar-track">
          <div class="cat-bar-fill" style="width:${pct}%; background:${c.color};"></div>
        </div>
      </div>
    `;
  });

  const lastTx = document.getElementById('lastTx');
  lastTx.innerHTML = '';
  transactions.slice(0,5).forEach(tx => {
    const pos = tx.amount > 0;
    lastTx.innerHTML += `
      <div class="expense-item">
        <div class="expense-icon" style="background:${pos?'#d1fae5':'#eff6ff'};">
          ${pos ? '💰' : getCatEmoji(tx.cat)}
        </div>
        <div class="expense-details">
          <div class="expense-name">${tx.desc}</div>
          <div class="expense-cat">${tx.cat} · ${formatDate(tx.date)}</div>
        </div>
        <div class="expense-amount ${pos ? 'pos':'neg'}">${pos ? '+':''}${fmt(tx.amount)} €</div>
      </div>
    `;
  });
}

// ════════════════════════════════════════════════════════
//  TRANSACTIONS
// ════════════════════════════════════════════════════════
function renderTransactions() {
  const search = (document.getElementById('txSearch').value || '').toLowerCase();
  const filter = document.getElementById('txFilter').value;
  const body   = document.getElementById('txBody');
  body.innerHTML = '';
  transactions
    .filter(tx =>
      (tx.desc.toLowerCase().includes(search) || tx.cat.toLowerCase().includes(search)) &&
      (filter === '' || tx.cat === filter)
    )
    .forEach(tx => {
      const pos = tx.amount > 0;
      const badgeCls = 'badge-' + tx.cat.toLowerCase().replace(/é/g,'e');
      body.innerHTML += `
        <tr>
          <td>${formatDate(tx.date)}</td>
          <td>${tx.desc}</td>
          <td><span class="tx-badge ${badgeCls}">${tx.cat}</span></td>
          <td style="font-weight:700; color:${pos ? 'var(--green)':'var(--red)'};">${pos?'+':''}${fmt(tx.amount)} €</td>
        </tr>
      `;
    });
}

// ════════════════════════════════════════════════════════
//  BUDGET
// ════════════════════════════════════════════════════════
function renderBudget() {
  const bars = document.getElementById('budgetBars');
  bars.innerHTML = '';
  categories.forEach(c => {
    const pct = Math.min(100, Math.round(c.depenses / c.budget * 100));
    const color = pct > 100 ? 'var(--red)' : pct > 80 ? 'var(--amber)' : 'var(--green)';
    bars.innerHTML += `
      <div style="margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <div style="font-size:13px; font-weight:600; color:var(--gray-700);">${c.emoji} ${c.name}</div>
          <div style="font-size:12px; color:var(--gray-400);">${fmt(c.depenses)} € / ${fmt(c.budget)} €</div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%; background:${color};"></div>
        </div>
        <div style="font-size:11px; color:${color}; font-weight:600;">${pct}% du budget utilisé</div>
      </div>
    `;
  });

  const depenses = categories.reduce((s,c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);
  const rate     = epargne / state.revenus;
  const over     = categories.filter(c => c.depenses > c.budget).length;
  let score = 60;
  if (rate > .3) score += 20;
  else if (rate > .2) score += 12;
  else if (rate > .1) score += 5;
  score -= over * 5;
  if (state.solde > state.revenus * 3) score += 15;
  score = Math.max(20, Math.min(100, score));

  document.getElementById('scoreVal').textContent = score;
  const msgs = score >= 80
    ? 'Excellent ! Votre situation financière est très saine. Vous épargnez bien et respectez votre budget.'
    : score >= 60
    ? 'Bonne gestion ! Quelques postes de dépenses dépassent le budget. Surveillez vos dépenses de transport et loisirs.'
    : 'Attention : plusieurs postes dépassent le budget prévu. Réduisez vos dépenses variables pour améliorer votre score.';
  document.getElementById('scoreMsg').textContent = msgs;

  const fg = document.getElementById('forecastGrid');
  fg.innerHTML = '';
  const months = ['Juillet', 'Août', 'Septembre'];
  const avgDep = Math.round(chartData.slice(-3).reduce((s,d) => s + d.depenses, 0) / 3);
  months.forEach((m, i) => {
    const projected = avgDep + Math.round((Math.random() - .5) * 200);
    const epargneProj = state.revenus - projected;
    const trend = epargneProj > 900 ? '↑' : epargneProj > 700 ? '→' : '↓';
    const tcolor = epargneProj > 900 ? 'var(--green)' : epargneProj > 700 ? 'var(--amber)' : 'var(--red)';
    fg.innerHTML += `
      <div class="forecast-item">
        <div class="forecast-month">${m}</div>
        <div class="forecast-val">${fmt(epargneProj)} €</div>
        <div class="forecast-trend" style="color:${tcolor};">${trend} Épargne estimée</div>
        <div style="font-size:11px; color:var(--gray-400); margin-top:4px;">Dép. prév. : ${fmt(projected)} €</div>
      </div>
    `;
  });
}

// ════════════════════════════════════════════════════════
//  RECOMMANDATIONS — adaptées au profil
// ════════════════════════════════════════════════════════
function renderRecommandations() {
  const depenses = categories.reduce((s,c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);

  document.getElementById('recoAlert').textContent =
    `✨ Recommandations personnalisées — Solde : ${fmt(state.solde)} € · Épargne mensuelle estimée : ${fmt(epargne)} €`;

  let placements = [];
  if (state.profil === 'prudent') {
    placements = [
      { icon:'🏦', title:'Livret A', desc:'Sécurisé, garanti par l\'État. Taux : 3%. Idéal comme épargne de précaution.', tag:'epargne' },
      { icon:'📋', title:'LDDS', desc:'Livret Développement Durable. Complément parfait du Livret A, mêmes avantages fiscaux.', tag:'epargne' },
      { icon:'🛡️', title:'Fonds euros assurance vie', desc:'Capital garanti, rendement stable ~2.5%. Enveloppe fiscalement avantageuse.', tag:'invest' },
    ];
  } else if (state.profil === 'equilibre') {
    placements = [
      { icon:'📈', title:'Assurance vie multisupport', desc:'Mix fonds euros + ETF. Rendement potentiel 4–6% sur le moyen terme.', tag:'invest' },
      { icon:'🏠', title:'SCPI', desc:'Immobilier papier. Rendement ~4.5% sans contrainte de gestion.', tag:'invest' },
      { icon:'💼', title:'PEA', desc:state.horizon==='long' ? 'Parfait pour votre horizon long terme. Actions européennes exonérées d\'impôts après 5 ans.' : 'Investissement en actions avec fiscalité avantageuse après 5 ans.', tag:'invest' },
    ];
  } else {
    placements = [
      { icon:'🚀', title:'ETF Monde (CW8)', desc:'Exposition mondiale diversifiée. Performances historiques ~7%/an sur le long terme.', tag:'invest' },
      { icon:'💻', title:'ETF Technologie', desc:'Secteur à fort potentiel. Profil dynamique recommandé. Volatilité élevée.', tag:'invest' },
      { icon:'₿', title:'Crypto (< 5%)', desc:'Petite exposition en Bitcoin sur CTO. Risque élevé, potentiel de croissance fort.', tag:'invest' },
    ];
  }

  const epargneRecos = [];
  if (state.objectif === 'immobilier') {
    epargneRecos.push({ icon:'🏡', title:'PEL', desc:`Préparez votre achat immobilier. Taux à 2.25%, plafond 61 200 €. Idéal pour votre objectif.`, tag:'epargne' });
  }
  epargneRecos.push({ icon:'💰', title:'Fonds d\'urgence', desc:`Objectif : ${fmt(state.revenus * 3)} € (3 mois de revenus). Votre solde actuel : ${fmt(state.solde)} €.`, tag:'epargne' });
  if (epargne >= 200) {
    epargneRecos.push({ icon:'🎯', title:`Épargne mensuelle ${fmt(state.objectifEpargne)} €`, desc:`Avec ${fmt(epargne)} € d'épargne possible, vous pouvez atteindre votre objectif de ${fmt(state.objectifEpargne * 12)} € par an.`, tag:'epargne' });
  }

  const ri = document.getElementById('recoInvest');
  const re = document.getElementById('recoEpargne');
  ri.innerHTML = placements.map(r => recoCard(r)).join('');
  re.innerHTML = epargneRecos.map(r => recoCard(r)).join('');
}

function recoCard(r) {
  const tagCls = r.tag === 'invest' ? 'tag-invest' : r.tag === 'aide' ? 'tag-aide' : 'tag-epargne';
  const tagLbl = r.tag === 'invest' ? 'Placement' : r.tag === 'aide' ? 'Aide État' : 'Épargne';
  return `
    <div class="reco-card">
      <div class="reco-icon">${r.icon}</div>
      <div class="reco-title">${r.title}</div>
      <div class="reco-desc">${r.desc}</div>
      <span class="reco-tag ${tagCls}">${tagLbl}</span>
    </div>
  `;
}

// ════════════════════════════════════════════════════════
//  AIDES
// ════════════════════════════════════════════════════════
function renderAides() {
  const aides = [
    {
      titre:'Aide au logement (APL)',
      desc:'Aide personnalisée au logement versée par la CAF. Montant variable selon revenus, loyer et situation familiale.',
      eligible: state.revenus < 2500,
      lien:'caf.fr',
    },
    {
      titre:'Prime d\'activité',
      desc:'Complément de revenus pour les travailleurs modestes. Versée mensuellement par la CAF.',
      eligible: state.revenus < 1800,
      lien:'caf.fr',
    },
    {
      titre:'Crédit d\'impôt Transition Énergétique (MaPrimeRénov)',
      desc:'Aide pour financer des travaux de rénovation énergétique dans votre logement.',
      eligible: true,
      lien:'maprimerenov.gouv.fr',
    },
    {
      titre:'PTZ (Prêt à Taux Zéro)',
      desc:'Prêt immobilier sans intérêts pour l\'achat d\'une première résidence principale.',
      eligible: state.objectif === 'immobilier',
      lien:'service-public.fr',
    },
    {
      titre:'CEL / PEL',
      desc:'Comptes épargne logement permettant d\'obtenir un prêt immobilier à taux préférentiel.',
      eligible: state.objectif === 'immobilier' || state.objectif === 'epargne',
      lien:'service-public.fr',
    },
    {
      titre:'Allocation Familiales',
      desc:'Prestations versées aux familles avec enfants. Montant selon nombre d\'enfants et revenus.',
      eligible: state.famille === 'famille',
      lien:'caf.fr',
    },
  ];

  const ctn = document.getElementById('aidesContent');
  const elig = aides.filter(a => a.eligible);
  const other = aides.filter(a => !a.eligible);

  ctn.innerHTML = `
    <div class="form-section-title" style="margin-top:0;">Aides potentiellement éligibles (${elig.length})</div>
    <div class="grid-2">${elig.map(aideCard).join('')}</div>
    ${other.length ? `<div class="form-section-title">Autres aides disponibles</div><div class="grid-2">${other.map(aideCard).join('')}</div>` : ''}
  `;
}

function aideCard(a) {
  return `
    <div class="card" style="margin-bottom:0;">
      <div class="card-body">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div style="font-size:14px; font-weight:700; color:var(--blue-950);">${a.titre}</div>
          ${a.eligible ? `<span class="reco-tag tag-aide" style="white-space:nowrap;">Éligible</span>` : '<span class="reco-tag" style="background:var(--gray-100);color:var(--gray-400);white-space:nowrap;">À vérifier</span>'}
        </div>
        <div style="font-size:13px; color:var(--gray-600); line-height:1.6; margin-bottom:8px;">${a.desc}</div>
        <a href="https://${a.lien}" target="_blank" style="font-size:12px; color:var(--blue-600); text-decoration:none; font-weight:600;">🔗 ${a.lien}</a>
      </div>
    </div>
  `;
}

// ════════════════════════════════════════════════════════
//  AI CONSEILLER
// ════════════════════════════════════════════════════════
let apiKey = '';

function saveApiKey() {
  apiKey = document.getElementById('apiKeyInput').value.trim();
  if (apiKey) {
    document.querySelector('.api-banner').innerHTML = `
      <div class="api-banner-icon">✅</div>
      <div class="api-banner-text">
        <div class="api-banner-title">Clé API enregistrée</div>
        <div class="api-banner-desc">Le conseiller IA est maintenant actif avec votre clé Anthropic.</div>
      </div>
    `;
  }
}

function buildSystemPrompt() {
  const depenses = categories.reduce((s,c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);
  return `Tu es un conseiller bancaire IA expert, bienveillant et pédagogue. 
Voici le profil financier du client :
- Prénom : ${state.prenom} ${state.nom}
- Solde compte : ${state.solde} €
- Revenus mensuels nets : ${state.revenus} €
- Dépenses mensuelles totales : ${depenses} €
- Épargne mensuelle estimée : ${epargne} €
- Loyer / remboursement : ${state.loyer} €
- Objectif d'épargne : ${state.objectifEpargne} €/mois
- Profil investisseur : ${state.profil}
- Situation familiale : ${state.famille}
- Objectif principal : ${state.objectif}
- Horizon : ${state.horizon}
Réponds toujours en français, de façon concise (max 200 mots), structurée et personnalisée. Ne recommande jamais de produits spécifiques à risque élevé sans avertissement.`;
}

const chatHistory = [];

async function sendAI() {
  const input = document.getElementById('aiInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  askQuick(msg);
}

async function askQuick(msg) {
  const ctn = document.getElementById('aiMessages');

  ctn.insertAdjacentHTML('beforeend', `
    <div style="display:flex; justify-content:flex-end; margin-bottom:8px;">
      <div style="background:var(--blue-600); color:#fff; border-radius:14px 14px 2px 14px; padding:10px 16px; font-size:14px; max-width:75%;">${msg}</div>
    </div>
  `);

  const typingId = 'typing-' + Date.now();
  ctn.insertAdjacentHTML('beforeend', `
    <div id="${typingId}" class="ai-typing">
      <div class="dot"></div><div class="dot"></div><div class="dot"></div>
    </div>
  `);
  ctn.scrollTop = ctn.scrollHeight;

  chatHistory.push({ role: 'user', content: msg });

  if (!apiKey) {
    document.getElementById(typingId).remove();
    const fallback = getFallbackResponse(msg);
    appendAiMsg(ctn, fallback);
    chatHistory.push({ role: 'assistant', content: fallback });
    return;
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: buildSystemPrompt(),
        messages: chatHistory,
      }),
    });
    const data = await res.json();
    document.getElementById(typingId)?.remove();
    const reply = data.content?.[0]?.text || 'Une erreur est survenue.';
    appendAiMsg(ctn, reply);
    chatHistory.push({ role: 'assistant', content: reply });
  } catch (e) {
    document.getElementById(typingId)?.remove();
    appendAiMsg(ctn, '⚠️ Erreur de connexion à l\'API. Vérifiez votre clé API et votre connexion.');
  }
  ctn.scrollTop = ctn.scrollHeight;
}

function appendAiMsg(ctn, text) {
  ctn.insertAdjacentHTML('beforeend', `
    <div class="ai-message">
      <div class="ai-header"><div class="ai-dot"></div>Conseiller IA</div>
      ${text.replace(/\n/g, '<br>')}
    </div>
  `);
}

function getFallbackResponse(msg) {
  const depenses = categories.reduce((s,c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);
  const m = msg.toLowerCase();

  if (m.includes('budget') || m.includes('optimis')) {
    return `Bonjour ${state.prenom} ! Avec ${fmt(state.revenus)} € de revenus et ${fmt(depenses)} € de dépenses, votre épargne mensuelle est de ${fmt(epargne)} €.

Pour optimiser : réduisez les postes Transport (${fmt(230)} €, au-dessus du budget) et Loisirs. Visez un taux d'épargne de 20-30%.`;
  }
  if (m.includes('livret') || m.includes('épargne') || m.includes('epargne')) {
    return `Le Livret A à 3% est idéal pour votre épargne de précaution. Objectif : ${fmt(state.revenus * 3)} € (3 mois de revenus).

Après cela, selon votre profil ${state.profil}, je recommande ${state.profil === 'prudent' ? 'l\'assurance vie fonds euros' : 'un PEA ou assurance vie multisupport'}.`;
  }
  if (m.includes('aide') || m.includes('état') || m.includes('subvention')) {
    return `Selon votre profil (${state.famille}, revenus ${fmt(state.revenus)} €/mois), voici les aides potentielles :
• ${state.objectif === 'immobilier' ? 'PTZ pour votre projet immobilier\n• PEL : épargne logement' : 'Prime d\'activité si éligible'}
${state.famille === 'famille' ? '• Allocations familiales CAF\n• Places en crèche prioritaires' : ''}

Consultez caf.fr et service-public.fr pour vérifier votre éligibilité.`;
  }
  if (m.includes('taux') || m.includes('idéal')) {
    const taux = Math.round(epargne / state.revenus * 100);
    return `Votre taux d'épargne actuel est de ${taux}%. La règle 50/30/20 recommande :
• 50% besoins essentiels
• 30% loisirs
• 20% épargne

Votre objectif de ${fmt(state.objectifEpargne)} €/mois correspond à ${Math.round(state.objectifEpargne/state.revenus*100)}% de vos revenus — ${taux >= 20 ? 'très bien !' : 'il y a une marge de progression.'}`;
  }
  return `Bonjour ${state.prenom} ! Je suis votre conseiller IA. Pour des réponses en temps réel via Claude, ajoutez votre clé API Anthropic en haut de cette page.

En attendant, consultez les onglets **Recommandations** et **Aides & Subventions** pour des conseils personnalisés à votre profil.`;
}

// ════════════════════════════════════════════════════════
//  SETTINGS
// ════════════════════════════════════════════════════════
function loadSettingsForm() {
  document.getElementById('settPrenom').value = state.prenom;
  document.getElementById('settNom').value    = state.nom;
  document.getElementById('settSolde').value  = state.solde;
  document.getElementById('settRevenus').value = state.revenus;
  document.getElementById('settLoyer').value  = state.loyer;
  document.getElementById('settObjectifEpargne').value = state.objectifEpargne;
  document.getElementById('settProfil').value  = state.profil;
  document.getElementById('settFamille').value = state.famille;
  document.getElementById('settObjectif').value = state.objectif;
  document.getElementById('settHorizon').value = state.horizon;
}

function saveSettings() {
  state.prenom         = document.getElementById('settPrenom').value;
  state.nom            = document.getElementById('settNom').value;
  state.solde          = parseFloat(document.getElementById('settSolde').value) || 0;
  state.revenus        = parseFloat(document.getElementById('settRevenus').value) || 0;
  state.loyer          = parseFloat(document.getElementById('settLoyer').value) || 0;
  state.objectifEpargne = parseFloat(document.getElementById('settObjectifEpargne').value) || 0;
  state.profil         = document.getElementById('settProfil').value;
  state.famille        = document.getElementById('settFamille').value;
  state.objectif       = document.getElementById('settObjectif').value;
  state.horizon        = document.getElementById('settHorizon').value;

  const initials = (state.prenom[0] || '') + (state.nom[0] || '');
  document.getElementById('avatarInitials').textContent = initials.toUpperCase();
  document.getElementById('sidebarName').textContent = state.prenom + ' ' + state.nom;

  categories[0].depenses = state.loyer;

  renderDashboard();

  const alert = document.getElementById('saveAlert');
  alert.style.display = 'flex';
  setTimeout(() => { alert.style.display = 'none'; }, 3000);
}

function resetSettings() { loadSettingsForm(); }

// ════════════════════════════════════════════════════════
//  UTILS
// ════════════════════════════════════════════════════════
function fmt(n) {
  return Math.abs(n).toLocaleString('fr-FR');
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' });
}
function getCatEmoji(cat) {
  const map = { Logement:'🏠', Alimentaire:'🛒', Transport:'🚗', Loisirs:'🎬', Santé:'⚕️', Virement:'🔄', Divers:'📦' };
  return map[cat] || '💳';
}

// ════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════
initDate();
renderDashboard();
renderTransactions();
