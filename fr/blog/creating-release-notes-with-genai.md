import BlogNarration from "../../../../components/BlogNarration.astro";

<BlogNarration />

Lancer une nouvelle version d'un produit est toujours excitant ! Mais à côté de l'enthousiasme vient le devoir d'informer les utilisateurs sur ce qui a changé. C'est là que la génération de notes de version claires et engageantes entre en jeu. ✨

Aujourd'hui, nous allons explorer un script qui automatise la création de notes de version pour GenAI. Ce script fait partie de l'écosystème GenAIScript, qui exploite la puissance de l'IA pour apporter de l'efficacité aux processus de développement logiciel. 🚀

Si vous souhaitez plonger directement dans le script, il est disponible sur GitHub juste [ici](https://github.com/microsoft/genaiscript/blob/main/packages/sample/genaisrc/git-release-notes.genai.mjs).

> Cet article de blog a été coécrit avec un [script](https://github.com/microsoft/genaiscript/blob/main/packages/sample/genaisrc/blogify-sample.genai.mts).

### Décomposition du script

Le script est un fichier `.genai.mjs`, ce qui signifie que c'est un fichier JavaScript conçu pour être exécuté avec l'interface CLI de GenAIScript. Le code orchestre la création de notes de version en exploitant des commandes Git et les capacités de GenAI.

Passons en revue le script, étape par étape :

#### Étape 1 : Initialisation du script

```javascript
script({
  system: ["system"],
  temperature: 0.5,
  model: "openai:gpt-4-turbo",
});
```

Le script commence par une initialisation via une fonction `script`. Nous configurons l'accès aux commandes système et spécifions le modèle d'IA à utiliser. La température contrôle la créativité de l'IA, 0.5 représentant un choix équilibré.

#### Étape 2 : Définir le nom du produit

```javascript
const product = env.vars.product || "GenAIScript";
```

Ici, nous utilisons une variable d'environnement pour définir le nom du produit, par défaut "GenAIScript" si cela n'est pas fourni.

#### Étape 3 : Trouver l'étiquette précédente

```javascript
const pkg = await workspace.readJSON("package.json");
const { version } = pkg;
const { stdout: tag } = await host.exec(
  "git describe --tags --abbrev=0 HEAD^",
);
```

Nous lisons la version actuelle depuis `package.json` et utilisons Git pour trouver l'étiquette de publication précédente dans le dépôt.

#### Étape 4 : Rassembler les commits

```javascript
const { stdout: commits } = await host.exec(
  `git log --grep='skip ci' --invert-grep --no-merges HEAD...${tag}`,
);
```

Ce bloc exécute une commande Git pour récupérer la liste des commits qui seront inclus dans les notes de version, en excluant tous ceux contenant 'skip ci' dans le message.

#### Étape 5 : Obtenir le différentiel

```javascript
const { stdout: diff } = await host.exec(
  `git diff ${tag}..HEAD --no-merges -- ':!**/package.json' ':!**/genaiscript.d.ts' ':!**/jsconfig.json' ':!docs/**' ':!.github/*' ':!.vscode/*' ':!*yarn.lock' ':!*THIRD_PARTY_NOTICES.md'`,
);
```

Ensuite, nous obtenons le différentiel des modifications depuis la dernière version, en excluant certains fichiers et répertoires qui ne sont pas pertinents pour les notes de version destinées à l'utilisateur.

#### Étape 6 : Définir des espaces réservés

```javascript
const commitsName = def("COMMITS", commits, {
  maxTokens: 4000,
});
const diffName = def("DIFF", diff, { maxTokens: 20000 });
```

Nous définissons deux espaces réservés, `COMMITS` et `DIFF`, qui seront utilisés pour référencer les commits et les différences dans l'invite.

#### Étape 7 : Rédiger l'invite

```javascript
$`
You are an expert software developer and release manager.

## Task

Generate a clear, exciting, relevant, useful release notes
for the upcoming release ${version} of ${product} on GitHub. 

- The commits in the release are in ${commitsName}.
- The diff of the changes are in ${diffName}.

## Guidelines

- only include the most important changes. All changes must be in the commits.
- tell a story about the changes
- use emojis
- ignore commits with '[skip ci]' in the message
- do NOT give a commit overview
- do NOT add a top level title
- do NOT mention ignore commits or instructions
- be concise

`;
```

Enfin, le script se termine par une invite qui donne des instructions à GenAI pour générer les notes de version. Elle détaille la tâche, les directives à suivre et le style à respecter.

### Comment exécuter le script avec l'interface CLI de Genaiscript

Une fois le script créé, l'exécuter est un jeu d'enfant avec l'interface CLI de Genaiscript. Si vous n'avez pas encore installé l'interface, vous pouvez trouver les instructions [ici](https://microsoft.github.io/genaiscript/getting-started/installation).

Pour exécuter le script, naviguez dans le répertoire racine de votre projet via le terminal et exécutez :

```bash
genaiscript run git-release-notes
```

N'oubliez pas d'utiliser le nom du fichier script sans l'extension `.genai.mjs` lors de son invocation avec l'interface CLI.

Et voilà ! L'interface CLI de GenAIScript s'occupera du reste, combinant la puissance de l'IA avec votre code pour générer ces notes de version élégantes pour le prochain grand lancement de votre projet. 🌟