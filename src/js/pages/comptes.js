import { accounts } from '../data.js';
import { fmt } from '../utils.js';
import { saveAll } from '../storage.js';

const TYPE_LABELS = {
  courant:   'Courant',
  epargne:   'Épargne',
  pea:       'PEA',
  assurance: 'Assurance Vie',
  pel:       'PEL / CEL',
  cto:       'CTO',
  autre:     'Autre',
};
const TYPE_ICONS = {
  courant: '💳', epargne: '🏦', pea: '📈',
  assurance: '🛡️', pel: '🏠', cto: '💼', autre: '💰',
};
const TYPE_COLORS = {
  courant: '#2563eb', epargne: '#10b981', pea: '#6366f1',
  assurance: '#8b5cf6', pel: '#f59e0b', cto: '#ec4899', autre: '#94a3b8',
};

export function renderComptes() {
  const total = accounts.reduce((s, a) => s + a.balance, 0);

  document.getElementById('comptesContent').innerHTML = `
    <div class="patrimoine-banner">
      <div>
        <div class="patrimoine-label">Patrimoine total</div>
        <div class="patrimoine-value">${fmt(total)} €</div>
      </div>
      <div class="patrimoine-meta">${accounts.length} compte${accounts.length !== 1 ? 's' : ''} enregistré${accounts.length !== 1 ? 's' : ''}</div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Mes comptes</div>
        <button class="btn btn-primary" style="font-size:12px; padding:8px 16px;" onclick="openAddCompteModal()">＋ Ajouter un compte</button>
      </div>
      <div class="card-body" style="padding:0;">
        <div id="comptesList"></div>
      </div>
    </div>

    <div class="modal-overlay" id="compteModal">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Nouveau compte</div>
          <button class="modal-close" onclick="closeAddCompteModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nom du compte</label>
            <input class="form-input" id="newCompteName" placeholder="Ex : Compte Étudiant" />
          </div>
          <div class="form-group">
            <label class="form-label">Banque / Établissement</label>
            <input class="form-input" id="newCompteBank" placeholder="Ex : BNP Paribas, Boursorama…" />
          </div>
          <div class="form-group">
            <label class="form-label">Type de compte</label>
            <select class="form-input" id="newCompteType">
              <option value="courant">Compte Courant</option>
              <option value="epargne">Épargne (Livret A, LDDS…)</option>
              <option value="pea">PEA</option>
              <option value="assurance">Assurance Vie</option>
              <option value="pel">PEL / CEL</option>
              <option value="cto">Compte-Titres (CTO)</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Solde actuel (€)</label>
            <input class="form-input" id="newCompteBalance" type="number" placeholder="0" min="0" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="closeAddCompteModal()">Annuler</button>
          <button class="btn btn-primary" onclick="addCompte()">Ajouter</button>
        </div>
      </div>
    </div>
  `;

  renderComptesList();
}

function renderComptesList() {
  const list = document.getElementById('comptesList');
  if (!list) return;

  if (accounts.length === 0) {
    list.innerHTML = `
      <div style="padding:48px 24px; text-align:center; color:var(--gray-400);">
        <div style="font-size:32px; margin-bottom:12px;">🏦</div>
        <div style="font-size:14px;">Aucun compte enregistré.</div>
        <div style="font-size:13px; margin-top:4px;">Cliquez sur <strong>Ajouter un compte</strong> pour commencer.</div>
      </div>
    `;
    return;
  }

  list.innerHTML = accounts.map((a, i) => `
    <div class="compte-item">
      <div class="compte-icon" style="background:${a.color}18; color:${a.color};">${a.icon}</div>
      <div class="compte-info">
        <div class="compte-name">${a.name}</div>
        <div class="compte-bank">${a.bank}</div>
      </div>
      <span class="compte-type-badge type-${a.type}">${TYPE_LABELS[a.type] || a.type}</span>
      <div class="compte-balance">${fmt(a.balance)} €</div>
      <button class="compte-delete" onclick="deleteCompte(${i})" title="Supprimer">✕</button>
    </div>
  `).join('');
}

function refreshTotals() {
  const total = accounts.reduce((s, a) => s + a.balance, 0);
  const valEl = document.querySelector('.patrimoine-value');
  const subEl = document.querySelector('.patrimoine-meta');
  if (valEl) valEl.textContent = fmt(total) + ' €';
  if (subEl) subEl.textContent = accounts.length + ' compte' + (accounts.length !== 1 ? 's' : '') + ' enregistré' + (accounts.length !== 1 ? 's' : '');
}

export function openAddCompteModal() {
  document.getElementById('compteModal').classList.add('open');
}

export function closeAddCompteModal() {
  document.getElementById('compteModal').classList.remove('open');
  ['newCompteName', 'newCompteBank', 'newCompteBalance'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.style.borderColor = ''; }
  });
}

export function addCompte() {
  const name    = document.getElementById('newCompteName').value.trim();
  const bank    = document.getElementById('newCompteBank').value.trim();
  const type    = document.getElementById('newCompteType').value;
  const balance = parseFloat(document.getElementById('newCompteBalance').value) || 0;

  let valid = true;
  ['newCompteName', 'newCompteBank'].forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) { el.style.borderColor = 'var(--red)'; valid = false; }
    else el.style.borderColor = '';
  });
  if (!valid) return;

  accounts.push({ id: Date.now(), name, bank, type, balance, icon: TYPE_ICONS[type] || '💰', color: TYPE_COLORS[type] || '#94a3b8' });
  saveAll();
  closeAddCompteModal();
  renderComptesList();
  refreshTotals();
}

export function deleteCompte(index) {
  if (!confirm(`Supprimer "${accounts[index]?.name}" ?`)) return;
  accounts.splice(index, 1);
  saveAll();
  renderComptesList();
  refreshTotals();
}
