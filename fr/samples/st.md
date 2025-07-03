import { Code } from "@astrojs/starlight/components"
import source from "../../../../../../packages/sample/genaisrc/samples/st.genai.mts?raw";

La fonction Rechercher et Remplacer est un outil puissant de la boîte à outils du développeur qui peut vous faire gagner du temps et des efforts...
si vous savez formuler la bonne expression régulière.

**Rechercher et Transformer** est une variante du même concept,
mais nous utilisons un LLM pour effectuer la transformation au lieu d'un simple remplacement de chaîne.

### 👩‍💻 Comprendre le code du script

```ts
script({
    title: "Search and transform",
    description:
        "Search for a pattern in files and apply an LLM transformation to the match",
    parameters: {
        glob: {
            type: "string",
            description: "The glob pattern to filter files",
            default: "*",
        },
        pattern: {
            type: "string",
            description: "The text pattern (regular expression) to search for",
        },
        transform: {
            type: "string",
            description: "The LLM transformation to apply to the match",
        },
    },
})
```

Le script commence par définir son but et ses paramètres en utilisant la fonction `script`. Ici, nous définissons le titre, la description et les trois paramètres dont le script aura besoin : `glob` pour spécifier les fichiers, `pattern` pour le texte à rechercher, et `transform` pour la transformation souhaitée.

### Extraction et validation des paramètres

```ts
const { pattern, glob, transform } = env.vars
if (!pattern) cancel("pattern is missing")
const patternRx = new RegExp(pattern, "g")

if (!transform) cancel("transform is missing")
```

Ensuite, nous extrayons les paramètres `pattern`, `glob` et `transform` des variables d’environnement et les validons. Si `pattern` ou `transform` sont manquants, le script annulera l'exécution. Nous compilons ensuite `pattern` en un objet expression régulière pour une utilisation ultérieure.

### Recherche des fichiers et des correspondances

```ts
const { files } = await workspace.grep(patternRx, glob)
```

Ici, nous utilisons la fonction `grep` de l’API `workspace` pour rechercher les fichiers qui correspondent au motif `glob` et contiennent le motif regex.

### Transformation des correspondances

```ts
// cached computed transformations
const patches = {}
for (const file of files) {
    console.log(file.filename)
    const { content } = await workspace.readText(file.filename)
    // skip binary files
    if (!content) continue
    // compute transforms
    for (const match of content.matchAll(patternRx)) {
        console.log(`  ${match[0]}`)
        if (patches[match[0]]) continue
```

Nous initialisons un objet appelé `patches` pour stocker les transformations. Ensuite, nous parcourons chaque fichier, lisons son contenu et ignorons les fichiers binaires. Pour chaque correspondance trouvée dans le contenu du fichier, nous vérifions si une transformation a déjà été calculée pour cette correspondance afin d’éviter un travail redondant.

### Génération des invites pour les transformations

```ts
const res = await runPrompt(
    (_) => {
        _.$`
            ## Task
            
            Your task is to transform the MATCH using the following TRANSFORM.
            Return the transformed text.
            - do NOT add enclosing quotes.
            
            ## Context
            `
        _.def("MATCHED", match[0])
        _.def("TRANSFORM", transform)
    },
    { label: match[0], system: [], cache: "search-and-transform" }
)
```

Pour chaque correspondance unique, nous générons une invite avec la fonction `runPrompt`. Dans l’invite, nous définissons la tâche et le contexte pour la transformation, en précisant que le texte transformé doit être renvoyé sans guillemets. Nous définissons aussi le texte correspondant et la transformation à appliquer.

### Application de la transformation

```ts
        const transformed = res.fences?.[0].content ?? res.text
        if (transformed) patches[match[0]] = transformed
        console.log(`  ${match[0]} -> ${transformed ?? "?"}`)
    }
    // apply transforms
    const newContent = content.replace(
        patternRx,
        (match) => patches[match] ?? match
    )
```

Nous extrayons ensuite le texte transformé du résultat de l’invite et le stockons dans l’objet `patches`. Enfin, nous appliquons les transformations au contenu du fichier en utilisant `String.prototype.replace`.

### Sauvegarde des modifications

```ts
    if (content !== newContent)
        await workspace.writeText(file.filename, newContent)
}
```

Si le contenu du fichier a changé après l’application des transformations, nous enregistrons le contenu mis à jour dans le fichier.

## Exécution du script

Pour exécuter ce script, vous aurez besoin de l’interface en ligne de commande GenAIScript. Consultez le [guide d'installation](https://microsoft.github.io/genaiscript/getting-started/installation) si vous devez le configurer. Une fois la CLI installée, lancez le script en exécutant :

```bash
genaiscript run st
```

## Source complète ([GitHub](https://github.com/microsoft/genaiscript/blob/main/packages/sample/genaisrc/samples/st.genai.mts))

<Code code={source} wrap={true} lang="ts" title="st.genai.mts" />

## Sécurité du contenu

Les mesures suivantes sont prises pour garantir la sécurité du contenu généré.

* Ce script inclut des invites système pour empêcher les injections de prompt et la génération de contenu nuisible.
  * [system.safety\_jailbreak](../../reference/scripts/system#systemsafety_jailbreak/)
  * [system.safety\_harmful\_content](../../reference/scripts/system#systemsafety_harmful_content/)
* La description générée est sauvegardée dans un fichier à un chemin spécifique, ce qui permet une revue manuelle avant de valider les modifications.

Des mesures supplémentaires pour renforcer la sécurité incluent l’exécution [d’un modèle avec un filtre de sécurité](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/content-filter?tabs=warning%2Cuser-prompt%2Cpython-new)
ou la validation du message via un [service de sécurité de contenu](../../reference/scripts/content-safety/).

Consultez la [Note de transparence](../../reference/transparency-note/) pour plus d’informations sur la sécurité du contenu.