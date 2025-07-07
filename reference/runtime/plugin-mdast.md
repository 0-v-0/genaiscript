import { PackageManagers } from "starlight-package-managers";

These runtime helpers provide a friendly wrapper around the [remark](https://github.com/remarkjs/remark), [mdast](https://github.com/syntax-tree/mdast), [unified](https://github.com/syntax-tree/unist)
ecosystem to parse and manipulate Markdown documents.

## Installation

<PackageManagers pkg="@genaiscript/plugin-mdast" dev />

If you are using the plugin in a Node.JS environment, without a `.genai...` entry file, you will need
to initialize the [runtime](/genaiscript/reference/runtime) before using the plugin:

```ts
import { initialize } from "@genaiscript/runtime";

await initialize();
```

## Markdown manipulation

- load the parsers

```typescript
import { mdast } from "@genaiscript/plugin-mdast";

const { parse, visit, stringify } = await mdast();
```

- parsing to mdast tree

```typescript
const root = parse("# Hello World");
```

- visiting the tree (see [documentation](https://unifiedjs.com/learn/recipe/tree-traversal/pnp))

```typescript
const updated = visit(root, `code`, (node) => {
  ...node
});
```

- serializing the tree back to Markdown

```typescript
const markdown = await stringify(updated);
```

In order to get type completion, you will need to install the `@types/mdast` package as a development dependency.

## MDX

If you plan to process MDX documents, you should configure the plugin to use the `mdx` parser:

```typescript
const { parse } = await mdast({ mdx: true });
```