import { Code } from "@astrojs/starlight/components"
import mathAgentSrc from "../../../../../../packages/sample/genaisrc/math-agent.genai.mjs?raw";
import mathAgentSystemSrc from "../../../../../../packages/sample/genaisrc/math-agent-system.genai.js?raw";

En utilisant les [outils (anciennement fonctions)](../../reference/scripts/tools/),
vous pouvez définir un agent intégré capable de prendre des décisions
et d'effectuer un raisonnement basé sur les outils qui lui sont fournis.

Illustrons ce concept en utilisant l'[exemple de somme et division de llamaindex](https://ts.llamaindex.ai/examples/agent) :
un agent capable d'additionner ou de diviser deux nombres et qui doit répondre à des questions arithmétiques basiques.

## Utilisation des outils

En déclarant des outils (et en fournissant une description explicative), vous donnez la possibilité
au LLM de demander un appel d'outil lors de la génération de la sortie. Dans l'extrait ci-dessous,
nous déclarons un outil capable d'additionner deux nombres. Il sera appelé par le LLM lorsqu'une opération d'addition
sera nécessaire.

```js "defTool"
defTool(
    "sum",
    "Sum two numbers",
    {
        type: "object",
        properties: {
            a: {
                type: "number",
                description: "The first number",
            },
            b: {
                type: "number",
                description: "The second number",
            },
        },
        required: ["a", "b"],
    },
    ({ a, b }) => `${a + b}`
)
```

Vous pouvez également simplifier la définition des paramètres en fournissant un objet exemple et le schéma sera déduit.

```js "{ a: 1, b: 2 }"
defTool("sum", "Sum two numbers", { a: 1, b: 2 }, ({ a, b }) => `${a + b}`)
```

## Paramètres

La question arithmétique peut être déclarée comme un [paramètre de script](../../reference/scripts/variables/) à utiliser dans le script de l'agent.

```js "parameters"
script({
    ...,
    parameters: {
        "question": {
            type: "string",
            default: "How much is 5 + 5? then divide by 2?"
        }
    }
})
```

La valeur du paramètre est renseignée dans l'objet `env.vars`.

```js "env.vars.question"
...
$`Answer the following arithmetic question:

    ${env.vars.question}
`
```

Pour faire simple, nous définissons un autre outil pour diviser deux nombres
et intégrons en ligne une question arithmétique.

```js wrap
script({
    title: "math-agent",
    model: "small",
    description: "A port of https://ts.llamaindex.ai/examples/agent",
    parameters: {
        question: {
            type: "string",
            default: "How much is 11 + 4? then divide by 3?",
        },
    },
    tests: {
        description: "Testing the default prompt",
        keywords: "5",
    },
})

defTool(
    "sum",
    "Use this function to sum two numbers",
    {
        type: "object",
        properties: {
            a: {
                type: "number",
                description: "The first number",
            },
            b: {
                type: "number",
                description: "The second number",
            },
        },
        required: ["a", "b"],
    },
    ({ a, b }) => `${a + b}`
)

defTool(
    "divide",
    "Use this function to divide two numbers",
    {
        type: "object",
        properties: {
            a: {
                type: "number",
                description: "The first number",
            },
            b: {
                type: "number",
                description: "The second number",
            },
        },
        required: ["a", "b"],
    },
    ({ a, b }) => `${a / b}`
)

$`Answer the following arithmetic question: 

    ${env.vars.question}
`
```

{/* genaiscript output start */}

<details>
  <summary>👤 utilisateur</summary>

  ```markdown wrap
  Answer the following arithmetic question:

  How much is 11 + 4? then divide by 3?
  ```
</details>

<details open>
  <summary>🤖 assistant </summary>

  * 📠 appel d'outil `divide({"a":15,"b":3})` (`call_9p0oWdWpT6vGyxzwq2vJXHrq`)
</details>

<details>
  <summary>🛠️ outil <code>call\_9p0oWdWpT6vGyxzwq2vJXHrq</code></summary>

  ```json wrap
  5
  ```
</details>

<details open>
  <summary>🤖 assistant </summary>

  ```markdown wrap
  The result of (11 + 4) divided by 3 is 5.
  ```
</details>

{/* genaiscript output end */}

## Utilisation de `system.math`

L'invite système [system.math](../../reference/scripts/system#systemmath/)
englobe le parseur et évaluateur d'expressions `parsers.math` et l'expose comme un outil.

Cela simplifie le script de l'agent car il n'est plus nécessaire de définir des outils.

<Code title="math-agent.genai.mjs" code={mathAgentSystemSrc} wrap={true} lang="js" />