---
title: Continuous Markdown Translations
description: A walkthrough the script that translates the GenAIScript documentation into multiple languages.
date: 2025-07-02
authors: pelikhan
draft: true
tags:
  - Continuous AI
  - CI/CD
  - Translations
canonical_url: https://microsoft.github.io/genaiscript/blog/continuous-translations/
---

You may have noticed that the GenAIScript documentation is now available in **French** (try the upper-right language dropdown).

The translations are not just a one-time effort; they are **continuously** updated as the documentation evolves, in a GitHub Actions. This means that whenever new content is added or existing content is modified,
the translations are automatically updated to reflect those changes.

In this post, we'll go through some of the interesting parts of the script and how it works.

## The challenge of translating documentation

The goal of this challenge to maintain localized documentation, and automate the process using GenAIScript, GitHub Actions and GitHub Models.
To be successful, we need:

- a model that can produce high quality translations (LLMs like `gpt-4o` and larger have become quite good at it),
- a iterative strategy to partially translate modified chunks in markdown file. We cannot just translate an entire file other the translations will be changing on every round.
- idempotency: if translations are already available, the results should be cached and the script should be a no-op.
- run automatically in a GitHub Action and use GitHub Models for inference.

Let's get going! If you want to read the code, [here is the script](https://github.com/microsoft/genaiscript/blob/dev/packages/sample/genaisrc/mdtranslator.genai.mts).

## Iterative Markdown Translations

Since GenAISCript uses markdown for documentation, we'll focus on this file format exclusively. GenAIScript also uses [Astro Starlight](https://starlight.astro.build/) which adds some well-known metadata in the frontmatter like `title` or `description`.

The core idea behind the translation scripts is the following:

- parse the markdown document into an AST (Abstract Syntax Tree)
- visit the tree and collect all the translatable text chunks (special care for paragraphs)
- replace all translatable chunks with a placeholder a `[T001]bla bla bla...[T002]` and prompt the LLM to translate each chunk
- parse the LLM answer, extract each chunk translation, and visit the tree again applying the translations
- save the translations in a cache that they can be reused in a future run

### Markdown AST tools

The web community has been building a large number of tools to parse and manipulate markdown documents.
GenAIScript provides an opinionated plugin, [@genaiscript/plugin-mdast](https://www.npmjs.com/package/@genaiscript/plugin-mdast) that provides the core functionalities without worrying too much about configuration.

- load the plugin

```ts
import { mdast } from "@genaiscript/plugin-mdast";

const { visit, parse, stringify, SKIP } = await mdast();
```

- parse the markdown file

```ts
const root = parse(file);
```

- visit the tree and collect chunks

```ts
const nodes: Record<string, NodeType> = {};
visit(root, ["text", "paragraph"], (node) => {
  const hash = hashNode(node);
  dbg(`node: %s -> %s`, node.type, hash);
  nodes[hash] = node as NodeType;
});
```

- convert the tree back to markdown

```ts
const markdown = stringify(root);
```

With these primitive operations, we are able create a script that can parse, extract translation work, translate, apply translate and stringify back.

### One-shot translations

The approach to the translation is to enclose each translatable chunk in a unique identifier marker like `┌T000┐Continuous Markdown Translations└T000┘`,
then prompt the LLM to translate each chunk and return them in a parsable format.

The prompt looks like this for this article:


`````markdown
<ORIGINAL>
---
title: Continuous Markdown Translations
description: A walkthrough the script that translates the GenAIScript documentation into multiple languages.
date: 2025-07-02
...
---

You may have noticed that the GenAIScript documentation is now available in **French** (try the upper-right language dropdown).

The translations are not just a one-time effort; they are **continuously** updated as the documentation evolves, in a GitHub Actions. This means that whenever new content is added or existing content is modified,
the translations are automatically updated to reflect those changes.

In this post, we'll go through some of the interesting parts of the script and how it works.
...
</ORIGINAL>

<TRANSLATED>
---
title: ┌T000┐Continuous Markdown Translations└T000┘
description: ┌D001┐A walkthrough the script that translates the GenAIScript
  documentation into multiple languages.└D001┘
...
---

┌P002┐You may have noticed that the GenAIScript documentation is now available in **French** (try the upper-right language dropdown).└P002┘

┌P003┐The translations are not just a one-time effort; they are **continuously** updated as the documentation evolves, in a GitHub Actions. This means that whenever new content is added or existing content is modified,
the translations are automatically updated to reflect those changes.└P003┘

┌P004┐In this post, we'll go through some of the interesting parts of the script and how it works.└P004┘
</TRANSLATED>
`````

The LLM is prompted to translate the text between `<ORIGINAL>` and `<TRANSLATED>`, and to return the translated text with the same markers, but with unique identifiers for each translatable chunk.

`````markdown
```T000
Traductions Markdown Continues
```

```D001
Un aperçu du script qui traduit la documentation GenAIScript dans plusieurs langues.
```

```P002
Vous avez peut-être remarqué que la documentation de GenAIScript est désormais disponible en **français** (essayez le menu déroulant de langue en haut à droite).
```

```P003
Les traductions ne sont pas un effort ponctuel ; elles sont mises à jour **en continu** à mesure que la documentation évolue, grâce à GitHub Actions. Cela signifie que chaque fois que du nouveau contenu est ajouté ou que du contenu existant est modifié,
les traductions sont automatiquement mises à jour pour refléter ces changements.
```

```P004
Dans cet article, nous allons passer en revue certains aspects intéressants du script et son fonctionnement.
```

```P005
Le défi de la traduction de la documentation
```
`````

The chunks are parsed and injected back into the AST before rendering to a string. 
We can also store those chunks in a JSON file for caching purposes, so that the next time the script runs, it can reuse the translations without having to re-translate them.

## Judging the translation quality

To ensure the quality of the translations, we implement a few strategies:

- mechanically validate that the resulting markdown is still valid. Something special characters can throw off the parser.
- validate that all external URLs are not modified. The LLM did not modify, add or remove any URLs.
- run a **LLM-as-Judge** prompt that evaluates the translation quality. This is done by prompting the LLM to compare the original and translated text, and provide a quality score.

## Commit and push the changes

Once the translations have passed all the checks, the script commits the changes to the repository and pushes them to the remote branch... and voilà! The translations are now available in the documentation.

## What's next?

In the next week, we will refactor this script into a custom action so that it can be reused by other projects.