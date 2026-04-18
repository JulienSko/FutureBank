import { state, accountHistory, categories } from '../data.js';
import { fmt } from '../utils.js';
import { renderDashboard } from './dashboard.js';
import { saveAll } from '../storage.js';

export function renderSimulation() {
  renderHistoryTable();
  renderHistoryChart();
  renderAnnualSummary();
  document.getElementById('simSolde').value = state.solde;
}

export function updateSolde() {
  const val = parseFloat(document.getElementById('simSolde').value) || 0;
  state.solde = val;
  document.getElementById('statSolde').textContent = fmt(val) + ' €';
  document.getElementById('topbarBalance').textContent = 'Solde : ' + fmt(val) + ' €';
  saveAll();
}

export function addSimMonth() {
  const mois     = document.getElementById('simMonth').value.trim();
  const revenus  = parseFloat(document.getElementById('simRevenus').value) || 0;
  const depenses = parseFloat(document.getElementById('simDepenses').value) || 0;
  if (!mois) return;

  const prevSolde = accountHistory.length > 0 ? accountHistory[accountHistory.length - 1].solde : state.solde;
  const newSolde  = Math.round((prevSolde + revenus - depenses) * 100) / 100;

  accountHistory.push({ month: mois, solde: newSolde, revenus, depenses });

  // Réinitialiser les champs
  document.getElementById('simMonth').value    = '';
  document.getElementById('simRevenus').value  = '';
  document.getElementById('simDepenses').value = '';

  renderHistoryTable();
  renderHistoryChart();
  renderAnnualSummary();
  renderDashboard();
  saveAll();
}

export function deleteSimMonth(index) {
  accountHistory.splice(index, 1);
  renderHistoryTable();
  renderHistoryChart();
  renderAnnualSummary();
  renderDashboard();
  saveAll();
}

function renderHistoryTable() {
  const tbody = document.getElementById('simTableBody');
  if (!tbody) return;

  if (accountHistory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--gray-400); padding:24px;">Aucun mois enregistré.</td></tr>`;
    return;
  }

  tbody.innerHTML = accountHistory.map((row, i) => {
    const diff    = row.revenus - row.depenses;
    const diffCls = diff >= 0 ? 'color:var(--green-600)' : 'color:var(--red-500)';
    return `
      <tr>
        <td style="font-weight:600;">${row.month}</td>
        <td style="color:var(--green-600);">${fmt(row.revenus)} €</td>
        <td style="color:var(--red-500);">${fmt(row.depenses)} €</td>
        <td style="${diffCls}; font-weight:600;">${diff >= 0 ? '+' : ''}${fmt(diff)} €</td>
        <td style="font-weight:700; color:var(--blue-700);">${fmt(row.solde)} €</td>
        <td>
          <button onclick="deleteSimMonth(${i})" style="background:none; border:none; color:var(--gray-400); cursor:pointer; font-size:16px; padding:2px 6px;" title="Supprimer">✕</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderHistoryChart() {
  const container = document.getElementById('simChart');
  if (!container || accountHistory.length === 0) return;

  const maxVal = Math.max(...accountHistory.map(r => Math.max(r.revenus, r.depenses)), 1);

  container.innerHTML = `
    <div style="display:flex; gap:6px; align-items:flex-end; height:160px; padding-bottom:4px;">
      ${accountHistory.map(row => {
        const hR = Math.round((row.revenus  / maxVal) * 140);
        const hD = Math.round((row.depenses / maxVal) * 140);
        return `
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:2px;">
            <div style="display:flex; gap:2px; align-items:flex-end; height:140px;">
              <div title="Revenus ${fmt(row.revenus)} €" style="width:14px; height:${hR}px; background:var(--blue-500); border-radius:3px 3px 0 0;"></div>
              <div title="Dépenses ${fmt(row.depenses)} €" style="width:14px; height:${hD}px; background:var(--blue-200); border-radius:3px 3px 0 0;"></div>
            </div>
            <div style="font-size:10px; color:var(--gray-400); text-align:center; white-space:nowrap;">${row.month.split(' ')[0]}</div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="display:flex; gap:16px; margin-top:4px;">
      <div style="display:flex; align-items:center; gap:6px; font-size:12px; color:var(--gray-600);">
        <div style="width:12px;height:12px;background:var(--blue-500);border-radius:3px;"></div> Revenus
      </div>
      <div style="display:flex; align-items:center; gap:6px; font-size:12px; color:var(--gray-600);">
        <div style="width:12px;height:12px;background:var(--blue-200);border-radius:3px;"></div> Dépenses
      </div>
    </div>
  `;
}

function renderAnnualSummary() {
  const container = document.getElementById('simAnnual');
  if (!container || accountHistory.length === 0) {
    if (container) container.innerHTML = `<div style="text-align:center; color:var(--gray-400); padding:20px;">Ajoutez des mois pour voir le résumé annuel.</div>`;
    return;
  }

  // Grouper par année
  const byYear = {};
  accountHistory.forEach(row => {
    const year = row.month.split(' ')[1] || row.month;
    if (!byYear[year]) byYear[year] = { revenus: 0, depenses: 0, months: 0, lastSolde: 0 };
    byYear[year].revenus  += row.revenus;
    byYear[year].depenses += row.depenses;
    byYear[year].months   += 1;
    byYear[year].lastSolde = row.solde;
  });

  container.innerHTML = Object.entries(byYear).map(([year, data]) => {
    const epargne = data.revenus - data.depenses;
    return `
      <div class="card" style="margin-bottom:12px;">
        <div class="card-header"><div class="card-title">Résumé ${year}</div></div>
        <div class="card-body">
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:12px;">
            <div style="text-align:center;">
              <div style="font-size:11px; color:var(--gray-400); margin-bottom:4px;">Mois suivis</div>
              <div style="font-size:20px; font-weight:700; color:var(--blue-700);">${data.months}</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:11px; color:var(--gray-400); margin-bottom:4px;">Revenus totaux</div>
              <div style="font-size:18px; font-weight:700; color:var(--green-600);">${fmt(data.revenus)} €</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:11px; color:var(--gray-400); margin-bottom:4px;">Dépenses totales</div>
              <div style="font-size:18px; font-weight:700; color:var(--red-500);">${fmt(data.depenses)} €</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:11px; color:var(--gray-400); margin-bottom:4px;">Épargne nette</div>
              <div style="font-size:18px; font-weight:700; color:${epargne >= 0 ? 'var(--blue-600)' : 'var(--red-500)'};">${epargne >= 0 ? '+' : ''}${fmt(epargne)} €</div>
            </div>
          </div>
          <div style="margin-top:12px; font-size:12px; color:var(--gray-500);">
            Solde fin de période : <strong style="color:var(--blue-700);">${fmt(data.lastSolde)} €</strong>
            &nbsp;·&nbsp; Moyenne mensuelle : <strong>${fmt(Math.round(epargne / data.months))} €/mois d'épargne</strong>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
