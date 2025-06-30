import { Code } from "@astrojs/starlight/components"
import src from "../../../../../../packages/sample/genaisrc/guard.genai.mjs?raw";

[Llama-guard3](https://ollama.com/library/llama-guard3) est un modèle LLM spécialisé dans la détection de contenus nuisibles dans le texte.
Le script que nous discutons vise à appliquer en lot llama-guard à vos fichiers.

En automatisant ce processus, vous pouvez gagner du temps et vous concentrer uniquement sur les fichiers nécessitant une attention particulière.

<Code code={src} wrap={true} lang="js" title="guard.genai.mjs" />

## Explication ligne par ligne du script 📜

Plongeons dans le script GenAI et comprenons ses composants :

```js
// Iterate over each file provided by the environment
for (const file of env.files) {
```

Ici, nous parcourons chaque fichier disponible dans le tableau `env.files`, qui contient les fichiers que vous souhaitez vérifier.

```js
// Use a GenAI model to analyze each file for safety
const { text } = await prompt`${file}`.options({
    model: "ollama:llama-guard3:8b",
    label: file.filename,
    cache: "llama-guard3:8b",
    system: [],
})
```

Ce bloc utilise le modèle GenAI [ollama\:llama-guard3:8b](https://ollama.com/library/llama-guard3) pour analyser le contenu de chaque fichier. La fonction `prompt` envoie le fichier au modèle, et différentes options sont définies pour spécifier le modèle, étiqueter le fichier, et gérer le cache.

```js
// Determine if the file is considered safe
const safe = /safe/.test(text) && !/unsafe/.test(text)
```

Le script vérifie si l'analyse du modèle considère le fichier comme sûr en recherchant le mot "safe" dans le texte de la réponse tout en s'assurant que "unsafe" n'y figure pas.

```js
// Log and store filenames of unsafe files
if (!safe) {
    console.error(text)
}
```

Si un fichier est jugé dangereux, ses détails sont affichés dans la console.

## Exécution du script avec le CLI GenAIScript 🚀

Pour exécuter ce script, vous devez utiliser le CLI GenAIScript. Si vous ne l'avez pas encore installé, suivez le [guide d'installation](https://microsoft.github.io/genaiscript/getting-started/installation).

Une fois installé, exécutez le script avec la commande suivante :

```shell
genaiscript run guard **/*.ts
```

Cette commande vérifie tous les fichiers correspondant à "\**/*.ts" et vous informe de ceux qui ne sont pas sûrs.

Bon codage et restez en sécurité ! 🛡️