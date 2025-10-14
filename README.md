# Justify API
Documentation de l’API de justification de texte. Cette API gère l’authentification, la justification de texte et le quota d’utilisation par token.

## Table des Matières
-[1. Authentification & justification du texte](#authentification)

  -[1.1 Obtenir un token](#obtenir-un-token)
  
  -[1.2 Accéder à l’API justify avec un token](#justifier-un-texte)


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
git clone https://github.com/votreutilisateur/justify-api.git
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
### ⚡ Scripts
Script	Description : 
```bash
npm run dev	    #Démarre le serveur en mode développement (avec nodemon & ts-node)
npm run build	    #Compile le TypeScript en JavaScript
npm start	    #Exécute le serveur compilé depuis dist
npm test	    #Lance les tests avec Jest
```
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
Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de Charles-Quint. 
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


## 🧪 Tests

Lancez les tests avec :
```bash
npm test
```
Les tests utilisent Jest avec le support ESM

## 🐳 Docker

La configuration Docker sera ajoutée prochainement – cette section inclura les instructions pour construire et exécuter le conteneur.

## ⚙️ CI/CD

La configuration GitHub Actions sera ajoutée prochainement – cette section détaillera l'exécution automatique des tests, la compilation et le déploiement sur AWS.

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

### 🔑 Variables d'Environnement

```PORT``` :	Port du serveur (par défaut : 3000)
```DATABASE_URL```	Chaîne de connexion PostgreSQL
``JWT_SECRET``	Clé secrète pour l'authentification JWT
```REDIS_URL```  Chaîne de connexion Redis