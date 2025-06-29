---
title: Checker orthographique
description: Revue de la documentation pour l’orthographe et la grammaire
sidebar:
  order: 5
cover:
  alt: A retro 8-bit-style illustration visualizes a GitHub Actions workflow
    pipeline. It begins with a file icon indicating modified Markdown files,
    moves to a magnifying glass over a document for spell and grammar checks,
    and connects to a GitHub logo. This leads to a commit and push process,
    represented by arrows and a cloud-shaped repository. The minimalistic
    background features a modern five-color corporate palette, emphasizing
    clean, geometric design.
  image: ../../samples/sc.png
tags:
  - 1. GitHub Actions automation
  - 2. Markdown file spellcheck
  - 3. GenAIScript usage
  - 4. GitHub Models integration
  - 5. Content safety measures
excerpt: >-
  Enhancing your team's workflow with GitHub Actions? Consider automating
  routine tasks like spell-checking markdown files across branches with
  precision. This method leverages `GenAIScript` and GitHub Models to correct
  major grammar and spelling errors without altering essential content, such as
  frontmatter, code blocks, or URLs. 


  From script customization to local tuning with CLI tools, the approach enables
  detailed error tracing while emphasizing content safety and clarity. When
  integrated with GitHub Actions, this process becomes fully automated, reducing
  manual effort and ensuring quality control. Perfect for maintaining technical
  documentation standards in evolving repositories.

---

Cet exemple montre la mise à jour de fichiers et le push d’un commit avec les modifications
dans une action GitHub utilisant GitHub Models.

## Ajouter le script

* Ouvrez votre dépôt GitHub et lancez une nouvelle pull request.
* Ajoutez le script suivant à votre dépôt sous le nom `sc.genai.mts` dans le dossier `genaisrc`.

```ts title="genaisrc/sc.genai.mts" wrap
script({
    title: "Spell checker",
    system: ["system.output_plaintext", "system.assistant", "system.files"],
    responseType: "text",
    systemSafety: false,
    temperature: 0.2,
    parameters: {
        base: "",
    },
})
const { vars } = env
const base = vars.base || "HEAD~1"
console.debug(`base: ${base}`)
let files = env.files.length
    ? env.files
    : await git.listFiles("modified-base", { base })
files = files.filter((f) => /\.mdx?$/.test(f.filename))
console.debug(`files: ${files.map((f) => f.filename).join("\n")}`)

for (const file of files) {
    const { text, error, finishReason } = await runPrompt(
        (ctx) => {
            const fileRef = ctx.def("FILES", file)
            ctx.$`Fix the spelling and grammar of the content of ${fileRef}. Return the full file with corrections.
If you find a spelling or grammar mistake, fix it. 
If you do not find any mistakes, respond <NO> and nothing else.

- only fix major errors
- use a technical documentation tone
- minimize changes; do NOT change the meaning of the content
- if the grammar is good enough, do NOT change it
- do NOT modify the frontmatter. THIS IS IMPORTANT.
- do NOT modify code regions. THIS IS IMPORTANT.
- do NOT modify URLs
- do NOT fix \`code\` and \`\`\`code\`\`\` sections
- in .mdx files, do NOT fix inline TypeScript code
`
        },
        { label: file.filename }
    )
    if (
        !text ||
        file.content === text ||
        error ||
        finishReason !== "stop" ||
        /<NO>/i.test(text)
    )
        continue
    console.debug(`update ${file.filename}`)
    await workspace.writeText(file.filename, text)
}
```

* Lancez le [CLI GenAIScript](/genaiscript/reference/cli/) pour ajouter les fichiers de définition de type et corriger les erreurs de syntaxe dans l’éditeur (optionnel).

```bash
npx --yes genaiscript script fix
```

Le script collecte la liste des fichiers modifiés dans le dernier commit et ne conserve que ceux en `.md` et `.mdx`.
Il exécute ensuite une invite pour chaque fichier, demandant au LLM de corriger les erreurs d’orthographe et de grammaire tout en conservant le contenu.

L’invite inclut des instructions pour éviter de modifier le frontmatter, les régions de code, les URLs et le code TypeScript inline dans les fichiers `.mdx`.
Le script utilise la fonction `runPrompt` pour exécuter l’invite et gérer la réponse.
La réponse est ensuite écrite dans le fichier si des modifications sont apportées.
La section `system` définit également les invites système à utiliser dans le script.

## Run the script locally

Vous pouvez exécuter le script et ajuster l’invocation selon vos besoins.
Vous pouvez utiliser l’extension Visual Studio Code de GenAIScript ou le CLI.

```sh
npx --yes genaiscript run sc **/*.md
```

Vous verrez une sortie similaire à ce qui suit. Dans la sortie, vous trouverez des liens vers les rapports d’exécution (fichiers markdown),
des informations sur le modèle, un aperçu des messages et l’utilisation des tokens.

Ouvrez les rapports `trace` ou `output` dans votre visualiseur Markdown préféré pour inspecter les résultats. Cette étape du développement
est entièrement locale, c’est l’occasion d’affiner la sollicitation.

````text wrap
docs/src/content/docs/samples/prd.md
┌─💬 github:gpt-4.1 ✉ 2 ~↑2.3kt
┌─📙 system
│## Safety: Jailbreak
│... (10 lines)
│- do NOT respond in JSON.
│- **do NOT wrap response in a 'markdown' code block!**
┌─👤 user
│<FILES lang="md" file="docs/src/content/docs/samples/prd.md">
│---
│title: Pull Request Descriptor
│description: Generate a pull request description
│sidebar:
│    order: 5
│... (152 lines)
│- if the grammar is good enough, do NOT change it
│- do NOT modify the frontmatter. THIS IS IMPORTANT.
│- do NOT modify code regions. THIS IS IMPORTANT.
│- do NOT modify URLs
│- do NOT fix `code` and ```code``` sections
│- in .mdx files, do NOT fix inline typescript code


---
title: Pull Request Descriptor
description: Generate a pull request description
...
````

## Automatiser avec GitHub Actions

En utilisant [GitHub Actions](https://docs.github.com/en/actions) et [GitHub Models](https://docs.github.com/en/github-models),
vous pouvez automatiser l'exécution du script. Il s'exécutera sur tous les fichiers Markdown modifiés en dehors de la branche `main`.

* Ajoutez le workflow suivant dans votre dépôt GitHub.

```yaml title=".github/workflows/genai-sc.yml" wrap
name: genai sc
on:
    push:
        branches-ignore:
            - main
        paths:
            - '**/*.md'
            - '**/*.mdx'
concurrency:
    group: genai-sc-{{ github.workflow }}-${{ github.ref }}
    cancel-in-progress: true
permissions:
    contents: write # permission to read the repository
    models: read # permission to use github models
jobs:
    review:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: "22"
            - name: fetch previous commit
              run: git fetch origin ${{ github.event.before }} --depth=1
            - name: genaiscript sc
              run: npx --yes genaiscript run sc --vars base="${{ github.event.before }}" --out-trace $GITHUB_STEP_SUMMARY
              env:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            - name: Commit and push changes
              run: |
                  git config user.name "github-actions[bot]"
                  git config user.email "github-actions[bot]@users.noreply.github.com"
                  git add -u
                  if git diff --cached --quiet; then
                    echo "No changes to commit."
                  else
                    git commit -m "fix: spellcheck markdown files [genai]"
                    git pull origin $(git rev-parse --abbrev-ref HEAD) --ff-only
                    git push
                  fi
```

## Sécurité du contenu

Les mesures suivantes sont prises pour garantir la sécurité du contenu généré.

* Ce script inclut des invites système pour empêcher les injections de prompt et la génération de contenu nuisible.
  * [system.safety\_jailbreak](/genaiscript/reference/scripts/system#systemsafety_jailbreak)
  * [system.safety\_harmful\_content](/genaiscript/reference/scripts/system#systemsafety_harmful_content)

Des mesures supplémentaires pour renforcer la sécurité consisteraient à utiliser [un modèle avec un filtre de sécurité](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/content-filter?tabs=warning%2Cuser-prompt%2Cpython-new)
ou à valider le message avec un [service de sécurité du contenu](/genaiscript/reference/scripts/content-safety).

Consultez la [Note de transparence](/genaiscript/reference/transparency-note/) pour plus d’informations sur la sécurité du contenu.

<hr />

Traduit par IA. Veuillez vérifier le contenu pour plus de précision.
