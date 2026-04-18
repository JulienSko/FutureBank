import { state, categories, accountHistory } from '../data.js';
import { fmt } from '../utils.js';
import { saveAll } from '../storage.js';

const EMOJIS = ['🏠','🛒','🚌','🎬','⚕️','📦','📚','👕','🍕','☕','🎮','🏋️','💊','🐾','✈️','🎵','💡','🔧'];

export function renderBudget() {
  renderBudgetBars();
  renderScore();
  renderPrevisionnelVsReel();
  renderForecast();
  renderBudgetEditor();
}

export function saveBudgetEditor() {
  const rows = document.querySelectorAll('.budget-edit-row');
  rows.forEach((row, i) => {
    const emoji  = row.querySelector('.budget-edit-emoji').value.trim() || '📦';
    const name   = row.querySelector('.budget-edit-name').value.trim();
    const budget = parseFloat(row.querySelector('.budget-edit-amount').value) || 0;
    if (name && i < categories.length) {
      categories[i].emoji  = emoji;
      categories[i].name   = name;
      categories[i].budget = budget;
    }
  });
  saveAll();
  renderBudget();
  const alertEl = document.getElementById('budgetSaveAlert');
  if (alertEl) { alertEl.style.display = 'flex'; setTimeout(() => { alertEl.style.display = 'none'; }, 2500); }
}

export function addBudgetCategory() {
  const name   = document.getElementById('newCatName').value.trim();
  const budget = parseFloat(document.getElementById('newCatBudget').value) || 0;
  const emoji  = document.getElementById('newCatEmoji').value.trim() || '📦';
  if (!name) return;
  categories.push({ name, emoji, color: '#94a3b8', budget, depenses: 0 });
  document.getElementById('newCatName').value   = '';
  document.getElementById('newCatBudget').value = '';
  document.getElementById('newCatEmoji').value  = '';
  saveAll();
  renderBudget();
}

export function deleteBudgetCategory(index) {
  if (categories.length <= 1) return;
  categories.splice(index, 1);
  saveAll();
  renderBudget();
}

function renderBudgetEditor() {
  const container = document.getElementById('budgetEditor');
  if (!container) return;

  container.innerHTML = `
    <div id="budgetSaveAlert" style="display:none;" class="alert alert-success">✅ Budgets mis à jour !</div>
    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
      ${categories.map((c, i) => `
        <div class="budget-edit-row" style="display:flex; gap:8px; align-items:center;">
          <input class="form-input budget-edit-emoji" value="${c.emoji}"
            style="width:52px; text-align:center; font-size:18px; padding:8px 4px;" placeholder="📦" />
          <input class="form-input budget-edit-name" value="${c.name}"
            style="flex:2;" placeholder="Catégorie" />
          <input class="form-input budget-edit-amount" type="number" value="${c.budget}"
            style="flex:1; min-width:90px;" placeholder="Budget €" />
          <span style="font-size:12px; color:var(--gray-400); white-space:nowrap; min-width:70px;">
            Réel : ${fmt(c.depenses)} €
          </span>
          <button onclick="deleteBudgetCategory(${i})"
            style="background:none; border:none; color:var(--gray-400); cursor:pointer; font-size:18px; padding:4px 6px; flex-shrink:0;"
            title="Supprimer">✕</button>
        </div>
      `).join('')}
    </div>

    <div style="border-top:1px solid var(--gray-200); padding-top:14px; margin-bottom:14px;">
      <div style="font-size:13px; font-weight:600; color:var(--gray-700); margin-bottom:8px;">Ajouter une catégorie</div>
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <input class="form-input" id="newCatEmoji" placeholder="😀" style="width:52px; text-align:center; font-size:18px; padding:8px 4px;" />
        <input class="form-input" id="newCatName" placeholder="Nom (ex : Abonnements)" style="flex:2; min-width:140px;" />
        <input class="form-input" id="newCatBudget" type="number" placeholder="Budget €" style="flex:1; min-width:90px;" />
        <button class="btn btn-outline" onclick="addBudgetCategory()" style="white-space:nowrap;">+ Ajouter</button>
      </div>
    </div>

    <button class="btn btn-primary" onclick="saveBudgetEditor()">💾 Enregistrer les budgets</button>
  `;
}

function renderBudgetBars() {
  const bars = document.getElementById('budgetBars');
  bars.innerHTML = '';

  categories.forEach(c => {
    const pct    = Math.min(110, Math.round(c.depenses / c.budget * 100));
    const over   = c.depenses > c.budget;
    const warn   = pct > 80 && !over;
    const color  = over ? 'var(--red)' : warn ? 'var(--amber)' : 'var(--green)';
    const alert  = over
      ? `<span style="font-size:11px; background:var(--red); color:#fff; border-radius:4px; padding:2px 6px; margin-left:6px;">⚠️ +${fmt(c.depenses - c.budget)} € dépassé</span>`
      : warn
      ? `<span style="font-size:11px; background:var(--amber); color:#fff; border-radius:4px; padding:2px 6px; margin-left:6px;">Attention</span>`
      : '';

    bars.innerHTML += `
      <div style="margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <div style="display:flex; align-items:center; font-size:13px; font-weight:600; color:var(--gray-700);">
            ${c.emoji} ${c.name}${alert}
          </div>
          <div style="font-size:12px; color:var(--gray-400);">${fmt(c.depenses)} € / ${fmt(c.budget)} €</div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${Math.min(100, pct)}%; background:${color};"></div>
        </div>
        <div style="font-size:11px; color:${color}; font-weight:600; margin-top:2px;">${pct}% du budget utilisé</div>
      </div>
    `;
  });
}

function renderScore() {
  const depenses = categories.reduce((s, c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);
  const rate     = epargne / state.revenus;
  const over     = categories.filter(c => c.depenses > c.budget).length;
  const isEtudiant = state.statut === 'etudiant';

  // Seuils adaptés aux étudiants (revenus modestes → épargne plus difficile)
  let score = 60;
  if (isEtudiant) {
    if (rate > 0.15) score += 20;
    else if (rate > 0.08) score += 12;
    else if (rate > 0.02) score += 5;
    if (state.solde > state.revenus * 2) score += 10;
  } else {
    if (rate > 0.3)  score += 20;
    else if (rate > 0.2) score += 12;
    else if (rate > 0.1) score += 5;
    if (state.solde > state.revenus * 3) score += 15;
  }
  score -= over * 5;
  score = Math.max(20, Math.min(100, score));

  document.getElementById('scoreVal').textContent = score;

  let msg;
  if (isEtudiant) {
    msg = score >= 80
      ? 'Excellent pour un étudiant ! Vous épargnez bien malgré un budget serré. Continuez à profiter des aides disponibles.'
      : score >= 60
      ? 'Bonne gestion ! Quelques dépenses dépassent le budget. Pensez au RU, aux abonnements partagés et aux aides CROUS.'
      : 'Attention : plusieurs postes dépassent le budget. Vérifiez vos aides (APL, bourse) et réduisez les dépenses variables.';
  } else {
    msg = score >= 80
      ? 'Excellent ! Votre situation financière est très saine. Vous épargnez bien et respectez votre budget.'
      : score >= 60
      ? 'Bonne gestion ! Quelques postes de dépenses dépassent le budget. Surveillez vos dépenses variables.'
      : 'Attention : plusieurs postes dépassent le budget prévu. Réduisez vos dépenses variables pour améliorer votre score.';
  }
  document.getElementById('scoreMsg').textContent = msg;
}

function renderPrevisionnelVsReel() {
  const container = document.getElementById('previsReelGrid');
  if (!container) return;

  const totalBudget  = categories.reduce((s, c) => s + c.budget, 0);
  const totalReelles = categories.reduce((s, c) => s + c.depenses, 0);
  const ecartTotal   = totalReelles - totalBudget;

  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="border-bottom:2px solid var(--gray-200);">
            <th style="text-align:left; padding:8px 4px; color:var(--gray-400); font-weight:600;">Catégorie</th>
            <th style="text-align:right; padding:8px 4px; color:var(--gray-400); font-weight:600;">Budget prévu</th>
            <th style="text-align:right; padding:8px 4px; color:var(--gray-400); font-weight:600;">Dépenses réelles</th>
            <th style="text-align:right; padding:8px 4px; color:var(--gray-400); font-weight:600;">Écart</th>
          </tr>
        </thead>
        <tbody>
          ${categories.map(c => {
            const ecart    = c.depenses - c.budget;
            const ecartCls = ecart > 0 ? 'color:var(--red)' : 'color:var(--green)';
            return `
              <tr style="border-bottom:1px solid var(--gray-100);">
                <td style="padding:9px 4px; font-weight:600;">${c.emoji} ${c.name}</td>
                <td style="text-align:right; padding:9px 4px; color:var(--gray-600);">${fmt(c.budget)} €</td>
                <td style="text-align:right; padding:9px 4px; font-weight:600;">${fmt(c.depenses)} €</td>
                <td style="text-align:right; padding:9px 4px; font-weight:700; ${ecartCls};">${ecart > 0 ? '+' : ''}${fmt(ecart)} €</td>
              </tr>
            `;
          }).join('')}
        </tbody>
        <tfoot>
          <tr style="border-top:2px solid var(--gray-200); background:var(--gray-50);">
            <td style="padding:10px 4px; font-weight:700; color:var(--blue-950);">Total</td>
            <td style="text-align:right; padding:10px 4px; font-weight:700;">${fmt(totalBudget)} €</td>
            <td style="text-align:right; padding:10px 4px; font-weight:700;">${fmt(totalReelles)} €</td>
            <td style="text-align:right; padding:10px 4px; font-weight:700; ${ecartTotal > 0 ? 'color:var(--red)' : 'color:var(--green)'};">${ecartTotal > 0 ? '+' : ''}${fmt(ecartTotal)} €</td>
          </tr>
        </tfoot>
      </table>
    </div>
    ${ecartTotal > 0
      ? `<div class="alert alert-warn" style="margin-top:12px; margin-bottom:0;">⚠️ Vous avez dépassé votre budget de <strong>${fmt(ecartTotal)} €</strong> ce mois-ci.</div>`
      : `<div class="alert alert-success" style="margin-top:12px; margin-bottom:0;">✅ Vous êtes dans les clous — <strong>${fmt(Math.abs(ecartTotal))} €</strong> de marge restante sur votre budget.</div>`
    }
  `;
}

function renderForecast() {
  const fg       = document.getElementById('forecastGrid');
  fg.innerHTML   = '';
  const data     = accountHistory.slice(-3);
  const avgDep   = data.length > 0
    ? Math.round(data.reduce((s, d) => s + d.depenses, 0) / data.length)
    : categories.reduce((s, c) => s + c.depenses, 0);

  const moisSuivants = getNextMonths(3);

  moisSuivants.forEach((m, i) => {
    const variation    = Math.round((Math.random() - 0.45) * 120);
    const projected    = avgDep + variation;
    const epargneProj  = state.revenus - projected;
    const threshold    = state.statut === 'etudiant' ? 80 : 700;
    const trend        = epargneProj > threshold * 1.5 ? '↑' : epargneProj > threshold ? '→' : '↓';
    const tcolor       = epargneProj > threshold * 1.5 ? 'var(--green)' : epargneProj > threshold ? 'var(--amber)' : 'var(--red)';
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

function getNextMonths(n) {
  const mois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const now   = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i + 1);
    return mois[d.getMonth()];
  });
}
