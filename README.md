# Justify API
Documentation de l’API de justification de texte. Cette API gère l’authentification, la justification de texte et le quota d’utilisation par token.

## Pour accéder a la version live c'est sur 
### **```http://16.171.24.111/api/{token or justify}```**


## Table des Matières

- [1. Authentification & justification du texte](#1-authentification--justification-du-texte)  
  - [1.1 Obtenir un token](#11-obtenir-un-token)  
  - [1.2 Justifier un texte](#12-justifier-un-texte)  
- [2. Fonctionnalités](#2-🚀-fonctionnalités)  
- [3. Stack Technique](#3-🛠️-stack-technique)  
- [4. Installation](#4-📦-installation)  
- [5. Scripts](#5-⚡-scripts)  
- [6. API Documentation](#6-📝-api-documentation)  
- [7. Tests](#7-🧪-tests)  
- [8. Variables d'environnement](#8-🔑-variables-denvironnement)  
- [9. Docker](#9-🐳-docker)  
  - [9.1 Prérequis](#91-prérequis)  
  - [9.2 Construction et lancement avec Docker Compose](#92-construction-et-lancement-avec-docker-compose)  
  - [9.3 Remarques](#93-remarques)  
- [10. Structure du Projet](#10-📂-structure-du-projet)  


---

## 🚀 Fonctionnalités

- API RESTful avec Express
- Authentification basée sur JWT
- Validation des requêtes avec **Zod** et **Validator**
- Intégration PostgreSQL via `pg`
- Documentation de l'API avec **Swagger**
- Tests unitaires avec **Jest**
- Typage complet avec TypeScript
- Prêt pour Docker et CI/CD

---

## 🛠️ Stack Technique

- Node.js 22
- TypeScript
- Express 5
- PostgreSQL
- JWT
- Zod & Validator
- Jest pour les tests
- Docker (pour la conteneurisation)
- GitHub Actions (pour CI/CD)
- Swagger pour la documentation API

---

## 📦 Installation

Clonez le dépôt :

```bash
git clone https://github.com/LIMAMMohamedlimam/justify-api.git
cd justify-api
```
Installez les dépendances :
```bash
npm install
```

Configurez les variables d'environnement: 
```bash
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/dbname
JWT_SECRET=votre_secret_jwt
```
---
### ⚡ Scripts
Script	Description : 
```bash
npm run dev	    #Démarre le serveur en mode développement (avec nodemon & ts-node)
npm run build	    #Compile le TypeScript en JavaScript
npm start	    #Exécute le serveur compilé depuis dist
npm test	    #Lance les tests avec Jest
```
---
## 📝 API Documentation 

## Authentification & justification du texte
### Obtenir un token
**Endpoint : POST /api/token**
**Body (JSON) :**


```json
{
  "email": "foo@bar.com"
}
```

**Réponse (JSON) :**

```json
{
  "token": "votre_token_unique"
}
```
### Justifier un texte
**Endpoint : POST /api/justify**
**Headers :** 
***Authorization:*** ```Bearer: 123_token_unique_456```

***Content-Type:*** ```text/plain```

***Body (texte brut) :***
```
Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se
fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après,
la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je
croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des
réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu 
particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: 
une église, un quatuor, la rivalité de François Ier et de Charles-Quint. 
```
***Réponse (texte brut justifié) :***
```
Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,
mes  yeux se  fermaient si vite  que je  n’avais pas  le temps  de me  dire: «Je
m’endors.»  Et, une demi-heure après, la  pensée qu’il  était temps  de chercher
le  sommeil m’éveillait; je  voulais poser le  volume que je  croyais avoir dans
les mains  et souffler  ma lumière;  je n’avais  pas cessé  en dormant  de faire
des  réflexions  sur ce  que  je venais  de  lire, mais  ces  réflexions avaient
pris  un tour un  peu particulier; il me  semblait que j’étais  moi-même ce dont
parlait l’ouvrage: une  église, un quatuor,  la rivalité de  François Ier et  de
Charles-Quint.
 
```

vous pouvez retrouver également la documentation via Swagger UI
```
http://localhost:3000/api-docs
```
---

## 🧪 Tests

Lancez les tests avec :
```bash
npm test
```
Les tests utilisent Jest avec le support ESM

---
### 🔑 Variables d'Environnement

Le projet utilise un fichier .env pour configurer les services. Voici la description des principales variables (a récrée lors du premier lancement) :

```bash
# Clé secrète pour la génération de tokens JWT
JWT_SECRET=test-justify-secret


# Port d'écoute de l'API
PORT=80


# Configuration Redis
REDIS_HOST=redis # Nom du service Redis dans Docker Compose
REDIS_PORT=6379 # Port interne Redis


# Configuration base de données PostgreSQL
DATABASE_HOST=localhost # Adresse du serveur DB (docker : db)
DATABASE_PORT=5432 # Port interne PostgreSQL
DATABASE_USER=justifyuser # Nom d'utilisateur pour la DB
DATABASE_PASSWORD=securepassword # Mot de passe pour la DB
DATABASE_NAME=justifydb # Nom de la base de données
```

---
## 🐳 Docker

Le projet utilise Docker pour simplifier le développement et le déploiement. Il inclut une API Node.js, une base de données PostgreSQL et un cache Redis.

### Prérequis

Assurez-vous d'avoir installé :

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Construction et lancement avec Docker Compose

1. Clonez le dépôt et accédez au dossier du projet :

```bash
git https://github.com/LIMAMMohamedlimam/justify-api.git
cd justify-api/
```

2. Construisez et démarrez tous les conteneurs :

```bash
docker-compose up --build
or
docker compose up --build
```

Les services suivants seront lancés :

- **api** : l'API Node.js sur le port `80`
- **db** : base de données PostgreSQL sur le port `5433` 
- **redis** : serveur Redis sur le port `9001` 

3. Arrêtez les conteneurs :

```bash
docker-compose down
```

### Remarques

- Les données de la base sont persistées via un volume Docker (`pgdata`).
- Les variables d'environnement sont chargées depuis `.env`  et peuvent être surchargées dans `docker-compose.yml`.
- Une fois les conteneurs lancés, accédez à l'API via `http://<HOST>`.

---
## 📂 Structure du Projet

```
justify-api/
├─ src/
│  ├─ controllers/
│  ├─ routes/
│  ├─ middlewares/
│  ├─ utils/
│  └─ index.ts
├─ tests/
├─ package.json
├─ tsconfig.json
└─ README.md
```
