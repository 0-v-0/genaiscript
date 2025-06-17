---
title: Writing GenAIScript Workflows Faster with Coding Assistants
date: 2025-06-17
authors: volkanunsal
tags:
  - automation
  - cline
  - coding-assistants
cover:
  alt: "A pixelated 2D illustration of a computer workstation in a corporate
    theme. The centerpiece is a monitor showing TypeScript code snippets, where
    JSDoc comments stand out clearly above corresponding functions in blocky
    text format. Around the monitor are minimalist, geometric icons: a gear
    symbolizing workflow, a tree structure signifying abstract syntax trees, and
    a lightning bolt representing optimization and automation. The backdrop
    features a tidy grid pattern, utilizing a muted palette of five professional
    colors. The scene is clean and devoid of human figures or written labels."
  image: ./cline.png
excerpt: Documenting code can be tedious but remains critical for maintaining
  quality and collaboration. Using GenAIScript, you can automate the generation
  of JSDoc comments in TypeScript projects by leveraging AST grep for precise
  code analysis and LLMs for producing detailed documentation. This approach not
  only saves time but also enhances consistency and ensures clarity across your
  codebase. Practical benefits like parallel task execution, cost-efficient
  prompt utilization, and the shareability of workflows make GenAIScript a
  powerful tool for scaling such tasks in development teams.

---

## Introduction

GenAIScript makes it easy to get started coding LLM workflows. However, it can be challenging to use it effectively to write complex workflows because advanced techniques and performance optimizations can be out of the reach of many developers. In this post, we will explore how coding assistants can help us write advanced GenAIScript workflows faster and with less effort.

## The Task

Documenting existing code is a common task in software development. It can be time-consuming and often ignored. However, it is essential for maintaining code quality and ensuring that the code is understandable by other developers.

Our goal today is to write a GenAIScript workflow that automatically adds JSDoc comments to TypeScript code that does not already have them.

The script will use AST grep functions to search the code, and then use a large language model to generate JSDoc comments for the code, and modify the code to add the comments in place.

AST grep is an advanced feature of GenAIScript that allows us to search for specific patterns in the code's abstract syntax tree (AST). It's much more effective than using LLMs to analyze the code, as it allows us to quickly find code segments that match specific criteria.

Peli explored this feature in his [AST Grep and Transform](https://microsoft.github.io/genaiscript/blog/ast-grep-and-transform/) post, and we will build on that to create our script.

Here is an example of what we want to achieve:

```typescript wrap
// Before
function calculateTotal(price: number, tax: number): number {
    return price + price * tax
}

// After
/**
 * Calculates the total amount including tax
 * @param {number} price - The base price
 * @param {number} tax - The tax rate as a decimal
 * @returns {number} The total amount including tax
 */
function calculateTotal(price: number, tax: number): number {
    return price + price * tax
}
```

## Why GenAIScript and not the coding agent?

There are several reasons why GenAIScript is a better choice than using coding assistants in agentic mode to perform the same tasks.

**Speed**: GenAIScript workflows can be executed in parallel, which can significantly reduce the time it takes to complete tasks. Imagine waiting for a coding assistant to finish generating code for a large project in your editor, versus running a GenAIScript workflow that can execute multiple tasks in the background. Which one would you prefer?

**Cost-efficiency**: GenAIScript gives you low-level control over your prompts, which allows you to optimize the prompts for your specific use case. This means you can reduce the number of tokens used, which can help you save money on LLM usage.

**Shareability**: You can share your GenAIScript workflows with other developers on your team. You might be thinking, "But I can share my coding assistant prompts too!" However, GenAIScript workflows are more than just prompts; they are self-contained scripts that chains multiple LLM calls together to perform a specific task. This makes them more powerful and flexible than a single prompt.

## Setup

We will use Cline to write our GenAIScript code. But you can use any coding assistant, including Github Copilot, Cursor or Windsurf.

First, let's install Cline from the VS Code Marketplace.

![Cline installation](./cline-1.png)

Next, we will configure Cline with our credentials. If you use Bedrock, like me, you will need to set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables in your terminal.

![Cline project setup](./cline-2.png)

Now we are ready to write our GenAIScript code. We will open our project and set it up for GenAIScript development. This involves creating a new script file. I always create one called poem.

![GenAISCript setup](./cline-3.png)

Finally, we will write a prompt for Cline to generate the GenAIScript code. The prompt will describe the task we want to accomplish, and Cline will generate the code for us.

## The Prompt

The following is the prompt I wrote for Cline to generate the GenAIScript code. It is designed to be clear and concise, while also providing enough detail for Cline to understand the task.

```markdown wrap
You are an expert software engineer, familiar in all aspects of TypeScript and GenAIScript. You will find the documentation for GenAIScript at https://microsoft.github.io/genaiscript/llms.txt. Make sure to follow the links in all the Documentation Sets to understand the full capabilities of GenAIScript before writing the script.

## Task

Your task is to write a GenAIScript script called that searches for the code in a path specified by the user using the AST grep functions, looking for functions, classes, and methods that do not have JSDoc comments. Use AST grep search functionality to perform the search.

For each function, class, or method found, the script invokes a large language model call to generate JSDoc comments that explain the code, with examples of how to use it.

The script then takes the output of this call and modifies the code to add the JSDoc comments in place, prepending the comments above the source code.

## Guidelines

The source code is written in TypeScript ESM for node.js v20+.

## Output Format

- Output a single GenAIScript script file. The file name should be `jsdoc-commentator.genai.mts`.
```

## Analysis of the Prompt

The prompt uses several techniques to ensure that the generated script meets our requirements:

1. **Expertise**: The prompt specifies that the assistant should be an expert in TypeScript and GenAIScript, which ensures that the generated code will be of high quality.
2. **Documentation**: The prompt provides a link to the GenAIScript documentation, which allows the assistant to understand the full capabilities of GenAIScript and use them effectively.
3. **Task Definition**: The prompt clearly defines the task, including the specific requirements for searching for code without JSDoc comments and generating comments using a large language model.
4. **Guidelines**: The prompt specifies that the source code is written in TypeScript ESM for node.js v20+, which ensures that the generated code will be compatible with our project.
5. **Output Format**: The prompt specifies the output format, including the file name and the expected structure of the script.

## Results

After writing the prompt, we use Cline to generate the GenAIScript code. Cline will analyze the prompt and generate a script that meets our requirements.

This is the script Cline generated for me (your script may vary slightly):

```typescript wrap
script({
    title: "Add JSDoc Comments to TypeScript Code",
    description:
        "Automatically generates JSDoc comments for TypeScript functions, classes, and methods that are missing documentation",
    parameters: {
        glob: {
            type: "string",
            description: "Glob pattern for TypeScript files to process",
            default: "**/*.{ts,tsx}",
        },
        updateExisting: {
            type: "boolean",
            description: "Update existing JSDoc comments",
            default: false,
        },
        applyEdits: {
            type: "boolean",
            description: "Apply the edits automatically",
            default: false,
        },
    },
})

// Find TypeScript files to process
const files = await workspace.findFiles(env.vars.glob || "**/*.{ts,tsx}", {
    ignore: ["**/node_modules/**", "**/dist/**", "**/*.d.ts"],
})

if (files.length === 0) {
    $`No TypeScript files found matching pattern: ${
        env.vars.glob || "**/*.{ts,tsx}"
    }`
    cancel("No files to process")
}

$`Found ${files.length} TypeScript files to analyze for missing JSDoc comments.`

// Define patterns to find declarations without JSDoc
const patterns = [
    // Function declarations
    {
        name: "function",
        regex: /^(\s*)(export\s+)?(async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm,
        description: "function declaration",
    },
    // Arrow function assignments
    {
        name: "arrow_function",
        regex: /^(\s*)(export\s+)?(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/gm,
        description: "arrow function",
    },
    // Class declarations
    {
        name: "class",
        regex: /^(\s*)(export\s+)?(abstract\s+)?class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/gm,
        description: "class declaration",
    },
    // Interface declarations
    {
        name: "interface",
        regex: /^(\s*)(export\s+)?interface\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/gm,
        description: "interface declaration",
    },
    // Method declarations (inside classes)
    {
        name: "method",
        regex: /^(\s+)(public\s+|private\s+|protected\s+)?(static\s+)?(async\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm,
        description: "method declaration",
    },
]

const allTargets = []

// Process each file
for (const file of files) {
    const content = file.content
    const lines = content.split("\n")

    // Check each pattern
    for (const pattern of patterns) {
        let match
        pattern.regex.lastIndex = 0 // Reset regex

        while ((match = pattern.regex.exec(content)) !== null) {
            const matchIndex = match.index
            const lineNumber =
                content.substring(0, matchIndex).split("\n").length - 1
            const lineContent = lines[lineNumber]?.trim()

            // Skip if line is empty or looks like it already has JSDoc
            if (
                !lineContent ||
                lineContent.startsWith("//") ||
                lineContent.startsWith("*")
            ) {
                continue
            }

            // Check if previous line has JSDoc comment
            let hasJSDoc = false
            for (let i = lineNumber - 1; i >= 0; i--) {
                const prevLine = lines[i]?.trim()
                if (!prevLine) continue

                if (prevLine.startsWith("/**") || prevLine.includes("/**")) {
                    hasJSDoc = true
                    break
                }
                if (
                    prevLine &&
                    !prevLine.startsWith("*") &&
                    !prevLine.startsWith("//")
                ) {
                    break
                }
            }

            if (!hasJSDoc) {
                // Extract the full declaration (try to get multiple lines if needed)
                let declarationLines = [lineContent]
                let currentLine = lineNumber + 1

                // For functions/methods, try to capture the full signature
                if (pattern.name !== "interface" && pattern.name !== "class") {
                    while (
                        currentLine < lines.length &&
                        !lines[currentLine]?.includes("{") &&
                        !lines[currentLine]?.includes("=>")
                    ) {
                        const nextLine = lines[currentLine]?.trim()
                        if (nextLine) {
                            declarationLines.push(nextLine)
                        }
                        currentLine++
                    }
                }

                allTargets.push({
                    file: file.filename,
                    line: lineNumber + 1,
                    code: declarationLines.join("\n"),
                    type: pattern.name,
                    description: pattern.description,
                    indent: match[1] || "",
                })
            }
        }
    }
}

if (allTargets.length === 0) {
    $`✅ All TypeScript declarations already have JSDoc comments or no declarations found.`
    cancel("No work needed")
}

$`Found ${allTargets.length} TypeScript declarations missing JSDoc comments.`

// Show preview of targets
def("TARGETS", JSON.stringify(allTargets.slice(0, 10), null, 2)) // Show first 10 for brevity

$`## Task

Generate appropriate JSDoc documentation for each TypeScript declaration listed above. Follow these guidelines:

### JSDoc Format Requirements:
1. Use proper JSDoc block comment syntax: \`/**\` to \`*/\`
2. Include a concise description of what the function/class/interface does
3. For functions and methods:
   - Document all parameters with \`@param {type} paramName - description\`
   - Document return type with \`@returns {type} description\` (if not void)
   - Add \`@throws\` if the function can throw exceptions
4. For classes:
   - Provide a clear class description
   - Document constructor parameters if applicable
5. For interfaces:
   - Describe the purpose and usage of the interface
   - Document complex properties if needed

### Code Analysis Guidelines:
- Analyze the function/method signature to understand parameters and return types
- Infer the purpose from the function name and implementation
- Consider the context (class methods, utility functions, etc.)
- Keep descriptions concise but informative
- Use TypeScript-aware JSDoc annotations

### Output Format:
For each target, provide the JSDoc comment that should be inserted immediately before the declaration. Format as:

\`\`\`typescript
/**
 * Your generated JSDoc comment here
 * @param {type} param - description
 * @returns {type} description
 */
// The original code would follow here
\`\`\`

Generate JSDoc comments for all the targets listed above.`

// If apply edits is enabled, create file edits
if (env.vars.applyEdits) {
    $`

## Applying Edits

Since applyEdits is enabled, I will now apply the generated JSDoc comments to the source files.`

    const fileEdits = []

    // Process each target and add JSDoc comment
    for (const [index, target] of allTargets.entries()) {
        console.log(
            `Processing ${index + 1}/${allTargets.length}: ${target.file}:${
                target.line
            }`
        )

        // Generate JSDoc for this specific target
        const jsdocPrompt = `Generate a JSDoc comment for this TypeScript ${target.description}:

\`\`\`typescript
${target.code}
\`\`\`

File: ${target.file}
Line: ${target.line}

Return only the JSDoc comment block (/**...*/) with proper indentation matching the code.
The comment should be concise but informative.`

        const jsdocResult = await runPrompt(jsdocPrompt, {
            model: "gpt-4o",
            temperature: 0.1,
        })

        if (jsdocResult.text?.trim()) {
            // Read the current file content
            const currentFile = await workspace.readText(target.file)
            const lines = currentFile.content.split("\n")

            // Insert the JSDoc comment before the target line
            const insertLine = target.line - 1 // Convert to 0-based index
            const jsDocComment = jsdocResult.text.trim()

            // Ensure proper indentation
            const indentedJSDoc = jsDocComment
                .split("\n")
                .map((line) => (line ? target.indent + line : line))
                .join("\n")

            lines.splice(insertLine, 0, indentedJSDoc)

            // Create file edit
            fileEdits.push({
                filename: target.file,
                content: lines.join("\n"),
            })
        }
    }

    // Write all updated files
    if (fileEdits.length > 0) {
        for (const edit of fileEdits) {
            await workspace.writeText(edit.filename, edit.content)
        }
        $`✅ Applied JSDoc comments to ${fileEdits.length} files with ${allTargets.length} total declarations.`
    } else {
        $`❌ No JSDoc comments were generated successfully.`
    }
} else {
    $`

## Preview Mode

Set \`applyEdits: true\` to automatically apply the generated JSDoc comments to your source files.`
}
```

## Running the Script

To run the script, we need to execute it in our terminal. Make sure you have GenAIScript installed and configured correctly.

```bash wrap
npx genaiscript run jsdoc-commentator.genai.mts
```

## Conclusion

In this post, we explored how coding assistants can help us write GenAIScript workflows faster and with less effort. We used Cline to generate a script that automatically adds JSDoc comments to TypeScript code that does not already have them. We also discussed the advantages of using GenAIScript over coding assistants in agentic mode for this task.
