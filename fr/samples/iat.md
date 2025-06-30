import { Code } from "@astrojs/starlight/components"
import source from "../../../../../../packages/sample/genaisrc/samples/iat.genai.mts?raw";

Le texte alternatif est essentiel pour rendre les images accessibles à tous, y compris aux personnes malvoyantes. Il fournit une description textuelle de l'image, permettant aux lecteurs d'écran de transmettre le contenu aux utilisateurs qui ne peuvent pas voir l'image.
Cependant, écrire du texte alternatif pour les images peut prendre du temps, surtout lorsqu'il s'agit d'un grand nombre d'images. C'est là que l'IA peut aider. En utilisant un modèle de langage comme GPT-4 d'OpenAI, vous pouvez générer automatiquement du texte alternatif pour les images, ce qui permet de gagner du temps et de l'effort.

Dans cet exemple, nous allons construire un outil qui génère du texte alternatif pour les images dans les fichiers Markdown.

## Configuration du script

Ce script est composé de code TypeScript, conçu pour s'exécuter avec le GenAIScript CLI. Décomposons-le :

```ts
script({
    title: "Image Alt Textify",
    description: "Generate alt text for images in markdown files",
    accept: "none",
    parameters: {
        docs: {
            type: "string",
            description: "path to search for markdown files",
            default: "**.{md,mdx}",
        },
        force: {
            type: "boolean",
            description: "regenerate all descriptions",
            default: false,
        },
        assets: {
            type: "string",
            description: "image assets path",
            // change the default path to your assets folder
            default: "./assets/images",
        },
    },
})
```

Ici, nous déclarons le script avec un titre et une description, en précisant qu'il utilise le modèle GPT-4 d'OpenAI.
Nous définissons également des paramètres pour les chemins de fichiers, l'option de régénérer toutes les descriptions, ainsi que le chemin des ressources.

Ensuite, nous extrayons les variables d'environnement :

```ts
const { docs, force, assets } = env.vars
```

## Recherche d'images

Ensuite, nous définissons une expression régulière pour trouver les images dans Markdown :

```ts
const rx = force
    ? // match ![alt?](path) with alt text or not
      /!\[[^\]]*\]\(([^\)]+\.(png|jpg))\)/g
    : // match ![](path) without alt text
      /!\[\s*\]\(([^\)]+\.(png|jpg))\)/g

const { files } = await workspace.grep(rx, {
    path: docs,
    glob: "*.{md,mdx}",
    readText: true,
})
```

Le script utilise [workspace.grep](../../reference/scripts/files#grep/) pour trouver toutes les occurrences du motif regex dans les documents spécifiés.

## Génération du texte alternatif

Pour chaque URL d'image trouvée, nous générons un texte alternatif en utilisant un [prompt inline](../../reference/scripts/inline-prompts/)
et [defImages](../../reference/scripts/images/).

```ts
for (const file of files) {
    const { filename, content } = file

    // map documentation relative path to assets path
    const url = resolveUrl(filename)

    // execute a LLM query to generate alt text
    const { text } = await runPrompt(
        (_) => {
            _.defImages(resolvedUrl)
            _.$`
                You are an expert in assistive technology.

                You will analyze the image
                and generate a description alt text for the image.

                - Do not include alt text in the description.
                - Keep it short but descriptive.
                - Do not generate the [ character.`
        },
        {
            // safety system message to prevent generating harmful text
            system: ["system.safety_harmful_content"],
            // use multi-model model
            model: "openai:gpt-4o",
            ...
        }
    )

    imgs[url] = text
}
```

## Mise à jour des fichiers

Enfin, nous mettons à jour le contenu Markdown avec le texte alternatif généré :

```ts
const newContent = content.replace(
    rx,
    (m, url) => `![${imgs[url] ?? ""}](${url})`
)
if (newContent !== content) await workspace.writeText(filename, newContent)
```

Nous remplaçons le substitut dans le contenu original par le texte alternatif et enregistrons le fichier mis à jour.

## 💻 Comment exécuter le script

Pour exécuter ce script, vous aurez besoin du GenAIScript CLI.
Si vous ne l'avez pas encore installé, consultez le [guide d'installation](https://microsoft.github.io/genaiscript/getting-started/installation).

Une fois que vous avez le CLI, vous pouvez exécuter le script avec la commande suivante :

```bash
npx genaiscript run iat
```

## Automatisation avec GitHub Actions et GitHub Models

L'action GitHub suivante automatise le processus de génération du texte alternatif pour les images dans les fichiers Markdown. Elle s'exécute à chaque push sur la branche `dev` et utilise le CLI `genaiscript` pour exécuter le script.
Elle utilise le modèle OpenAI `gpt-4.1` via GitHub Models pour l'inférence.

```yml title=".github/workflows/genai-iat.yml"
name: genai iat
on:
    workflow_dispatch:
    push:
        branches:
            - dev
        paths:
            - "**.md*"
concurrency:
    group: iat-${{ github.workflow }}-${{ github.ref }}
    cancel-in-progress: true
permissions:
    pull-requests: write
    models: read
    contents: write
jobs:
    generate-alt-text:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
            - name: genaiscript
              run: npx --yes genaiscript run iat -m github:openai/gpt-4.1 --out-trace $GITHUB_STEP_SUMMARY
              env:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            - uses: stefanzweifel/git-auto-commit-action@v5
              with:
                  commit_message: "[genai] image alt text"
                  commit_user_name: "genaiscript"
```

## Source complète ([GitHub](https://github.com/microsoft/genaiscript/blob/main/packages/sample/genaisrc/samples/iat.genai.mts))

<Code code={source} wrap={true} lang="ts" title="iat.genai.mts" />

## Sécurité du contenu

Les mesures suivantes sont prises pour garantir la sécurité du contenu généré.

* Ce script inclut des invites système pour empêcher les injections de prompt et la génération de contenu nuisible.
  * [system.safety\_jailbreak](../../reference/scripts/system#systemsafety_jailbreak/)
  * [system.safety\_harmful\_content](../../reference/scripts/system#systemsafety_harmful_content/)
* La description générée est sauvegardée dans un fichier à un chemin spécifique, ce qui permet une revue manuelle avant de valider les modifications.

Des mesures supplémentaires pour renforcer la sécurité consisteraient à utiliser [un modèle avec un filtre de sécurité](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/content-filter?tabs=warning%2Cuser-prompt%2Cpython-new)
ou à valider le message avec un [service de sécurité du contenu](../../reference/scripts/content-safety/).

Consultez la [Note de transparence](../../reference/transparency-note/) pour plus d’informations sur la sécurité du contenu.