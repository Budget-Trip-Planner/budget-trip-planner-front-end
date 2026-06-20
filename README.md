# Budget Trip Planner — Front-end

Interface web du projet **Budget Trip Planner**, une application de planification de
voyage selon budget, préférences et contraintes. Construite avec **Angular**.
Projet de groupe — ESIEE Paris (E5, 2025/2026).

> Vue d'ensemble du projet : https://github.com/Budget-Trip-Planner
> Portfolio : https://afouanee.dev/projects/budget-trip-planner

---

## Stack

Angular · TypeScript · HTML / CSS · Docker

---

## Rôle dans l'architecture

Application cliente qui consomme l'API REST (Spring Boot) et gère l'authentification
côté utilisateur (jeton JWT).

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

# Via Docker
docker build -t btp-front .
docker run -p 80:80 btp-front
```

---

## Configuration

Renseigner l'URL de l'API back-end dans les fichiers d'environnement Angular
(`src/environments/`) selon l'environnement (dev / prod).

---

## Équipe

Projet de groupe — ESIEE Paris (E5, 2025/2026).
