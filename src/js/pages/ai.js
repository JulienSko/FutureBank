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
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':                    'application/json',
        'x-api-key':                       apiKey,
        'anthropic-version':               '2023-06-01',
        'anthropic-dangerous-allow-browser': 'true',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system:     buildSystemPrompt(),
        messages:   chatHistory,
      }),
    });
    const data  = await res.json();
    document.getElementById(typingId)?.remove();
    if (data.error) {
      appendAiMsg(ctn, `⚠️ Erreur API : ${data.error.message}`);
      return;
    }
    const reply = data.content?.[0]?.text || 'Une erreur est survenue.';
    appendAiMsg(ctn, reply);
    chatHistory.push({ role: 'assistant', content: reply });
  } catch (e) {
    document.getElementById(typingId)?.remove();
    appendAiMsg(ctn, '⚠️ Erreur de connexion à l\'API. Vérifiez votre clé API et votre connexion.');
  }
  ctn.scrollTop = ctn.scrollHeight;
}

function buildSystemPrompt() {
  const depenses = categories.reduce((s, c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);
  const niveauLabel = { licence: 'Licence', master: 'Master', doctorat: 'Doctorat', bts: 'BTS/IUT', prepa: 'Prépa/Grandes Écoles' }[state.niveau] || state.niveau;
  return `Tu es un conseiller bancaire IA spécialisé pour les étudiants, bienveillant et pédagogue.
Voici le profil de l'étudiant(e) :
- Prénom : ${state.prenom} ${state.nom}
- Statut : Étudiant(e) en ${niveauLabel}
- Boursier CROUS : ${state.boursier ? `Oui — échelon ${state.echelon}` : 'Non'}
- Logement CROUS : ${state.logementCrous ? 'Oui' : 'Non'}
- Solde compte : ${state.solde} €
- Revenus mensuels nets : ${state.revenus} € (bourse + job étudiant)
- Dépenses mensuelles totales : ${depenses} €
- Épargne mensuelle estimée : ${epargne} €
- Loyer / résidence : ${state.loyer} €
- Objectif d'épargne : ${state.objectifEpargne} €/mois
- Profil investisseur : ${state.profil}
- Objectif principal : ${state.objectif}
- Horizon : ${state.horizon}
Réponds toujours en français, de façon concise (max 200 mots), structurée et adaptée au budget étudiant. Cite les aides étudiantes (CROUS, CAF, APL, Pass'sport, aide mobilité…) quand c'est pertinent. Ne recommande jamais de placements risqués sans avertissement.`;
}

function appendAiMsg(ctn, text) {
  ctn.insertAdjacentHTML('beforeend', `
    <div class="ai-message">
      <div class="ai-header"><div class="ai-dot"></div>Conseiller IA Étudiant</div>
      ${text.replace(/\n/g, '<br>')}
    </div>
  `);
}

function getFallbackResponse(msg) {
  const depenses = categories.reduce((s, c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);
  const m        = msg.toLowerCase();

  if (m.includes('bours') || m.includes('crous')) {
    return `La bourse CROUS est calculée selon les revenus de vos parents (déclaration fiscale N-2) et votre situation. Les 8 échelons vont de 0 (aide symbolique) à 7 (${fmt(623)} €/mois).\n\n📋 Pour vérifier votre dossier ou en faire un, rendez-vous sur <strong>messervices.etudiant.gouv.fr</strong> avant le 31 mai chaque année.`;
  }
  if (m.includes('apl') || m.includes('logement')) {
    return `En tant qu'étudiant(e) avec des revenus de ${fmt(state.revenus)} €/mois et un loyer de ${fmt(state.loyer)} €, vous pouvez prétendre à l'APL.\n\n💡 Simulez votre montant sur <strong>caf.fr</strong> — en résidence CROUS, l'APL est généralement entre 100 et 250 €/mois. Faites la demande dès votre entrée dans le logement.`;
  }
  if (m.includes('budget') || m.includes('optimis') || m.includes('économ')) {
    return `Avec ${fmt(state.revenus)} € de revenus et ${fmt(depenses)} € de dépenses, votre épargne est de ${fmt(epargne)} €/mois. Voici les leviers étudiant :\n\n• Manger au RU (3,30 €/repas avec bourse)\n• Navigo Imagine R si vous avez moins de 26 ans (350 €/an)\n• Abonnements partagés (Netflix, Spotify)\n• Seconde main pour les livres et vêtements`;
  }
  if (m.includes('job') || m.includes('travail') || m.includes('revenu')) {
    return `En tant qu'étudiant, vous pouvez travailler jusqu'à <strong>964 heures/an</strong> sans perdre votre statut ni vos droits sociaux.\n\nOptions populaires :\n• Job en biblio ou admin universitaire\n• Tutorat / soutien scolaire\n• Livreur, caisse, restauration\n• Alternance (si votre formation le permet)`;
  }
  if (m.includes('épargne') || m.includes('epargne') || m.includes('livret')) {
    return `Pour un étudiant, le <strong>Livret A</strong> (3%) est idéal : pas de frais, pas de risque, disponible immédiatement.\n\nObjectif : constituer un matelas de 2–3 mois de dépenses (environ ${fmt(depenses * 2)} €) avant d'envisager autre chose.\n\nÀ votre niveau de revenus, pas besoin de PEA ou assurance vie : la priorité c'est la sécurité financière.`;
  }
  if (m.includes('aide') || m.includes('subvention') || m.includes('état')) {
    return `Aides disponibles selon votre profil étudiant :\n\n• **Bourse CROUS** (si boursier) : jusqu'à ${fmt(623)} €/mois\n• **APL / ALS** : aide au logement CAF\n• **Pass'sport** : 50 € pour une inscription sportive\n• **Aide à la mobilité internationale** : si vous partez à l'étranger\n• **Complémentaire santé solidaire** : mutuelle gratuite ou quasi-gratuite\n\nConsultez l'onglet <strong>Aides Étudiantes</strong> pour votre éligibilité.`;
  }
  return `Bonjour ${state.prenom} ! Je suis votre conseiller IA dédié aux étudiants.\n\nPour des réponses en temps réel via Claude, ajoutez votre clé API Anthropic en haut de cette page.\n\nEn attendant, je peux vous aider sur : budget, bourse CROUS, APL, job étudiant, épargne, aides disponibles.`;
}
