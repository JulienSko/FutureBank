import { transactions } from '../data.js';
import { fmt, formatDate } from '../utils.js';

export function renderTransactions() {
  const search  = (document.getElementById('txSearch').value || '').toLowerCase();
  const filter  = document.getElementById('txFilter').value;
  const body    = document.getElementById('txBody');
  body.innerHTML = '';

  const filtered = transactions.filter(tx =>
    (tx.desc.toLowerCase().includes(search) || tx.cat.toLowerCase().includes(search)) &&
    (filter === '' || tx.cat === filter)
  );

  filtered.forEach(tx => {
    const pos      = tx.amount > 0;
    const badgeCls = 'badge-' + tx.cat.toLowerCase().replace(/é/g, 'e');
    body.innerHTML += `
      <tr>
        <td>${formatDate(tx.date)}</td>
        <td>${tx.desc}</td>
        <td><span class="tx-badge ${badgeCls}">${tx.cat}</span></td>
        <td style="font-weight:700; color:${pos ? 'var(--green)' : 'var(--red)'};">${pos ? '+' : ''}${fmt(tx.amount)} €</td>
      </tr>
    `;
  });

  // Mettre à jour le compteur
  const counter = document.getElementById('txCount');
  if (counter) counter.textContent = `${filtered.length} transaction${filtered.length > 1 ? 's' : ''}`;
}

export function exportCSV() {
  const search = (document.getElementById('txSearch').value || '').toLowerCase();
  const filter = document.getElementById('txFilter').value;

  const filtered = transactions.filter(tx =>
    (tx.desc.toLowerCase().includes(search) || tx.cat.toLowerCase().includes(search)) &&
    (filter === '' || tx.cat === filter)
  );

  const header = 'Date,Description,Catégorie,Montant (€)\n';
  const rows   = filtered.map(tx =>
    `${tx.date},"${tx.desc}",${tx.cat},${tx.amount}`
  ).join('\n');

  const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `futurebank-transactions-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
