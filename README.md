# FutureBank — La banque intelligente des étudiants

> Une application de gestion financière pensée pour les étudiants, avec conseiller IA, suivi budgétaire, détection automatique des aides et simulation bancaire.

---

## Présentation

**FutureBank** est une application web monopage (SPA) qui simule un tableau de bord bancaire étudiant. Elle permet de :

- Suivre son solde, ses revenus et ses dépenses en temps réel
- Gérer son budget par catégorie avec scoring financier
- Obtenir des conseils personnalisés via un conseiller IA (Claude d'Anthropic)
- Découvrir les aides étudiantes auxquelles on est éligible (bourse CROUS, APL, Pass'sport…)
- Renseigner son profil étudiant pour affiner l'analyse d'éligibilité
- Simuler son historique bancaire mois par mois avec résumé annuel

---

## Stack technique

| Technologie | Usage |
|---|---|
| **Vanilla JavaScript (ES6 modules)** | Logique applicative |
| **Vite 5** | Serveur de développement & build |
| **HTML5 / CSS3** | Structure et styles (17 fichiers CSS modulaires) |
| **Anthropic API (Claude)** | Conseiller IA en temps réel |
| **Google Fonts** | Typographies DM Serif Display & DM Sans |

Aucune dépendance front-end externe (pas de React, Vue, Angular). Tout est en JavaScript natif.

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- npm (inclus avec Node.js)

---

## Installation et lancement

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/futurebank.git
cd futurebank
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

L'application est accessible sur **http://localhost:5173**

### 4. Build de production (optionnel)

```bash
npm run build      # génère le dossier dist/
npm run preview    # prévisualise le build de production
```

---

## Activer le conseiller IA (optionnel)

Le conseiller IA fonctionne sans clé API avec des réponses prédéfinies adaptées aux étudiants. Pour activer les réponses en temps réel via Claude :

1. Créez un compte sur [console.anthropic.com](https://console.anthropic.com)
2. Générez une clé API (commence par `sk-ant-…`)
3. Dans l'application, allez dans **Conseiller IA**
4. Collez votre clé dans le champ prévu et cliquez **Enregistrer**

> La clé reste uniquement dans votre navigateur (aucun serveur intermédiaire).

---

## Structure du projet

```
FutureBank-main/
├── index.html                  # Point d'entrée — toute la structure HTML
├── package.json
└── src/
    ├── main.js                 # Initialisation + exposition des fonctions window
    ├── js/
    │   ├── data.js             # État global et données mock (profil étudiant)
    │   ├── navigation.js       # Routage SPA (navigate, initNavigation)
    │   ├── utils.js            # Fonctions utilitaires (fmt, dates…)
    │   └── pages/
    │       ├── dashboard.js    # Tableau de bord (stats, graphique, transactions)
    │       ├── transactions.js # Liste des transactions avec recherche/filtre
    │       ├── budget.js       # Suivi budgétaire, score financier, prévisions
    │       ├── ai.js           # Conseiller IA — intégration Anthropic API
    │       ├── recommandations.js  # Recommandations de placements/épargne
    │       ├── aides.js        # Aides étudiantes avec éligibilité calculée
    │       ├── eligibilite.js  # Questionnaire profil étudiant
    │       ├── simulation.js   # Simulation bancaire & historique mensuel
    │       └── settings.js     # Paramètres du compte
    └── css/
        ├── main.css            # Fichier d'import central
        ├── variables.css       # Tokens de design (couleurs, typographie)
        ├── base.css
        ├── layout.css          # Sidebar + topbar
        ├── components.css      # Boutons, cartes, formulaires
        ├── dashboard.css
        ├── transactions.css
        ├── budget.css
        ├── ai.css
        ├── recommendations.css
        ├── settings.css
        └── responsive.css
```

---

## Pages disponibles

| Page | Route | Description |
|---|---|---|
| Tableau de bord | `dashboard` | Vue d'ensemble : solde, revenus, dépenses, graphique 6 mois |
| Transactions | `transactions` | Historique avec recherche et filtre par catégorie |
| Budget prévisionnel | `budget` | Suivi par catégorie, score financier, projection 3 mois |
| Conseiller IA | `conseiller` | Chatbot IA étudiant (réponses prédéfinies ou Claude API) |
| Recommandations | `recommandations` | Placements et épargne adaptés au profil |
| Aides Étudiantes | `aides` | 12 aides étudiantes avec éligibilité automatique |
| Mon Profil Étudiant | `eligibilite` | Questionnaire d'éligibilité (bourse, logement, sport…) |
| Ma Simulation | `simulation` | Personnalisation du solde et historique mois/an |
| Paramètres | `compte` | Modifier les données du compte (nom, revenus, objectifs…) |

---

## Aides étudiantes détectées

L'application calcule automatiquement l'éligibilité aux aides suivantes à partir du profil renseigné dans **Mon Profil Étudiant** :

- 🎓 **Bourse CROUS** (échelons 0 à 7 — jusqu'à 623 €/mois)
- 🏠 **APL / Aide au logement** (CAF — jusqu'à 280 €/mois)
- 🔑 **Garantie Visale** (caution gratuite)
- ⚽ **Pass'Sport** (50 €/an pour inscription en club)
- ✈️ **Aide à la mobilité internationale** (400 €/mois Erasmus+)
- 🏥 **Complémentaire Santé Solidaire** (mutuelle gratuite)
- 🍽️ **Tarif social RU** (repas à 1 € pour boursiers)
- 🏆 **Aide au mérite** (900 €/an mention TB)
- 💼 **Prime d'activité** (pour étudiants-salariés)
- ♿ **AAH** (Allocation Adulte Handicapé)
- 💻 **Aide à l'équipement numérique**
- 🚌 **Carte Imagine R** (transports Île-de-France à tarif réduit)

---

## Données de démonstration

Le profil par défaut est **Alex Dubois**, étudiant en Licence boursier CROUS échelon 3, logé en résidence universitaire avec 850 €/mois de revenus (bourse + job étudiant). Toutes les données sont modifiables depuis :

- **Paramètres du compte** — pour les données financières
- **Mon Profil Étudiant** — pour les données académiques et d'éligibilité
- **Ma Simulation** — pour construire un historique bancaire personnalisé

---

## Personnalisation

### Changer le profil par défaut

Éditez [`src/js/data.js`](src/js/data.js) :

```js
export const state = {
  prenom: 'Alex',
  solde: 1240,
  revenus: 850,
  loyer: 380,
  boursier: true,
  echelon: 3,
  // ...
};
```

### Ajouter des transactions

Dans [`src/js/data.js`](src/js/data.js), ajoutez une entrée dans le tableau `transactions` :

```js
{ date: '2025-07-01', desc: 'Bourse CROUS — Juillet', cat: 'Revenus', amount: +487 },
```

---

## Modèle IA utilisé

Le conseiller IA utilise **`claude-haiku-4-5-20251001`** (Anthropic), optimisé pour la rapidité et le coût, idéal pour une interface de chat. Le prompt système inclut automatiquement le contexte financier complet de l'étudiant.

---

## Licence

Projet éducatif — libre d'utilisation et de modification.
