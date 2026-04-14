import { state, categories } from '../data.js';
import { fmt } from '../utils.js';

let apiKey = '';
const chatHistory = [];

export function saveApiKey() {
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

export function sendAI() {
  const input = document.getElementById('aiInput');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';
  askQuick(msg);
}

export async function askQuick(msg) {
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
    const res  = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system:     buildSystemPrompt(),
        messages:   chatHistory,
      }),
    });
    const data  = await res.json();
    document.getElementById(typingId)?.remove();
    const reply = data.content?.[0]?.text || 'Une erreur est survenue.';
    appendAiMsg(ctn, reply);
    chatHistory.push({ role: 'assistant', content: reply });
  } catch {
    document.getElementById(typingId)?.remove();
    appendAiMsg(ctn, '⚠️ Erreur de connexion à l\'API. Vérifiez votre clé API et votre connexion.');
  }
  ctn.scrollTop = ctn.scrollHeight;
}

function buildSystemPrompt() {
  const depenses = categories.reduce((s, c) => s + c.depenses, 0);
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

function appendAiMsg(ctn, text) {
  ctn.insertAdjacentHTML('beforeend', `
    <div class="ai-message">
      <div class="ai-header"><div class="ai-dot"></div>Conseiller IA</div>
      ${text.replace(/\n/g, '<br>')}
    </div>
  `);
}

function getFallbackResponse(msg) {
  const depenses = categories.reduce((s, c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);
  const m        = msg.toLowerCase();

  if (m.includes('budget') || m.includes('optimis')) {
    return `Bonjour ${state.prenom} ! Avec ${fmt(state.revenus)} € de revenus et ${fmt(depenses)} € de dépenses, votre épargne mensuelle est de ${fmt(epargne)} €.\n\nPour optimiser : réduisez les postes Transport (${fmt(230)} €, au-dessus du budget) et Loisirs. Visez un taux d'épargne de 20-30%.`;
  }
  if (m.includes('livret') || m.includes('épargne') || m.includes('epargne')) {
    return `Le Livret A à 3% est idéal pour votre épargne de précaution. Objectif : ${fmt(state.revenus * 3)} € (3 mois de revenus).\n\nAprès cela, selon votre profil ${state.profil}, je recommande ${state.profil === 'prudent' ? 'l\'assurance vie fonds euros' : 'un PEA ou assurance vie multisupport'}.`;
  }
  if (m.includes('aide') || m.includes('état') || m.includes('subvention')) {
    return `Selon votre profil (${state.famille}, revenus ${fmt(state.revenus)} €/mois), voici les aides potentielles :\n• ${state.objectif === 'immobilier' ? 'PTZ pour votre projet immobilier\n• PEL : épargne logement' : 'Prime d\'activité si éligible'}\n${state.famille === 'famille' ? '• Allocations familiales CAF\n• Places en crèche prioritaires' : ''}\n\nConsultez caf.fr et service-public.fr pour vérifier votre éligibilité.`;
  }
  if (m.includes('taux') || m.includes('idéal')) {
    const taux = Math.round(epargne / state.revenus * 100);
    return `Votre taux d'épargne actuel est de ${taux}%. La règle 50/30/20 recommande :\n• 50% besoins essentiels\n• 30% loisirs\n• 20% épargne\n\nVotre objectif de ${fmt(state.objectifEpargne)} €/mois correspond à ${Math.round(state.objectifEpargne / state.revenus * 100)}% de vos revenus — ${taux >= 20 ? 'très bien !' : 'il y a une marge de progression.'}`;
  }
  return `Bonjour ${state.prenom} ! Je suis votre conseiller IA. Pour des réponses en temps réel via Claude, ajoutez votre clé API Anthropic en haut de cette page.\n\nEn attendant, consultez les onglets **Recommandations** et **Aides & Subventions** pour des conseils personnalisés à votre profil.`;
}
