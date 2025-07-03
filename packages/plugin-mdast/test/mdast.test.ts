// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { describe, test, expect, beforeEach } from "vitest";
import { mdast } from "../src/unified.js";
import { initialize } from "@genaiscript/runtime";

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

describe("mdast", () => {
  beforeEach(async () => {
    await initialize({ test: true });
  });
  test("should load and expose parse, stringify, and visit utilities", async () => {
    const api = await mdast();
    expect(typeof api.parse).toBe("function");
    expect(typeof api.stringify).toBe("function");
    expect(typeof api.visit).toBe("function");
    expect(typeof api.visitParents).toBe("function");
    expect(api.CONTINUE).toBeDefined();
    expect(api.EXIT).toBeDefined();
    expect(api.SKIP).toBeDefined();
  });

  test("parse returns empty root for empty string", async () => {
    const api = await mdast();
    const ast = api.parse("");
    expect(ast).toEqual({ type: "root", children: [] });
  });

  test("parse returns empty root for empty WorkspaceFile", async () => {
    const api = await mdast();
    const ast = api.parse({ filename: "foo.md", content: "" });
    expect(ast).toEqual({ type: "root", children: [] });
  });

  test("parse returns AST for markdown string", async () => {
    const api = await mdast();
    const ast = api.parse("# Hello\n\nThis is a test.");
    expect(ast.type).toBe("root");
    expect(Array.isArray(ast.children)).toBe(true);
    expect(ast.children.some((n: any) => n.type === "heading")).toBe(true);
  });

  test("stringify returns empty string for empty root", async () => {
    const api = await mdast();
    const result = api.stringify({ type: "root", children: [] });
    expect(result).toBe("");
  });

  test("stringify returns markdown for AST", async () => {
    const api = await mdast();
    const ast = api.parse("# Title\n\nSome text.");
    const md = api.stringify(ast);
    expect(md).toContain("# Title");
    expect(md).toContain("Some text.");
  });

  test("parse and stringify roundtrip", async () => {
    const api = await mdast();
    const input = "# Heading\n\n- item 1\n- item 2";
    const ast = api.parse(input);
    const output = api.stringify(ast);
    expect(output).toContain("Heading");
    expect(output).toContain("item 1");
    expect(output).toContain("item 2");
  });

  test("visit traverses AST nodes", async () => {
    const api = await mdast();
    const ast = api.parse("# Heading\n\nText");
    const nodes: string[] = [];
    api.visit(ast, (node: any) => {
      if (node.type) nodes.push(node.type);
    });
    expect(nodes).toContain("root");
    expect(nodes).toContain("heading");
    expect(nodes).toContain("text");
  });

  describe("markdown syntax features", () => {
    test("parse and stringify headers (h1-h6)", async () => {
      const api = await mdast();
      const input = "# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("# H1");
      expect(output).toContain("## H2");
      expect(output).toContain("### H3");
      expect(output).toContain("#### H4");
      expect(output).toContain("##### H5");
      expect(output).toContain("###### H6");
    });

    test("parse and stringify emphasis (bold, italic, strikethrough)", async () => {
      const api = await mdast();
      const input = "**bold text** and *italic text* and ~~strikethrough~~";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("**bold text**");
      expect(output).toContain("*italic text*");
      expect(output).toContain("~~strikethrough~~");
    });

    test("parse and stringify unordered lists", async () => {
      const api = await mdast();
      const input = "- Item 1\n- Item 2\n  - Nested item\n- Item 3";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("* Item 1");
      expect(output).toContain("* Item 2");
      expect(output).toContain("* Nested item");
      expect(output).toContain("* Item 3");
    });

    test("parse and stringify ordered lists", async () => {
      const api = await mdast();
      const input = "1. First item\n2. Second item\n   1. Nested item\n3. Third item";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("1. First item");
      expect(output).toContain("2. Second item");
      expect(output).toContain("1. Nested item");
      expect(output).toContain("3. Third item");
    });

    test("parse and stringify links", async () => {
      const api = await mdast();
      const input = "[Link text](https://example.com) and [Reference link][ref]\n\n[ref]: https://reference.com";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("[Link text](https://example.com)");
      expect(output).toContain("[Reference link][ref]");
      expect(output).toContain("[ref]: https://reference.com");
    });

    test("parse and stringify images", async () => {
      const api = await mdast();
      const input = "![Alt text](image.jpg) and ![Reference image][img]\n\n[img]: reference.jpg";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("![Alt text](image.jpg)");
      expect(output).toContain("![Reference image][img]");
      expect(output).toContain("[img]: reference.jpg");
    });

    test("parse and stringify inline code", async () => {
      const api = await mdast();
      const input = "Here is some `inline code` in a sentence.";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("`inline code`");
    });

    test("parse and stringify code blocks", async () => {
      const api = await mdast();
      const input = "```javascript\nconst x = 1;\nconsole.log(x);\n```";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("```javascript");
      expect(output).toContain("const x = 1;");
      expect(output).toContain("console.log(x);");
      expect(output).toContain("```");
    });

    test("parse and stringify blockquotes", async () => {
      const api = await mdast();
      const input = "> This is a blockquote\n> with multiple lines\n>\n> And another paragraph";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("> This is a blockquote");
      expect(output).toContain("> with multiple lines");
      expect(output).toContain("> And another paragraph");
    });

    test("parse and stringify horizontal rules", async () => {
      const api = await mdast();
      const input = "Before\n\n---\n\nAfter";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("Before");
      expect(output).toContain("***");
      expect(output).toContain("After");
    });

    test("parse and stringify tables", async () => {
      const api = await mdast();
      const input = "| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("Header 1");
      expect(output).toContain("Header 2");
      expect(output).toContain("Cell 1");
      expect(output).toContain("Cell 2");
      expect(output).toContain("Cell 3");
      expect(output).toContain("Cell 4");
    });

    test("parse and stringify line breaks", async () => {
      const api = await mdast();
      const input = "Line 1  \nLine 2\n\nParagraph 2";
      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("Line 1");
      expect(output).toContain("Line 2");
      expect(output).toContain("Paragraph 2");
    });

    test("parse and stringify mixed content", async () => {
      const api = await mdast();
      const input = `# Main Title

This is a paragraph with **bold** and *italic* text.

## Section

- List item with [link](https://example.com)
- Another item with \`inline code\`

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

> A blockquote with **emphasis**.

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |`;

      const ast = api.parse(input);
      const output = api.stringify(ast);
      
      expect(output).toContain("# Main Title");
      expect(output).toContain("**bold**");
      expect(output).toContain("*italic*");
      expect(output).toContain("## Section");
      expect(output).toContain("[link](https://example.com)");
      expect(output).toContain("`inline code`");
      expect(output).toContain("```python");
      expect(output).toContain("def hello():");
      expect(output).toContain("> A blockquote");
      expect(output).toContain("Column 1");
      expect(output).toContain("Data 1");
    });

    test("parse handles malformed markdown gracefully", async () => {
      const api = await mdast();
      const input = "# Heading\n\n[Incomplete link\n\n```\nUnclosed code block";
      const ast = api.parse(input);
      
      expect(ast.type).toBe("root");
      expect(Array.isArray(ast.children)).toBe(true);
      
      const output = api.stringify(ast);
      expect(output).toContain("Heading");
    });

    test("visit traverses complex AST structure", async () => {
      const api = await mdast();
      const input = "# Title\n\n**Bold** text with [link](url)\n\n- List item";
      const ast = api.parse(input);
      const nodeTypes: string[] = [];
      
      api.visit(ast, (node: any) => {
        if (node.type) nodeTypes.push(node.type);
      });
      
      expect(nodeTypes).toContain("root");
      expect(nodeTypes).toContain("heading");
      expect(nodeTypes).toContain("paragraph");
      expect(nodeTypes).toContain("strong");
      expect(nodeTypes).toContain("link");
      expect(nodeTypes).toContain("list");
      expect(nodeTypes).toContain("listItem");
      expect(nodeTypes).toContain("text");
    });

    test("visitParents provides parent information", async () => {
      const api = await mdast();
      const input = "# Title\n\n**Bold text**";
      const ast = api.parse(input);
      const visits: Array<{type: string, parentTypes: string[]}> = [];
      
      api.visitParents(ast, (node: any, parents: any[]) => {
        visits.push({
          type: node.type,
          parentTypes: parents.map(p => p.type)
        });
      });
      
      const strongVisit = visits.find(v => v.type === "strong");
      expect(strongVisit).toBeDefined();
      expect(strongVisit?.parentTypes).toContain("paragraph");
      expect(strongVisit?.parentTypes).toContain("root");
    });
  });
});
