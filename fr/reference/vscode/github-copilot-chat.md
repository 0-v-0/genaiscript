import { Image } from "astro:assets";
import { YouTube } from "astro-embed";
import { Code } from "@astrojs/starlight/components";
import scriptSource from "../../../../../../../packages/sample/genaisrc/samples/copilotchat.genai.mjs?raw";
import src from "../../../../../assets/chat-participant.png";
import alt from "../../../../../assets/chat-participant.png.txt?raw";
import { Steps } from "@astrojs/starlight/components";

GenAIScript s'intègre avec [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)
en fournissant un **participant de chat** qui vous permet d'exécuter des scripts dans le contexte d'une conversation de chat,
et une **invite personnalisée** pour générer GenAIScript plus efficacement avec Copilot Chat.

:::tip
Si vous devez vérifier votre quota de requêtes premium disponible pour GitHub Copilot, rendez-vous sur [Fonctionnalités](https://github.com/settings/copilot/features)
:::

## Participant de chat `@genaiscript`

Le [participant de chat](https://code.visualstudio.com/api/extension-guides/chat#parts-of-the-chat-user-experience) `@genaiscript` vous permet d'exécuter des scripts sans le contexte
d'une conversation [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat).
Cela est utile pour exploiter des scripts existants dans une session de chat interactive.

<Image src={src} alt={alt} loading="lazy" />

### Choix du script à exécuter

La commande `/run` attend un identifiant de script comme premier argument (par exemple, `/run poem`). Le reste de la requête est
transmis au script sous la variable `env.vars.question`.

```sh
@genaiscript /run summarize
```

Si vous omettez la commande `/run`, GenAIScript recherchera un script nommé `copilotchat`. S'il en trouve un, il l'exécutera.
Sinon, il vous demandera de choisir un script dans la liste des scripts disponibles.

```sh
@genaiscript add comments to the current editor
```

### Choix du modèle

Si votre script ne spécifie pas de modèle, GenAIScript vous invitera à en choisir un.
Vous pouvez également spécifier quel modèle choisir dans la configuration du script en utilisant le fournisseur `github_copilot_chat`.

* modèle actuellement sélectionné : `github_copilot_chat:current`

```js "github_copilot_chat:current"
script({
  model: "github_copilot_chat:current",
});
```

* gpt-4o-mini : `github_copilot_chat:gpt-4o-mini`

```js "github_copilot_chat:gpt-4o-mini"
script({
  model: "github_copilot_chat:gpt-4o-mini",
});
```

Lorsque GenAIScript vous invite à choisir un modèle, il stocke vos choix dans les paramètres de l'espace de travail
sous

```json file=".vscode/settings.json"
{
  "genaiscript.languageChatModels": {
    "gpt-4o": "gpt-4o-2024-11-20"
  }
}
```

:::note
**Les modèles GitHub Copilot Chat sont uniquement disponibles dans Visual Studio Code.** Ils ne fonctionneront pas depuis
les interfaces [cli](../../../reference/reference/cli/) ou [playground](../../../reference/reference/playground/).
:::

#### Disponibilité des modèles

Tous les modèles listés dans l'interface utilisateur de GitHub Copilot Chat ne sont pas disponibles pour les extensions tierces.
Lorsque GenAIScript tente d'accéder à un modèle non disponible, il vous en informe mais n'a pas
de contrôle sur votre configuration d'accès aux modèles.

### Contexte

Le contexte sélectionné par l'utilisateur dans Copilot Chat est converti en variables et transmis au script :

* le contenu de l'invite est passé dans `env.vars.question`. L'identifiant du script est supprimé dans le cas de `/run`.
* le texte courant de l'éditeur est passé dans `env.vars["copilot.editor"]`
* la sélection courante de l'éditeur est passée dans `env.vars["copilot.selection"]`
* toutes les autres références de fichiers sont transmises dans `env.files`

#### Exemples

* `mermaid` générera un diagramme à partir de l'invite de l'utilisateur.

```js title="mermaid.genai.mjs" wrap
def("CODE", env.files);
$`Generate a class diagram using mermaid of the code symbols in the CODE.`;
```

* `websearcher` effectuera une recherche web pour l'invite de l'utilisateur
  et utilisera le fichier en contexte dans la réponse.

```js title="websearcher.genai.mjs" wrap
const res = await retrieval.webSearch(env.vars.question);
def("QUESTION", env.vars.question);
def("WEB_SEARCH", res);
def("FILE", env.files, { ignoreEmpty: true });
$`Answer QUESTION using WEB_SEARCH and FILE.`;
```

* `dataanalyst` utilise les outils d'interprète de code Python pour
  résoudre une question de calcul de données.

```js title="dataanalyst.genai.mjs" wrap
script({
  tools: [
    "fs_read_file",
    "python_code_interpreter_copy_files_to_container",
    "python_code_interpreter_read_file",
    "python_code_interpreter_run",
  ],
});
def("DATA", env.files.map(({ filename }) => filename).join("\n"));
def("QUESTION", env.vars.question);

$`Run python code to answer the data analyst question 
in QUESTION using the data in DATA.
Return the python code that was used to compute the answer.
`;
```

#### Historique

L'historique des messages est transmis dans `env.vars["copilot.history"]`. Il s'agit d'un tableau de `HistoryMessageUser | HistoryMessageAssistant` :

```json
[
  {
    "role": "user",
    "content": "write a poem"
  },
  {
    "role": "assistant",
    "content": "I am an assistant"
  }
]
```

### Conversation continue

Vous pouvez utiliser le chat `@genaiscript` pour intégrer l'exécution d'un script dans une conversation existante
ou pour continuer la conversation avec Copilot avec les résultats du script. Les résultats
du script sont réintégrés dans l'historique du chat et sont accessibles à tout copilot par la suite.

* `@genaiscript /run tool` exécutera le script `tool` et réintégrera les résultats dans l'historique du chat.
* `analyze the results` continuera la conversation avec les résultats du script.

### Script par défautLe script suivant peut être utilisé comme modèle de départ pour créer le script par défaut lorsque l'utilisateur ne saisit pas la commande `/run`.

Le script suivant peut être utilisé comme modèle de départ pour créer le script par défaut lorsque l'utilisateur n'utilise pas la commande `/run`.

<Code code={scriptSource} wrap={true} lang="ts" title="genaisrc/copilotchat.genai.mts" />

### Fonctionnalités non prises en charge

Les fonctionnalités suivantes ne sont actuellement pas prises en charge dans le participant de chat :

* Outils (`#tool`)
* Référence `Workspace`

## instructions personnalisées `genaiscript`GenAIScript enregistrera automatiquement un fichier instructions.md dans le dossier `.genaiscript/instructions` lorsque vous exécutez un script. Ce fichier contient les instructions utilisées pour générer le script.

GenAIScript sauvegardera automatiquement un fichier instructions.md dans le dossier `.genaiscript/instructions`
lorsque vous exécutez un script. Ce fichier contient les instructions utilisées pour générer le script.

### Sessions de chat augmentées

Voici comment démarrer une session de chat en utilisant l'invite `genaiscript`.

<Steps>
  <ol>
    <li>
      Sélectionnez l'icône **Attacher le contexte** 📎 (`Ctrl+/`), puis sélectionnez **Instructions...**,
      puis choisissez l'invite **genaiscript.instructions.md**.
    </li>

    <li>
      Incluez des instructions pour écrire un script ou répondre à une question concernant GenAIScript,
      `write a script that summarizes a video`.
    </li>
  </ol>
</Steps>

Comme l'invite injecte la documentation complète de GenAIScript (plus de 700 ko au moment de la rédaction),
il est recommandé d'utiliser un modèle avec un grand contexte comme Sonnet ou Gemini.

N'oubliez pas non plus que la conversation entière est renvoyée à chaque itération, cette technique
fonctionne donc mieux pour une requête détaillée en une seule fois.