import { state } from '../data.js';

function getAides() {
  const revPar = state.revenuParental || 0;
  const boursier = state.boursier;
  const echelon = state.echelon || 0;
  const etudiant = state.statut === 'etudiant';
  const logementCrous = state.logementCrous;
  const pratiqueSport = state.pratiqueSport;
  const mobilite = state.mobiliteInternationale;
  const handicap = state.handicap;

  return [
    {
      categorie: 'Étudiant',
      titre: 'Bourse sur critères sociaux (CROUS)',
      emoji: '🎓',
      desc: `Aide mensuelle versée aux étudiants selon les revenus parentaux et la situation familiale. Échelons 0 à 7 — de 113 € à 623 €/mois. Dossier à déposer avant le 31 mai sur messervices.etudiant.gouv.fr.`,
      eligible: etudiant && boursier && revPar < 35000,
      montant: echelon >= 5 ? '487 – 623 €/mois' : echelon >= 3 ? '320 – 487 €/mois' : '113 – 320 €/mois',
      lien: 'messervices.etudiant.gouv.fr',
    },
    {
      categorie: 'Logement',
      titre: 'Aide Personnalisée au Logement (APL)',
      emoji: '🏠',
      desc: 'Aide au logement versée par la CAF. En résidence CROUS ou logement conventionné, les étudiants y ont souvent droit. Montant variable selon loyer, revenus et zone géographique.',
      eligible: etudiant && (logementCrous || state.revenus < 1200),
      montant: '80 – 280 €/mois',
      lien: 'caf.fr',
    },
    {
      categorie: 'Logement',
      titre: 'Garantie Visale (Action Logement)',
      emoji: '🔑',
      desc: 'Caution gratuite pour votre logement, remplace le garant physique. Disponible pour les étudiants de moins de 30 ans. Acceptée par de nombreux propriétaires.',
      eligible: etudiant,
      montant: 'Gratuit',
      lien: 'visale.fr',
    },
    {
      categorie: 'Sport & Culture',
      titre: 'Pass\'Sport',
      emoji: '⚽',
      desc: 'Aide de 50 € pour financer une inscription dans un club sportif agréé. Versée directement au club lors de l\'inscription. Valable pour les boursiers CROUS.',
      eligible: etudiant && boursier,
      montant: '50 € / an',
      lien: 'pass.sports.gouv.fr',
    },
    {
      categorie: 'International',
      titre: 'Aide à la Mobilité Internationale (AMI)',
      emoji: '✈️',
      desc: 'Complément de bourse pour les étudiants boursiers qui partent à l\'étranger (Erasmus+ ou hors Erasmus). Versée par le CROUS pendant la durée du séjour.',
      eligible: etudiant && boursier && mobilite,
      montant: '400 €/mois',
      lien: 'etudiant.gouv.fr',
    },
    {
      categorie: 'Santé',
      titre: 'Complémentaire Santé Solidaire (CSS)',
      emoji: '🏥',
      desc: 'Mutuelle gratuite ou à moins de 1 €/jour pour les étudiants aux revenus modestes. Couvre les soins dentaires, optiques et médicaux en complément de l\'Assurance Maladie.',
      eligible: state.revenus < 900,
      montant: 'Gratuit ou < 1 €/jour',
      lien: 'complementaire-sante-solidaire.fr',
    },
    {
      categorie: 'Santé',
      titre: 'Allocation Adulte Handicapé (AAH)',
      emoji: '♿',
      desc: 'Allocation mensuelle pour les personnes en situation de handicap ayant un taux d\'incapacité d\'au moins 80%. Cumulable avec une bourse CROUS.',
      eligible: handicap,
      montant: 'Jusqu\'à 971 €/mois',
      lien: 'service-public.fr',
    },
    {
      categorie: 'Mobilité',
      titre: 'Aide au mérite',
      emoji: '🏆',
      desc: 'Aide complémentaire à la bourse pour les étudiants ayant obtenu la mention Très Bien au baccalauréat ou aux examens nationaux. Non soumise à conditions de ressources.',
      eligible: etudiant && boursier,
      montant: '900 €/an',
      lien: 'etudiant.gouv.fr',
    },
    {
      categorie: 'Alimentation',
      titre: 'Restaurant Universitaire CROUS (tarif social)',
      emoji: '🍽️',
      desc: 'Repas complets à tarif réduit dans les restaurants du CROUS. Les boursiers bénéficient du tarif social à 1 € (au lieu de 3,30 €).',
      eligible: etudiant && boursier,
      montant: '1 € / repas',
      lien: 'crous.fr',
    },
    {
      categorie: 'Mobilité',
      titre: 'Carte Imagine R',
      emoji: '🚌',
      desc: 'Abonnement annuel aux transports en commun (Île-de-France) à tarif réduit pour les étudiants de moins de 26 ans. Couvre métro, RER, bus, tramway.',
      eligible: etudiant,
      montant: '350 €/an (vs 900 € tarif normal)',
      lien: 'iledefrance-mobilites.fr',
    },
    {
      categorie: 'Numérique',
      titre: 'Aide à l\'équipement numérique',
      emoji: '💻',
      desc: 'Certaines régions et établissements proposent des aides pour l\'achat d\'un ordinateur ou d\'une tablette. Renseignez-vous auprès de votre université ou conseil régional.',
      eligible: etudiant && boursier,
      montant: '200 – 500 €',
      lien: 'etudiant.gouv.fr',
    },
    {
      categorie: 'Emploi',
      titre: 'Prime d\'activité',
      emoji: '💼',
      desc: 'Complément de revenus pour les étudiants-salariés et apprentis. Accessible si vous travaillez et percevez plus de 948 €/mois. Cumulable avec la bourse CROUS.',
      eligible: state.revenus >= 948 && state.revenus < 1500,
      montant: '50 – 300 €/mois',
      lien: 'caf.fr',
    },
  ];
}

export function renderAides() {
  const aides = getAides();
  const ctn   = document.getElementById('aidesContent');
  const elig  = aides.filter(a => a.eligible);
  const other = aides.filter(a => !a.eligible);

  // Grouper par catégorie
  const categories = [...new Set(elig.map(a => a.categorie))];

  let html = `<div class="form-section-title" style="margin-top:0;">Aides potentiellement éligibles (${elig.length})</div>`;
  html += `<div class="alert alert-info" style="margin-bottom:16px;">💡 Ces résultats sont basés sur votre profil. Complétez vos <strong>infos personnelles</strong> pour affiner les résultats.</div>`;

  if (elig.length === 0) {
    html += `<div class="card"><div class="card-body" style="text-align:center; color:var(--gray-400); padding:40px;">Aucune aide détectée selon votre profil actuel. Complétez vos informations dans <strong>Mon Profil Étudiant</strong>.</div></div>`;
  } else {
    html += `<div class="grid-2">${elig.map(aideCard).join('')}</div>`;
  }

  if (other.length > 0) {
    html += `<div class="form-section-title">Autres aides disponibles (${other.length})</div>`;
    html += `<div class="grid-2">${other.map(aideCard).join('')}</div>`;
  }

  ctn.innerHTML = html;
}

function aideCard(a) {
  const badge = a.eligible
    ? `<span class="reco-tag tag-aide" style="white-space:nowrap;">Éligible</span>`
    : `<span class="reco-tag" style="background:var(--gray-100);color:var(--gray-400);white-space:nowrap;">À vérifier</span>`;

  const montantBadge = a.montant
    ? `<span style="display:inline-block; margin-top:6px; font-size:12px; font-weight:700; color:var(--blue-700); background:var(--blue-50); border-radius:6px; padding:3px 8px;">${a.montant}</span>`
    : '';

  return `
    <div class="card" style="margin-bottom:0;">
      <div class="card-body">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:20px;">${a.emoji}</span>
            <div>
              <div style="font-size:13px; font-weight:700; color:var(--blue-950);">${a.titre}</div>
              <div style="font-size:11px; color:var(--gray-400); margin-top:1px;">${a.categorie}</div>
            </div>
          </div>
          ${badge}
        </div>
        <div style="font-size:13px; color:var(--gray-600); line-height:1.6; margin-bottom:8px;">${a.desc}</div>
        ${montantBadge}
        <div style="margin-top:8px;">
          <a href="https://${a.lien}" target="_blank" style="font-size:12px; color:var(--blue-600); text-decoration:none; font-weight:600;">🔗 ${a.lien}</a>
        </div>
      </div>
    </div>
  `;
}
