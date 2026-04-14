export const state = {
  prenom: 'Marie',
  nom: 'Fontaine',
  solde: 4250,
  revenus: 2800,
  loyer: 750,
  objectifEpargne: 500,
  profil: 'equilibre',
  famille: 'famille',
  objectif: 'immobilier',
  horizon: 'moyen',
};

export const categories = [
  { name: 'Logement',    emoji: '🏠', color: '#6366f1', budget: 800,  depenses: 750 },
  { name: 'Alimentaire', emoji: '🛒', color: '#10b981', budget: 400,  depenses: 382 },
  { name: 'Transport',   emoji: '🚗', color: '#f59e0b', budget: 200,  depenses: 230 },
  { name: 'Loisirs',     emoji: '🎬', color: '#ec4899', budget: 150,  depenses: 165 },
  { name: 'Santé',       emoji: '⚕️', color: '#3b82f6', budget: 100,  depenses: 85  },
  { name: 'Divers',      emoji: '📦', color: '#94a3b8', budget: 200,  depenses: 258 },
];

export const transactions = [
  { date: '2025-06-28', desc: 'Salaire SARL Dupont',       cat: 'Revenus',     amount: +2800 },
  { date: '2025-06-27', desc: 'EDF Électricité',           cat: 'Logement',    amount: -89   },
  { date: '2025-06-26', desc: 'Carrefour Market',          cat: 'Alimentaire', amount: -67   },
  { date: '2025-06-25', desc: 'Freenow – Taxi',            cat: 'Transport',   amount: -22   },
  { date: '2025-06-24', desc: 'Netflix',                   cat: 'Loisirs',     amount: -17   },
  { date: '2025-06-23', desc: 'Pharmacie du Centre',       cat: 'Santé',       amount: -45   },
  { date: '2025-06-22', desc: 'Loyer Juin',                cat: 'Logement',    amount: -750  },
  { date: '2025-06-21', desc: 'Monoprix – Courses',        cat: 'Alimentaire', amount: -54   },
  { date: '2025-06-20', desc: 'RATP Navigo',               cat: 'Transport',   amount: -86   },
  { date: '2025-06-19', desc: 'Amazon Prime',              cat: 'Loisirs',     amount: -7    },
  { date: '2025-06-18', desc: 'Docteur Lemaire',           cat: 'Santé',       amount: -30   },
  { date: '2025-06-17', desc: 'Boulangerie Paul',          cat: 'Alimentaire', amount: -12   },
  { date: '2025-06-16', desc: 'Spotify',                   cat: 'Loisirs',     amount: -10   },
  { date: '2025-06-15', desc: 'Lidl – Courses hebdo',      cat: 'Alimentaire', amount: -78   },
  { date: '2025-06-14', desc: 'Assurance Auto Maif',       cat: 'Transport',   amount: -56   },
  { date: '2025-06-13', desc: 'Virement épargne Livret A', cat: 'Virement',    amount: -400  },
  { date: '2025-06-12', desc: 'Bouygues Telecom',          cat: 'Divers',      amount: -22   },
  { date: '2025-06-11', desc: 'H&M',                       cat: 'Loisirs',     amount: -89   },
  { date: '2025-06-10', desc: 'Uber Eats',                 cat: 'Alimentaire', amount: -35   },
  { date: '2025-06-09', desc: 'Ikea',                      cat: 'Divers',      amount: -145  },
];

export const chartData = [
  { month: 'Jan', revenus: 2700, depenses: 1900 },
  { month: 'Fév', revenus: 2700, depenses: 2100 },
  { month: 'Mar', revenus: 2800, depenses: 1750 },
  { month: 'Avr', revenus: 2800, depenses: 1980 },
  { month: 'Mai', revenus: 2800, depenses: 1820 },
  { month: 'Jun', revenus: 2800, depenses: 1870 },
];
