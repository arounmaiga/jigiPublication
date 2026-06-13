# Exécuter le pipeline JIGI end-to-end — Guide collègue

Ce guide explique comment lancer le pipeline complet (texte → images → voix → vidéo)
avec **vos propres comptes** sur les services payants.

> ⚠️ Liste **déduite du code** de ce dépôt. La liste exacte = les nœuds du workflow n8n.
> En cas de doute, ouvrez le workflow importé et vérifiez chaque nœud.

---

## 1. Comprendre l'architecture

```
n8n (LE pipeline : détient les clés API, orchestre tout)
   ├─ Claude       → génère les textes (hook, stats, sous-titres)
   ├─ fal.ai       → génère les images (Flux Pro) + B-roll (Kling)
   ├─ ElevenLabs   → génère la voix-off (MP3)
   ├─ Hébergeur    → upload des assets → URLs publiques
   └─ POST /render → moteur Remotion (HF Space) → produit le MP4 final
                     (ce dépôt Git — AUCUNE clé API, sans état)
```

**Le code Git = uniquement le moteur de rendu.** Le pipeline lui-même vit dans n8n.
Pour un run end-to-end, vous avez besoin du **workflow n8n**, pas (ou pas seulement) du code.

---

## 2. Étapes (chemin le plus simple)

1. **Récupérer le workflow** : demandez le fichier `workflow.json` (Export depuis n8n).
2. **Importer** : dans votre n8n → *Workflows* → *Import from File* → sélectionnez le `.json`.
3. **Créer vos credentials** (voir section 3) et relier chaque nœud à VOS credentials.
4. **Nœud de rendu** : le nœud HTTP `POST /render` peut rester pointé sur le HF Space
   existant (pas d'authentification requise). Rien à changer pour tester.
5. **Execute Workflow** → la vidéo est rendue et son URL renvoyée. 🎬

---

## 3. Credentials à créer dans n8n

| # | Service | Rôle | Type credential | Où récupérer la clé | Payant ? |
|---|---------|------|-----------------|---------------------|----------|
| 1 | **Anthropic / Claude** | Textes | API Key — header `x-api-key` | console.anthropic.com → *API Keys* | 💳 au token |
| 2 | **fal.ai** | Images + B-roll | API Key — header `Authorization: Key <FAL_KEY>` | fal.ai/dashboard/keys | 💳 à l'usage |
| 3 | **ElevenLabs** | Voix-off | API Key — header `xi-api-key` | elevenlabs.io → *Profile → API Keys* | 💳 crédits |
| 4 | **Hébergeur images/audio** (imgBB ou équiv.) | URLs publiques des assets | API Key | imgbb.com/api (ou service réel du workflow) | gratuit / freemium |
| 5 | **Renderer Remotion** (HF Space) | Rendu MP4 | **AUCUNE** (pas d'auth) | URL du endpoint `/render` | gratuit |

### Détails

**1. Anthropic (Claude)**
- Credential n8n : *Anthropic API* (ou HTTP Header Auth pour un nœud HTTP brut).
- Header : `x-api-key: sk-ant-...`

**2. fal.ai**
- Credential n8n : généralement *HTTP Header Auth* sur un nœud HTTP Request.
- Header : `Authorization: Key <FAL_KEY>`
- Poste de coût principal (génération images/vidéos).

**3. ElevenLabs**
- Credential n8n : *ElevenLabs* si disponible, sinon *HTTP Header Auth*.
- Header : `xi-api-key: <clé>`
- Vérifier aussi le `voice_id` (paramètre, pas un secret).

**4. Hébergeur d'images/audio**
- Transforme les fichiers générés en URLs publiques (le renderer ne lit que des URLs).
- Vérifier lequel est réellement branché : imgBB ? Cloudinary ? S3 ? catbox ?

**5. Renderer (HF Space)**
- Rien à configurer côté secret. Seule l'URL `/render` est nécessaire dans le nœud HTTP.

---

## 4. À vérifier (ce ne sont PAS des secrets)

- **catbox.moe** → assets fixes (musique kora, logo JIGI), URLs publiques sans auth.
- **voice_id** ElevenLabs, **modèles** Claude / fal.ai → paramètres dans les nœuds.
- **URL du renderer** dans le nœud HTTP `POST /render`.

---

## 5. (Optionnel) Indépendance totale — son propre renderer

Pour ne pas dépendre du HF Space d'origine :

1. `git clone https://github.com/arounmaiga/jigiPublication.git`
2. Créer un Space Hugging Face (SDK **Docker**) et y déployer le repo.
3. Dans le nœud HTTP de n8n, remplacer l'URL `/render` par celle de SON Space.

Le renderer ne nécessite aucune clé API — seulement Chromium + ffmpeg, déjà gérés par le `Dockerfile`.

---

## 6. Récap express

> Créez **3 clés API obligatoires** (Anthropic, fal.ai, ElevenLabs) + **1 clé d'hébergement**
> d'images, branchez-les dans les *Credentials* de votre n8n, laissez le nœud de rendu
> pointer vers le HF Space existant. Cliquez **Execute Workflow**. C'est tout.

---

## Format de l'appel au renderer (référence)

Le pipeline appelle le service de rendu ainsi :

```http
POST https://<hf-space>/render
Content-Type: application/json

{
  "compositionId": "DynamicPost",
  "props": {
    "imageUrls": ["https://.../img1.jpg", "https://.../img2.jpg"],
    "audioUrl": "https://.../voiceover.mp3",
    "backgroundMusicUrl": "https://files.catbox.moe/0qxh0p.mp3",
    "subtitles": ["...", "..."],
    "durationInSeconds": 30,
    "hookTitle": "JIGI",
    "persona": "Aminata",
    "closingStat": "...",
    "closingStatSource": "...",
    "closingImageUrl": "https://.../closing.jpg"
  }
}
```

Réponse : `{ "status": "succeeded", "url": "https://.../out/xxx.mp4", "fileName": "...", "size": 123456 }`

Compositions disponibles : `DynamicPost` (n8n), `JigiPromo`, `AminataTestimonial`.
