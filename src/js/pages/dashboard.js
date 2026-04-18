import { state, categories, accountHistory, transactions } from '../data.js';
import { fmt, formatDate, getCatEmoji } from '../utils.js';

export function renderDashboard() {
  const depenses = categories.reduce((s, c) => s + c.depenses, 0);
  const epargne  = Math.max(0, state.revenus - depenses);
  const rate     = Math.round(epargne / state.revenus * 100);

  document.getElementById('statSolde').textContent      = fmt(state.solde) + ' €';
  document.getElementById('statRevenus').textContent    = fmt(state.revenus) + ' €';
  document.getElementById('statDepenses').textContent   = fmt(depenses) + ' €';
  document.getElementById('statEpargne').textContent    = fmt(epargne) + ' €';
  document.getElementById('statEpargneRate').textContent = `Taux d'épargne : ${rate}%`;
  document.getElementById('topbarBalance').textContent  = `Solde : ${fmt(state.solde)} €`;

  renderChart();
  renderCategories();
  renderLastTransactions();
}

function renderChart() {
  const data    = accountHistory.length > 0 ? accountHistory : [];
  if (data.length === 0) return;
  const maxVal  = Math.max(...data.map(d => Math.max(d.revenus, d.depenses)), 1);
  const barsCtn = document.getElementById('chartBars');
  const lblsCtn = document.getElementById('chartLabels');
  barsCtn.innerHTML = '';
  lblsCtn.innerHTML = '';

  data.forEach(d => {
    const label = d.month.split(' ')[0]; // "Jan 2025" → "Jan"
    const col = document.createElement('div');
    col.className = 'bar-col';
    const h1 = Math.round((d.revenus  / maxVal) * 110);
    const h2 = Math.round((d.depenses / maxVal) * 110);
    col.innerHTML = `
      <div style="display:flex; gap:3px; align-items:flex-end; height:120px;">
        <div class="bar income"  style="height:${h1}px; flex:1;" title="Revenus: ${fmt(d.revenus)} €"></div>
        <div class="bar expense" style="height:${h2}px; flex:1;" title="Dépenses: ${fmt(d.depenses)} €"></div>
      </div>
    `;
    barsCtn.appendChild(col);

    const lbl = document.createElement('div');
    lbl.className    = 'bar-label';
    lbl.style.flex   = '1';
    lbl.style.textAlign = 'center';
    lbl.textContent  = label;
    lblsCtn.appendChild(lbl);
  });
}

function renderCategories() {
  const catList  = document.getElementById('catList');
  catList.innerHTML = '';
  const totalDep = categories.reduce((s, c) => s + c.depenses, 0);

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
}

function renderLastTransactions() {
  const lastTx = document.getElementById('lastTx');
  lastTx.innerHTML = '';

  transactions.slice(0, 5).forEach(tx => {
    const pos = tx.amount > 0;
    lastTx.innerHTML += `
      <div class="expense-item">
        <div class="expense-icon" style="background:${pos ? '#d1fae5' : '#eff6ff'};">
          ${pos ? '💰' : getCatEmoji(tx.cat)}
        </div>
        <div class="expense-details">
          <div class="expense-name">${tx.desc}</div>
          <div class="expense-cat">${tx.cat} · ${formatDate(tx.date)}</div>
        </div>
        <div class="expense-amount ${pos ? 'pos' : 'neg'}">${pos ? '+' : ''}${fmt(tx.amount)} €</div>
      </div>
    `;
  });
}
