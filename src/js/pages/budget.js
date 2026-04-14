import { state, categories, chartData } from '../data.js';
import { fmt } from '../utils.js';

export function renderBudget() {
  renderBudgetBars();
  renderScore();
  renderForecast();
}

function renderBudgetBars() {
  const bars = document.getElementById('budgetBars');
  bars.innerHTML = '';

  categories.forEach(c => {
    const pct   = Math.min(100, Math.round(c.depenses / c.budget * 100));
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
}

function renderScore() {
  const depenses = categories.reduce((s, c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);
  const rate     = epargne / state.revenus;
  const over     = categories.filter(c => c.depenses > c.budget).length;

  let score = 60;
  if (rate > 0.3) score += 20;
  else if (rate > 0.2) score += 12;
  else if (rate > 0.1) score += 5;
  score -= over * 5;
  if (state.solde > state.revenus * 3) score += 15;
  score = Math.max(20, Math.min(100, score));

  document.getElementById('scoreVal').textContent = score;

  const msg = score >= 80
    ? 'Excellent ! Votre situation financière est très saine. Vous épargnez bien et respectez votre budget.'
    : score >= 60
    ? 'Bonne gestion ! Quelques postes de dépenses dépassent le budget. Surveillez vos dépenses de transport et loisirs.'
    : 'Attention : plusieurs postes dépassent le budget prévu. Réduisez vos dépenses variables pour améliorer votre score.';
  document.getElementById('scoreMsg').textContent = msg;
}

function renderForecast() {
  const fg     = document.getElementById('forecastGrid');
  fg.innerHTML = '';
  const months = ['Juillet', 'Août', 'Septembre'];
  const avgDep = Math.round(chartData.slice(-3).reduce((s, d) => s + d.depenses, 0) / 3);

  months.forEach(m => {
    const projected   = avgDep + Math.round((Math.random() - 0.5) * 200);
    const epargneProj = state.revenus - projected;
    const trend       = epargneProj > 900 ? '↑' : epargneProj > 700 ? '→' : '↓';
    const tcolor      = epargneProj > 900 ? 'var(--green)' : epargneProj > 700 ? 'var(--amber)' : 'var(--red)';
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
