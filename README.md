# Widget Assistant Virtuel

Un widget de chatbot alimenté par l'API Gemini, conçu pour être facilement intégré dans un site web PHP.

## Fonctionnalités

- Interface utilisateur intuitive et réactive
- Basé sur l'API Gemini de Google pour des réponses intelligentes
- Utilise une base de connaissances personnalisable en JSON
- Animations fluides pour une expérience utilisateur améliorée
- Entièrement personnalisable pour s'adapter à votre identité visuelle

## Assistant Virtuel Hakach - Instructions d'intégration

### Installation rapide

Ajoutez le script suivant dans la section `<head>` ou à la fin du `<body>` de votre page HTML :

```html
<!-- Script principal du widget -->
<script src="https://widget.hakach.com/assistant-virtuel.js"></script>

<!-- Initialisation du widget -->
<script>
  window.AssistantVirtuel.init({
    apiKey: 'votre_cle_api_gemini',
    knowledgeBaseUrl: 'https://api.hakach.com/data/knowledge_base.json',
    primaryColor: '#ff9e0b',
    backgroundColor: '#000000',
    widgetTitle: 'Assistant Hakach Transfert'
  });
</script>
```

### Options de configuration

| Option | Type | Description | Défaut |
|--------|------|-------------|---------|
| `apiKey` | string | Votre clé API Gemini (requise) | - |
| `knowledgeBaseUrl` | string | URL de votre base de connaissances | - |
| `primaryColor` | string | Couleur principale du widget (format hex) | '#ff9e0b' |
| `backgroundColor` | string | Couleur de fond du widget (format hex) | '#000000' |
| `widgetTitle` | string | Titre affiché dans l'en-tête du widget | 'Assistant Hakach Transfert' |

### Personnalisation avancée

Vous pouvez personnaliser l'apparence du widget en ajoutant des styles CSS personnalisés :

```css
/* Exemple de personnalisation */
.hakach-widget {
  /* Vos styles personnalisés */
}
```

### Langues supportées

Le widget détecte automatiquement la langue de l'utilisateur et s'adapte parmi les langues suivantes :
- Français (fr)
- Anglais (en)
- Espagnol (es)
- Allemand (de)
- Arabe (ar)

### Support et contact

Pour toute question ou assistance technique :
- Email : support@hakach.com
- Documentation : https://docs.hakach.com/widget
- GitHub : https://github.com/hakach/virtual-assistant-widget

## Démarrage rapide

### Installation

1. Clonez ce dépôt :
```bash
git clone https://github.com/votre-utilisateur/virtual-assistant-widget.git
cd virtual-assistant-widget
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez votre clé API Gemini :
Remplacez la valeur de `GEMINI_API_KEY` dans le fichier `src/config/gemini.ts`.

4. Personnalisez votre base de connaissances :
Modifiez le fichier `public/data/knowledge_base.json` pour inclure vos propres questions et réponses.

5. Lancez le serveur de développement :
```bash
npm run dev
```

### Création du widget pour l'intégration

1. Construisez l'application pour la production :
```bash
npm run build
```

2. Lancez le serveur de production :
```bash
npm start
```

3. Le script du widget est disponible à l'URL : `http://localhost:3000/api/widget`

## Intégration dans un site PHP

Ajoutez le code suivant à votre site PHP :

```html
<!-- À la fin de votre body -->
<script src="https://votre-domaine.com/api/widget"></script>
<script>
  window.AssistantVirtuel.init({
    apiKey: 'votre_clé_api_gemini',
    knowledgeBaseUrl: 'https://votre-domaine.com/data/knowledge_base.json',
    primaryColor: '#3b82f6',
    widgetTitle: 'Assistant Virtuel'
  });
</script>
```

## Options de configuration

| Option | Type | Description | Valeur par défaut |
|--------|------|-------------|------------------|
| `apiKey` | String | Votre clé API Gemini | `''` |
| `knowledgeBaseUrl` | String | URL vers votre fichier JSON de base de connaissances | `/data/knowledge_base.json` |
| `position` | String | Position du widget (`bottom-right`, `bottom-left`, `top-right`, `top-left`) | `bottom-right` |
| `primaryColor` | String | Couleur principale du widget (format hexadécimal) | `#3b82f6` |
| `widgetTitle` | String | Titre affiché dans l'en-tête du widget | `Assistant Virtuel` |

## Structure de la base de connaissances

Le fichier JSON de base de connaissances doit suivre ce format :

```json
[
  {
    "question": "Question fréquemment posée 1 ?",
    "answer": "Réponse à la question 1."
  },
  {
    "question": "Question fréquemment posée 2 ?",
    "answer": "Réponse à la question 2."
  }
]
```

## Déploiement sur Vercel

Le projet est optimisé pour un déploiement sur Vercel. Suivez ces étapes pour déployer :

1. **Préparez votre projet pour Vercel** :
   ```bash
   # Installez la CLI Vercel si ce n'est pas déjà fait
   npm i -g vercel
   ```

2. **Configurez les variables d'environnement** :
   - Créez un fichier `.env` à la racine du projet
   - Ajoutez votre clé API Gemini :
   ```env
   GEMINI_API_KEY=votre_cle_api_gemini
   ```

3. **Déployez sur Vercel** :
   ```bash
   # Connectez-vous à votre compte Vercel
   vercel login

   # Déployez le projet
   vercel
   ```

   Ou simplement connectez votre dépôt GitHub à Vercel pour des déploiements automatiques.

4. **Configuration du domaine** :
   - Allez dans les paramètres du projet sur Vercel
   - Configurez votre domaine personnalisé
   - Ajoutez les enregistrements DNS nécessaires

5. **Variables d'environnement sur Vercel** :
   - Dans les paramètres du projet Vercel
   - Section "Environment Variables"
   - Ajoutez `GEMINI_API_KEY` avec votre clé de production

### Optimisations incluses

- Compression automatique des assets
- Mise en cache optimisée
- Headers de sécurité préconfigurés
- Support CORS pour l'API
- Optimisation des images
- Build optimisé avec Preact en production

### Surveillance et analytics

Utilisez le dashboard Vercel pour :
- Surveiller les performances
- Voir les logs en temps réel
- Analyser les métriques
- Gérer les déploiements

## Licence

MIT
