export const state = {
  prenom: 'Alex',
  nom: 'Dubois',
  solde: 1240,
  revenus: 850,
  loyer: 380,
  objectifEpargne: 100,
  profil: 'prudent',
  famille: 'celibataire',
  objectif: 'epargne',
  horizon: 'court',
  // Champs étudiant
  statut: 'etudiant',
  niveau: 'licence',
  boursier: true,
  echelon: 3,
  logementCrous: true,
  anneeEtudes: 2,
  revenuParental: 28000,
  handicap: false,
  pratiqueSport: true,
  mobiliteInternationale: false,
  nbSiblings: 1,
};

export const categories = [
  { name: 'Logement',    emoji: '🏠', color: '#6366f1', budget: 420,  depenses: 380 },
  { name: 'Alimentaire', emoji: '🛒', color: '#10b981', budget: 200,  depenses: 187 },
  { name: 'Transport',   emoji: '🚌', color: '#f59e0b', budget: 80,   depenses: 75  },
  { name: 'Loisirs',     emoji: '🎬', color: '#ec4899', budget: 60,   depenses: 72  },
  { name: 'Santé',       emoji: '⚕️', color: '#3b82f6', budget: 30,   depenses: 18  },
  { name: 'Divers',      emoji: '📦', color: '#94a3b8', budget: 60,   depenses: 48  },
];

export const transactions = [
  { date: '2025-06-28', desc: 'Bourse CROUS — Juin',         cat: 'Revenus',     amount: +487 },
  { date: '2025-06-28', desc: 'Job étudiant — Librairie',    cat: 'Revenus',     amount: +363 },
  { date: '2025-06-25', desc: 'APL — CAF',                   cat: 'Revenus',     amount: +180 },
  { date: '2025-06-22', desc: 'Loyer résidence CROUS',       cat: 'Logement',    amount: -380 },
  { date: '2025-06-21', desc: 'Lidl — Courses hebdo',        cat: 'Alimentaire', amount: -47  },
  { date: '2025-06-20', desc: 'Navigo Imagine R',            cat: 'Transport',   amount: -38  },
  { date: '2025-06-19', desc: 'RU — Restaurant universitaire', cat: 'Alimentaire', amount: -28 },
  { date: '2025-06-18', desc: 'Spotify étudiant',            cat: 'Loisirs',     amount: -5   },
  { date: '2025-06-17', desc: 'EDF résidence',               cat: 'Logement',    amount: -0   },
  { date: '2025-06-16', desc: 'Aldi — Courses',              cat: 'Alimentaire', amount: -39  },
  { date: '2025-06-15', desc: 'Prime BNP Paribas jeune',     cat: 'Revenus',     amount: +20  },
  { date: '2025-06-14', desc: 'Fnac — Manuel de cours',      cat: 'Divers',      amount: -32  },
  { date: '2025-06-13', desc: 'Mutuelle étudiante LMDE',     cat: 'Santé',       amount: -18  },
  { date: '2025-06-12', desc: 'Cinéma MK2 (tarif étudiant)', cat: 'Loisirs',     amount: -7   },
  { date: '2025-06-11', desc: 'Monoprix — Courses',          cat: 'Alimentaire', amount: -43  },
  { date: '2025-06-10', desc: 'Amazon — Fournitures',        cat: 'Divers',      amount: -16  },
  { date: '2025-06-09', desc: 'Virement épargne Livret A',   cat: 'Virement',    amount: -100 },
  { date: '2025-06-07', desc: 'Netflix (partage)',            cat: 'Loisirs',     amount: -4   },
  { date: '2025-06-05', desc: 'Boulangerie — Sandwichs',     cat: 'Alimentaire', amount: -30  },
  { date: '2025-06-03', desc: 'Bus interurbain',             cat: 'Transport',   amount: -37  },
];

export const chartData = [
  { month: 'Jan', revenus: 780,  depenses: 620 },
  { month: 'Fév', revenus: 850,  depenses: 710 },
  { month: 'Mar', revenus: 850,  depenses: 680 },
  { month: 'Avr', revenus: 880,  depenses: 730 },
  { month: 'Mai', revenus: 850,  depenses: 695 },
  { month: 'Jun', revenus: 1050, depenses: 780 },
];

// Historique de simulation (éditable depuis la page Simulation)
export const accountHistory = [
  { month: 'Jan 2025', solde: 820,  revenus: 780,  depenses: 620 },
  { month: 'Fév 2025', solde: 910,  revenus: 850,  depenses: 710 },
  { month: 'Mar 2025', solde: 1080, revenus: 850,  depenses: 680 },
  { month: 'Avr 2025', solde: 1050, revenus: 880,  depenses: 730 },
  { month: 'Mai 2025', solde: 1155, revenus: 850,  depenses: 695 },
  { month: 'Jun 2025', solde: 1240, revenus: 1050, depenses: 780 },
];

export const accounts = [
  { id: 1, name: 'Compte Étudiant', bank: 'BNP Paribas',  type: 'courant', balance: 1240, icon: '💳', color: '#2563eb' },
  { id: 2, name: 'Livret A',        bank: 'BNP Paribas',  type: 'epargne', balance: 850,  icon: '🏦', color: '#10b981' },
];
