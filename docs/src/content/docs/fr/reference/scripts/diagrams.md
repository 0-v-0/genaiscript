---
title: Diagrammes
sidebar:
  order: 20
description: Créez des diagrammes et des graphiques dans du Markdown à l'aide de
  GenAIScript et de l'extension mermaid pour la représentation visuelle des
  données et des processus.
keywords: diagrams, charts, mermaid, GenAIScript, data visualization
hero:
  image:
    alt: A flat, minimalistic 8-bit illustration showing two parallel colored lines,
      each symbolizing a separate branch, that join together into one line,
      representing a merge in version control. The design is geometric, strictly
      simple, sized 128x128 pixels, with no background, text, people, shading,
      or 3D effects, and uses only five distinct corporate colors.
    file: ../../../reference/scripts/diagrams.png

---

Il est souvent utile de demander à un LLM de générer un diagramme. Heureusement, de nombreux LLMs connaissent déjà [mermaid](https://mermaid.js.org/), une extension populaire de Markdown pour créer des diagrammes et des graphiques.

```mermaid
graph LR
    A[Master] --> B((Merge Point))
    C[Feature Branch] --> B
```

## Réparation automatique de la syntaxe Mermaid

L’invite système `system.diagrams` enregistre un participant au chat de réparation qui tentera de corriger toute erreur de syntaxe dans les diagrammes Mermaid générés. Il n’est pas rare que les LLMs produisent une syntaxe Mermaid invalide, donc cette fonctionnalité est utile.

## Parseur

Vous pouvez invoquer directement le parseur mermaid depuis GenAIScript à l'aide de la fonction `parsers.mermaid`.

Vous pouvez utiliser la valeur `result.error` pour vérifier si l'analyse a réussi. Si ce n'est pas le cas, vous pouvez utiliser la valeur `result.error` pour réparer le diagramme avec un LLM.

## Prise en charge de l’aperçu Markdown

* Installez l’extension [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) pour VS Code.

* Mentionnez `diagram` dans le programme ou ajoutez `system.diagram` à la liste des invites système.

```js
$`Generate a diagram of a merge.`
```

<details>
  <summary>👤 utilisateur</summary>

  ```markdown wrap
  Generate a diagram of a merge.
  ```
</details>

<details open>
  <summary>🤖 assistant </summary>

  ````markdown wrap
  ```mermaid
  graph LR
      A[Master] --> B((Merge Point))
      C[Feature Branch] --> B
  ```
  ````
</details>

Le Markdown généré apparaîtra comme suit :

````markdown
```mermaid
graph LR
  A[Master] --> C[New Commit]
  B[Feature Branch] --> C
```
````

et il est rendu automatiquement une fois l’extension installée.

```mermaid
graph LR
  A[Master] --> C[New Commit]
  B[Feature Branch] --> C
```
