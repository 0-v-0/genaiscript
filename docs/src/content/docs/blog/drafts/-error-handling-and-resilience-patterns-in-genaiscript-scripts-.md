---
title: '"Error Handling and Resilience Patterns in GenAIScript Scripts"'
date: 2025-05-31
authors: genaiscript
draft: true
tags:
  - GenAIScript
  - Error Handling
  - Automation
  - Patterns
  - Scripting

---

# "Error Handling and Resilience Patterns in GenAIScript Scripts"

Writing robust automation scripts isn't just about making things work when all goes right; it’s about making them reliable when things go wrong. In this blog post, we'll walk through a comprehensive GenAIScript example that demonstrates key error handling and resilience patterns, focusing on actual code you can run with the GenAIScript CLI. These techniques will help your scripts handle failures gracefully, retry as needed, and provide fallback options—all while giving you detailed feedback via annotations. 🚦

Let’s break down the code, line by line, explaining how each piece contributes to resilient script automation.

---

## Script Overview

```js
script({
  title: "Error Handling and Resilience Demo",
  description: "Demonstrates error handling and resilience patterns in GenAIScript",
  model: "large",
  system: ["system", "system.assistant", "system.annotations"],
})
```

- `script({ ... })`: This declares a new GenAIScript script block with a title, description, and specifies the LLM model.  
- `title`: A user-friendly name for the script.  
- `description`: Briefly describes its purpose.
- `model`: The model used for AI operations (here, `"large"` for high-quality results).
- `system`: This array specifies system modules to load—in this example, the assistant and annotation systems for feedback and diagnostics.

---

```js
def("INPUT_FILES", env.files, { lineNumbers: true })
```

- `def("INPUT_FILES", env.files, { lineNumbers: true })`: Defines a variable `INPUT_FILES`, mapping it to all the files provided by the environment.  
- `env.files`: Built-in GenAIScript global referencing input files.
- `{ lineNumbers: true }`: Option to include line numbers, useful for diagnostics and feedback.

---

### Step 1: Reading Files with Error Handling

```js
step("Read Files", async ({ INPUT_FILES }) => {
  const results = [];
  for (const file of INPUT_FILES) {
    try {
      const content = await fs.readFile(file.path, "utf8")
      results.push({ file: file.path, content })
    } catch (error) {
      annotation({
        type: "error",
        file: file.path,
        message: `Failed to read file: ${error.message}`,
      })
    }
  }
  return { files: results }
})
```

- `step("Read Files", ...)`: Defines a script step to read each provided file.
- `for (const file of INPUT_FILES)`: Iterates through all input files.
- `await fs.readFile(file.path, "utf8")`: Asynchronously reads each file as UTF-8 text.
- `try { ... } catch (error) { ... }`: Handles read errors gracefully.  
  - If a file fails to read, an error `annotation` is created so it's clear which files had issues.
- The successfully read files and their content are local to the next steps `{ files: results }`.

[Annotations Documentation ↗](https://microsoft.github.io/genaiscript/docs/reference/annotations)

---

### Step 2: Retry Logic for Unreliable Operations

```js
step("Unreliable Operation with Retry", async ({ files }) => {
  for (const file of files) {
    let attempts = 0;
    let success = false;
    let lastError = null;
    while (attempts < 3 && !success) {
      attempts++;
      try {
        if (Math.random() < 0.5) throw new Error("Random failure");
        annotation({
          type: "info",
          file: file.file,
          message: `Operation succeeded on attempt ${attempts}`,
        })
        success = true;
      } catch (err) {
        lastError = err;
        annotation({
          type: attempts < 3 ? "warning" : "error",
          file: file.file,
          message: `Attempt ${attempts} failed: ${err.message}`,
        })
      }
    }
    if (!success) {
      annotation({
        type: "error",
        file: file.file,
        message: `Operation failed after 3 attempts: ${lastError.message}`,
      })
    }
  }
})
```

- This step simulates *unreliable* operations by randomly failing (using `Math.random()`).
- `let attempts = 0; while (attempts < 3 && !success)`: Implements a retry loop with a maximum of 3 tries.
- On each failure, a `warning` (if not last attempt) or `error` (final failure) is annotated.
- Successes are noted with an `info` annotation.
- If all retries fail, a final error annotation is logged for the file.

[Retry Patterns Documentation ↗](https://microsoft.github.io/genaiscript/docs/recipes/patterns#error-handling--retry)

---

### Step 3: Fallback Pattern for Resilience

```js
step("Fallback on Failure", async ({ files }) => {
  for (const file of files) {
    try {
      if (Math.random() < 0.5) throw new Error("Primary operation failed");
      annotation({
        type: "info",
        file: file.file,
        message: "Primary operation succeeded.",
      })
    } catch (primaryError) {
      annotation({
        type: "warning",
        file: file.file,
        message: `Primary failed: ${primaryError.message}. Falling back...`,
      })
      // Fallback operation (always succeeds here)
      annotation({
        type: "info",
        file: file.file,
        message: "Fallback operation succeeded.",
      })
    }
  }
})
```

- Each file undergoes a "primary operation" which may randomly fail (simulated).
- If it fails, a `warning` annotation is triggered, then a fallback action automatically runs, logging its own success with an `info` annotation.
- This demonstrates the *fallback pattern*—making scripts more resilient by having a Plan B when Plan A fails.

[Fallback Patterns Documentation ↗](https://microsoft.github.io/genaiscript/docs/recipes/patterns#error-handling--fallbacks)

---

### Step 4: Summarizing Results

```js
step("Summary", async () => {
  $`
  ## Error Handling and Resilience Summary

  - Errors and warnings were annotated per file.
  - Retry and fallback patterns were demonstrated.
  - Review the annotations for details on failures, retries, and fallbacks.
  `
})
```

- The last step uses GenAIScript’s Markdown output (`$`` ... ```) to generate a clear summary.
- It guides users to examine annotations (usually displayed in the CLI or web UI) for detailed context.
- Summaries are invaluable after long scripts, helping reviewers and engineers quickly assess what happened and where.

[Step and Output Documentation ↗](https://microsoft.github.io/genaiscript/docs/reference/core#step)

---

## Wrap Up

This script showcases essential automation resilience patterns in GenAIScript—**error handling**, **retry logic**, and **fallbacks**—with rich, per-file annotations. By breaking failures into recoverable paths and reporting status at every juncture, your scripts will be trustworthy, debuggable, and production-ready. 🛠️✨

For more advanced examples and a deeper dive into script authoring, visit the [GenAIScript documentation](https://microsoft.github.io/genaiscript/).

Happy scripting!