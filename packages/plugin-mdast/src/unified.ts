// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { Root } from "mdast";
import type { WorkspaceFile } from "@genaiscript/core";
import { checkRuntime, filenameOrFileToContent, genaiscriptDebug } from "@genaiscript/core";
import type { Processor } from "unified";
const dbg = genaiscriptDebug("mdast");

export interface MdAstOptions {
  /**
   * GitHub Flavored Markdown (GFM) support. Default is true.
   */
  gfm?: boolean;

  /**
   * GitHub short links. Default is true.
   */
  github?: boolean;

  /**
   * Generic directive support. Default is true.
   */
  directive?: boolean;

  /**
   * KaTex or MathJax syntax. Default is true.
   */
  math?: boolean;

  /**
   * MDX support. Default is false.
   */
  mdx?: boolean;
}

export async function mdast(options?: MdAstOptions) {
  checkRuntime();

  const _options: MdAstOptions = structuredClone(options || {});
  dbg(`loading plugins`);
  const { unified } = await import("unified");
  const { default: parse } = await import("remark-parse");
  const { default: directive } = await import("remark-directive");
  const { default: gfm } = await import("remark-gfm");
  const { default: github } = await import("remark-github");
  const { default: frontmatter } = await import("remark-frontmatter");
  const { default: math } = await import("remark-math");
  const { default: mdx } = await import("remark-mdx");
  const { default: stringify } = await import("remark-stringify");
  const { default: comments } = await import("@slorber/remark-comment");
  const { visit, CONTINUE, EXIT, SKIP } = await import("unist-util-visit");
  const { visitParents } = await import("unist-util-visit-parents");
  await import("mdast-util-mdxjs-esm");

  function mdastParse(file: string | WorkspaceFile): Root {
    const content = filenameOrFileToContent(file);
    if (!content) return { type: "root", children: [] };

    dbg(`parse`);

    const processor = unified().use(parse);
    usePlugins(processor);
    const ast = processor.parse(content);
    return ast;
  }

  function mdastStringify(root: Root): string {
    if (!root) return "";

    dbg(`stringify`);
    const processor = unified();
    usePlugins(processor);
    const ast = processor.use(stringify).stringify(root);
    return ast;
  }

  function usePlugins(processor: Processor<Root>): Processor<Root> {
    const p: Processor<Root> = processor.use(frontmatter);
    if (_options.gfm !== false) p.use(gfm);
    if (_options.github !== false) p.use(github);
    if (_options.directive !== false) p.use(directive);
    if (_options.math !== false) p.use(math);
    // no comments in MDX files
    p.use(comments, {
      emit: true, // Emit comments as HTML
    });
    if (_options.mdx) p.use(mdx);
    return p;
  }

  return Object.freeze({
    parse: mdastParse,
    stringify: mdastStringify,
    visit,
    visitParents,
    CONTINUE,
    EXIT,
    SKIP,
  });
}
