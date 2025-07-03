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
   * MDX support. Default is false.
   */
  mdx?: boolean;
}

export async function mdast() {
  checkRuntime();

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

  function mdastParse(file: string | WorkspaceFile, options?: MdAstOptions): Root {
    const content = filenameOrFileToContent(file);
    if (!content) return { type: "root", children: [] };

    dbg(`parse`);

    const mdx = typeof file === "object" && /\.mdx?$/i.test(file.filename);
    const processor = unified().use(parse);
    usePlugins(processor, { mdx, ...(options || {}) });
    const ast = processor.parse(content);
    return ast;
  }

  function mdastStringify(root: Root, options?: MdAstOptions): string {
    if (!root) return "";

    dbg(`stringify`);
    const processor = unified();
    usePlugins(processor, options || {});
    const ast = processor.use(stringify).stringify(root);
    return ast;
  }

  function usePlugins(processor: Processor<Root>, options: MdAstOptions): Processor<Root> {
    const p: Processor<Root> = processor.use(frontmatter);
    if (options.gfm !== false) p.use(gfm).use(github).use(directive).use(math);
    if (options.mdx) p.use(mdx);
    p.use(comments, {
      emit: true, // Emit comments as HTML
    });
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
