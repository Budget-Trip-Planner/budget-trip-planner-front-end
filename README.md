# Budget Trip Planner — Front-end

Interface web du projet **Budget Trip Planner**, une application de planification de
voyage selon budget, préférences et contraintes. Construite avec **Angular**. Projet
académique de groupe — ESIEE Paris (E5, 2025/2026).

---

## État actuel

Ce dépôt correspond au front Angular du projet. À ce stade, il en est resté au
**squelette généré par `ng new`** : aucune route n'est implémentée (`app.routes.ts`
est vide) et la page d'accueil est encore le template par défaut d'Angular. Le
travail fonctionnel (pages, appels à l'API, gestion du token JWT) n'a pas été
démarré côté front.

---

## Stack

Angular 19 · TypeScript · HTML / CSS · Docker

---

## Rôle dans l'architecture

Le projet Budget Trip Planner est composé de plusieurs dépôts au sein de
l'organisation GitHub `Budget-Trip-Planner` :

- **Front-end** (ce dépôt) : application cliente Angular, censée consommer l'API
  REST et gérer l'authentification utilisateur (jeton JWT).
- **Back-end** : API REST en Spring Boot.
- **Datamodel** : modèle de données partagé (PostgreSQL).

```
Front Angular  ──REST/JWT──▶  API Spring Boot  ──▶  PostgreSQL
```

---

## Prérequis

- Node.js 18+ et npm
- Angular CLI (`npm install -g @angular/cli`)

---

## Installation et lancement

```bash
npm install

# Serveur de développement
ng serve
# → http://localhost:4200

# Build de production
ng build

# Via Docker (voir Dockerfile / entrypoint.sh : installe Angular CLI et lance ng serve)
docker build -t btp-front .
docker run -p 4200:4200 btp-front
```

---

## Configuration

Renseigner l'URL de l'API back-end dans les fichiers d'environnement Angular
(`src/environments/`) selon l'environnement (dev / prod) — dossier à créer, non
présent dans l'état actuel du dépôt.
