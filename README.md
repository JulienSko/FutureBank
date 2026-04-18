# FutureBank — La banque intelligente des étudiants

> Une application de gestion financière pensée pour les étudiants, avec conseiller IA, suivi budgétaire, détection automatique des aides, simulation bancaire et mode sombre.

---

## Présentation

**FutureBank** est une application web monopage (SPA) qui simule un tableau de bord bancaire étudiant. Elle permet de :

- Suivre son solde, ses revenus et ses dépenses en temps réel
- Gérer son budget par catégorie avec alertes et scoring financier adapté aux étudiants
- Comparer le **prévisionnel vs le réel** mois par mois
- Obtenir des conseils personnalisés via un conseiller IA (Claude d'Anthropic)
- Découvrir les aides étudiantes auxquelles on est éligible (bourse CROUS, APL, Pass'sport…)
- Renseigner son profil étudiant pour affiner l'analyse d'éligibilité
- Simuler son historique bancaire mois par mois — **synchronisé avec le tableau de bord**
- Exporter ses transactions en **CSV**
- Basculer en **mode sombre**
- Retrouver toutes ses données après rechargement grâce à la **persistance localStorage**

---

## Stack technique

| Technologie | Usage |
|---|---|
| **Vanilla JavaScript (ES6 modules)** | Logique applicative |
| **Vite 5** | Serveur de développement & build |
| **HTML5 / CSS3** | Structure et styles (18 fichiers CSS modulaires) |
| **Anthropic API (Claude)** | Conseiller IA en temps réel |
| **localStorage** | Persistance des données entre sessions |
| **Google Fonts** | Typographies DM Serif Display & DM Sans |

Aucune dépendance front-end externe (pas de React, Vue, Angular).

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- npm (inclus avec Node.js)

---

## Installation et lancement

### 1. Cloner le projet

```bash
git clone https://github.com/JulienSko/FutureBank.git
cd FutureBank
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
FutureBank/
├── index.html                  # Point d'entrée — toute la structure HTML
├── package.json
└── src/
    ├── main.js                 # Init, exposition window, loadAll au démarrage
    ├── js/
    │   ├── data.js             # État global et données mock (profil étudiant)
    │   ├── navigation.js       # Routage SPA
    │   ├── storage.js          # Persistance localStorage + toggle dark mode
    │   ├── utils.js            # Fonctions utilitaires (fmt, dates…)
    │   └── pages/
    │       ├── dashboard.js    # Tableau de bord — lit accountHistory pour le graphique
    │       ├── transactions.js # Liste + recherche/filtre + export CSV
    │       ├── budget.js       # Suivi, alertes, prévisionnel vs réel, score étudiant
    │       ├── ai.js           # Conseiller IA — intégration Anthropic API corrigée
    │       ├── recommandations.js  # Recommandations de placements/épargne
    │       ├── aides.js        # 12 aides étudiantes avec éligibilité calculée
    │       ├── eligibilite.js  # Questionnaire profil étudiant
    │       ├── simulation.js   # Simulation bancaire & historique — sync dashboard
    │       └── settings.js     # Paramètres du compte
    └── css/
        ├── main.css            # Fichier d'import central
        ├── variables.css       # Tokens de design + variables dark mode
        ├── dark.css            # Overrides mode sombre
        ├── base.css
        ├── layout.css
        ├── components.css
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
| Tableau de bord | `dashboard` | Vue d'ensemble — graphique synchronisé avec la simulation |
| Transactions | `transactions` | Historique avec recherche, filtre et export CSV |
| Budget prévisionnel | `budget` | Suivi, alertes dépassement, prévisionnel vs réel, score étudiant |
| Conseiller IA | `conseiller` | Chatbot IA étudiant (réponses prédéfinies ou Claude API) |
| Recommandations | `recommandations` | Placements et épargne adaptés au profil |
| Aides Étudiantes | `aides` | 12 aides étudiantes avec éligibilité automatique |
| Mon Profil Étudiant | `eligibilite` | Questionnaire d'éligibilité (bourse, logement, sport…) |
| Ma Simulation | `simulation` | Solde + historique mois par mois → met à jour le dashboard |
| Paramètres | `compte` | Modifier les données financières et le profil |

---

## Fonctionnalités détaillées

### Tableau de bord synchronisé
Le graphique des flux financiers lit directement `accountHistory` (géré dans **Ma Simulation**). Ajouter ou supprimer un mois dans la simulation met à jour le graphique instantanément.

### Alertes budget
Chaque catégorie affiche un badge coloré :
- 🟢 Vert — dans le budget
- 🟡 Ambre — > 80% du budget
- 🔴 Rouge + montant dépassé — budget dépassé

### Prévisionnel vs Réel
Tableau comparatif dans la page Budget : budget fixé vs dépenses réelles, avec écart et alerte globale.

### Score financier étudiant
Les seuils d'épargne sont adaptés aux revenus modestes : 8% d'épargne est considéré comme bon pour un étudiant (vs 20% pour un salarié).

### Export CSV
Bouton dans la page Transactions — exporte les transactions filtrées au format CSV (encodage UTF-8 avec BOM pour Excel).

### Mode sombre
Bouton 🌙 dans la barre supérieure. Préférence sauvegardée en localStorage.

### Persistance localStorage
Toutes les modifications (profil, solde, historique, thème) sont sauvegardées automatiquement et rechargées au démarrage. Pour réinitialiser : `resetAll()` dans la console.

---

## Aides étudiantes détectées

L'application calcule automatiquement l'éligibilité aux aides suivantes depuis **Mon Profil Étudiant** :

- 🎓 **Bourse CROUS** (échelons 0 à 7 — jusqu'à 623 €/mois)
- 🏠 **APL / Aide au logement** (CAF — jusqu'à 280 €/mois)
- 🔑 **Garantie Visale** (caution gratuite)
- ⚽ **Pass'Sport** (50 €/an)
- ✈️ **Aide à la mobilité internationale** (400 €/mois Erasmus+)
- 🏥 **Complémentaire Santé Solidaire** (gratuite)
- 🍽️ **Tarif social RU** (1 €/repas pour boursiers)
- 🏆 **Aide au mérite** (900 €/an)
- 💼 **Prime d'activité** (étudiants-salariés)
- ♿ **AAH** (Allocation Adulte Handicapé)
- 💻 **Aide à l'équipement numérique**
- 🚌 **Carte Imagine R** (transports IDF à tarif réduit)

---

## Données de démonstration

Profil par défaut : **Alex Dubois**, étudiant en Licence, boursier CROUS échelon 3, résidence universitaire, 850 €/mois. Modifiable depuis :

- **Paramètres du compte** — données financières
- **Mon Profil Étudiant** — données académiques et éligibilité
- **Ma Simulation** — historique bancaire personnalisé

Pour repartir de zéro : ouvrir la console du navigateur et taper `resetAll()`.

---

## Modèle IA utilisé

`claude-haiku-4-5-20251001` (Anthropic) — rapide et économique, idéal pour le chat. Le prompt système inclut le contexte financier et académique complet de l'étudiant.

---

## Licence

Projet éducatif — libre d'utilisation et de modification.
