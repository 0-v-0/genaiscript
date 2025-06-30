import { Code } from "@astrojs/starlight/components";
import scriptSrc from "../../../../../../packages/sample/genaisrc/git-release-notes.genai?raw";

Il existe de nombreux générateurs automatisés de `notes de version` qui examinent la liste des commits depuis la dernière version et génèrent une liste de modifications. Les notes de version sont généralement basées exclusivement sur les messages de commit.

Dans le projet GenAIScript, nous créons un générateur de notes de version **qui utilise à la fois l'historique des commits et le diff des modifications**.

Vous pouvez voir l'une des premières notes de version générées par prototype pour [v1.41.6](https://github.com/microsoft/genaiscript/releases/tag/1.41.6).

```markdown wrap
We are excited to announce the release of GenAIScript 1.41.6! 🎉

In this release, we've made some significant improvements to enhance your experience. Here are the key changes:

Improved Release Script: We've fine-tuned our release script to ensure smoother and more efficient releases in the future. 🛠️
...
```

## Historique des commits et diff

Nous commençons notre script en appelant `git` plusieurs fois pour récupérer le tag de la version précédente, la liste des commits, et le diff depuis ce tag. (Cette astuce a principalement été trouvée lors d'une session GitHub Copilot Chat).

```js title="git-release-notes.genai.mjs" wrap
const { stdout: tag } = await host.exec(
  `git describe --tags --abbrev=0 HEAD^`,
);

const { stdout: commits } = await host.exec(
  `git log HEAD...${tag}`,
);

const { stdout: diff } = await host.exec(
  `git diff ${tag}..HEAD`,
);
```

Nous utilisons la fonction `def` avec `maxTokens` pour intégrer ces informations sans dépasser la fenêtre de contenu du modèle (entrée de 32k).

```js title="git-release-notes.genai.mjs" wrap
def("COMMITS", commits, { maxTokens: 4000 });
def("DIFF", diff, { maxTokens: 20000 });
```

## Rôle et tâche

Le reste du script suit un schéma typique avec un rôle et une tâche.

```js wrap
$`
You are an expert software developer and release manager.

## Task

Generate a clear, exciting, relevant, useful release notes
for the upcoming release. 

- The commits in the release are in COMMITS.
- The diff of the changes are in DIFF.
`;
```

## Le script

Le script complet tel qu'il s'exécute dans GenAIScript est le suivant :

<Code code={scriptSrc} wrap={true} lang="js" title="git-release-notes.genai.mjs" />

## Intégration Release-it

GenAIScript utilise [release-it](https://github.com/release-it/release-it) pour automatiser le processus de publication. Nous avons configuré release-it pour exécuter le script à l'aide du [cli](../../reference/cli/) en ajoutant un champ `github.releaseNotes` dans la configuration de `release-it`.

```json title="package.json" wrap
 "release-it": {
     "github": {
        "releaseNotes": "node packages/cli/dist/src/index.js run git-release-notes --cache --cache-name releases --no-run-trace --no-output-trace"
     }
 }
```