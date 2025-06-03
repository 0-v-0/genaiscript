---
title: '"Version Control–Driven GenAIScript Workflows: Automating AI Tasks Based
  on Git Branches and Merges"'
date: 2025-06-03
authors: genaiscript
draft: true
tags:
  - genaiscript
  - git
  - automation
  - workflows
  - scripting
  - development
  - AI
  - version control

---

# "Version Control–Driven GenAIScript Workflows: Automating AI Tasks Based on Git Branches and Merges"

When your AI scripts can respond to the current state of your version control system, development becomes smarter and safer! In this post, we'll walk through a GenAIScript that **detects Git branches, merges, PRs, rebases, and commit states**, then dynamically adapts its behavior. You'll see how to write scripts that automate and contextualize AI prompts for real-world Git workflows.

We’ll break down a sample script, line by line, to help you build your own context-aware GenAIScript workflows. Let’s dive in! 🚀

---

## Overview: Why Context-Aware Git Workflows Matter

Software teams live and breathe Git. The current branch, merge state, and PR context all affect how code should be reviewed, described, or merged. Automating AI tasks—like generating commit messages, summarizing PR risks, or even resolving merge messages—can streamline code quality, save time, and avoid mistakes.

But to do this, your script needs to **know exactly what’s happening in Git right now**. That’s what we’ll build today!

---

## Script Overview

The following GenAIScript:

- Detects what’s happening in your Git repository (current branch, merge, rebase, PR context, etc.)
- Prints a summary of the context
- Dynamically triggers helpful AI logic depending on what phase you’re in: merging, making a PR, or writing a commit

Let’s look at the script, then break it down.

---

## Full Script

```js
script({
    title: "Version Control–Driven Workflow",
    description: "Dynamically adapt to git branch, merge, and commit context to automate and contextualize AI tasks.",
    model: "openai:gpt-4o"
})

const branch = (await host.exec("git", ["rev-parse", "--abbrev-ref", "HEAD"])).stdout.trim()
const status = (await host.exec("git", ["status", "--porcelain"])).stdout.trim()
const mergeHead = await host.fs.exists(".git/MERGE_HEAD")
const rebaseApply = await host.fs.exists(".git/rebase-apply")
const isMerging = !!mergeHead
const isRebasing = !!rebaseApply

let contextSummary = `Current git branch: ${branch}.\n`
if (isMerging) contextSummary += "A merge is in progress.\n"
if (isRebasing) contextSummary += "A rebase is in progress.\n"
if (status) contextSummary += "There are uncommitted changes.\n"
else contextSummary += "Working tree is clean.\n"

// Optionally, detect if inside a PR/CI environment
env = host.env || process.env
const isPR = !!(env.GITHUB_HEAD_REF || env.GITHUB_REF?.includes("/pull/"))
if (isPR) contextSummary += "This appears to be a Pull Request context.\n"

console.log(contextSummary)

// Example: Dynamic automation based on context
if (isMerging) {
    const mergeMsg = await host.fs.readFile(".git/MERGE_MSG")
    const diff = (await host.exec("git", ["diff", "--cached"])).stdout
    const aiSuggestion = await runPrompt(_ => {
        _.def("MERGE_MSG", mergeMsg)
        _.def("MERGE_DIFF", diff, { language: "diff", maxTokens: 20000 })
        _.$`There is a merge in progress. Suggest a safe merge commit message for the following situation.\nMERGE_MSG:\n{MERGE_MSG}\nMERGE_DIFF:\n{MERGE_DIFF}`
    })
    if (await host.confirm("Use this merge commit message?", { default: true, detail: aiSuggestion })) {
        await host.exec("git", ["commit", "--no-edit", "--allow-empty-message"])
    }
}
else if (isPR) {
    const prDiff = (await host.exec("git", ["diff", "origin/main...HEAD"])).stdout
    const prDesc = await runPrompt(_ => {
        _.def("PR_DIFF", prDiff, { language: "diff", maxTokens: 20000 })
        _.$`You are in a pull request context. Summarize the intent and risk of these changes for reviewers.\nPR_DIFF:\n{PR_DIFF}`
    })
    console.log("Suggested PR description:\n" + prDesc)
}
else if (status) {
    // Uncommitted changes: suggest a commit message
    const diff = (await host.exec("git", ["diff", "--cached"])).stdout
    const commitMsg = await runPrompt(_ => {
        _.def("GIT_DIFF", diff, { language: "diff", maxTokens: 20000 })
        _.$`Suggest a git commit message for the following changes.\nGIT_DIFF:\n{GIT_DIFF}`
    })
    if (await host.confirm("Use this commit message?", { default: true, detail: commitMsg })) {
        await host.exec("git", ["commit", "-m", commitMsg, "-n"])
    }
} else {
    console.log("No actionable git context detected.")
}
```

---

## Line-By-Line Breakdown

Let’s walk through what each part of the code does, with explanations and pointers for customizing or expanding it. For detailed GenAIScript docs, see the [official documentation](https://microsoft.github.io/genaiscript/).

### 1. Script Header

```js
script({
    title: "Version Control–Driven Workflow",
    description: "Dynamically adapt to git branch, merge, and commit context to automate and contextualize AI tasks.",
    model: "openai:gpt-4o"
})
```
- **Purpose:** Declares the script’s metadata.
- **How it works:** Sets a human-readable `title` and `description`. The `model` property tells GenAIScript to use OpenAI's GPT-4o model for all `.runPrompt()` calls.
- [Read more](https://microsoft.github.io/genaiscript/reference/scripts/)

---

### 2. Gather Git Status and State

```js
const branch = (await host.exec("git", ["rev-parse", "--abbrev-ref", "HEAD"])).stdout.trim()
```
- Runs `git rev-parse --abbrev-ref HEAD` to find the current branch name.
- `.stdout.trim()` returns just the branch as a string.

```js
const status = (await host.exec("git", ["status", "--porcelain"])).stdout.trim()
```
- Runs `git status --porcelain`, capturing all file changes in a clean, parseable format.
- If `status` is non-empty, there are uncommitted changes.

```js
const mergeHead = await host.fs.exists(".git/MERGE_HEAD")
const rebaseApply = await host.fs.exists(".git/rebase-apply")
const isMerging = !!mergeHead
const isRebasing = !!rebaseApply
```
- Checks directly in `.git/` if a merge or rebase is happening:
    - `.git/MERGE_HEAD` exists during a merge
    - `.git/rebase-apply` exists during a rebase
- These indicators are turned into booleans for easy logic checks.

---

### 3. Formulate Context Summary

```js
let contextSummary = `Current git branch: ${branch}.\n`
if (isMerging) contextSummary += "A merge is in progress.\n"
if (isRebasing) contextSummary += "A rebase is in progress.\n"
if (status) contextSummary += "There are uncommitted changes.\n"
else contextSummary += "Working tree is clean.\n"
```
- Strings together a human-readable summary, ready for logging or debugging.

```js
// Optionally, detect if inside a PR/CI environment
env = host.env || process.env
const isPR = !!(env.GITHUB_HEAD_REF || env.GITHUB_REF?.includes("/pull/"))
if (isPR) contextSummary += "This appears to be a Pull Request context.\n"
```
- Environment variables (commonly set by GitHub Actions and other CI systems) are used to infer PR context.
- Adds another line to the summary if detected.

```js
console.log(contextSummary)
```
- Prints the detected state for easy verification.

---

### 4. Dynamic Automations: What Happens Next?

#### Handling a Merge in Progress

```js
if (isMerging) {
    const mergeMsg = await host.fs.readFile(".git/MERGE_MSG")
    const diff = (await host.exec("git", ["diff", "--cached"])).stdout
    const aiSuggestion = await runPrompt(_ => {
        _.def("MERGE_MSG", mergeMsg)
        _.def("MERGE_DIFF", diff, { language: "diff", maxTokens: 20000 })
        _.$`There is a merge in progress. Suggest a safe merge commit message for the following situation.\nMERGE_MSG:\n{MERGE_MSG}\nMERGE_DIFF:\n{MERGE_DIFF}`
    })
    if (await host.confirm("Use this merge commit message?", { default: true, detail: aiSuggestion })) {
        await host.exec("git", ["commit", "--no-edit", "--allow-empty-message"])
    }
}
```
- Reads the current merge message and staged diff.
- Uses [`runPrompt`](https://microsoft.github.io/genaiscript/reference/functions/#runprompt) to ask GPT-4o for a safe merge message, passing context as variables.
- Asks the user for confirmation (via [`host.confirm`](https://microsoft.github.io/genaiscript/reference/host/#confirm)); if accepted, makes the merge commit.

#### Handling Pull Request Context

```js
else if (isPR) {
    const prDiff = (await host.exec("git", ["diff", "origin/main...HEAD"])).stdout
    const prDesc = await runPrompt(_ => {
        _.def("PR_DIFF", prDiff, { language: "diff", maxTokens: 20000 })
        _.$`You are in a pull request context. Summarize the intent and risk of these changes for reviewers.\nPR_DIFF:\n{PR_DIFF}`
    })
    console.log("Suggested PR description:\n" + prDesc)
}
```
- If detected as a PR, gets a diff from the base branch (`origin/main...HEAD`).
- Requests an AI-generated PR summary for reviewers.
- Prints the suggestion for the user to copy-paste or edit.

#### Handling Uncommitted Changes

```js
else if (status) {
    // Uncommitted changes: suggest a commit message
    const diff = (await host.exec("git", ["diff", "--cached"])).stdout
    const commitMsg = await runPrompt(_ => {
        _.def("GIT_DIFF", diff, { language: "diff", maxTokens: 20000 })
        _.$`Suggest a git commit message for the following changes.\nGIT_DIFF:\n{GIT_DIFF}`
    })
    if (await host.confirm("Use this commit message?", { default: true, detail: commitMsg })) {
        await host.exec("git", ["commit", "-m", commitMsg, "-n"])
    }
}
```
- When there are staged, uncommitted changes, gets the diff.
- Asks the AI to suggest a commit message and confirms with the user.
- If confirmed, creates the commit.

#### No Actionable Context

```js
else {
    console.log("No actionable git context detected.")
}
```
- If nothing relevant is active (not merging, no PR, no changes), logs a message and ends.

---

## Extending and Customizing the Script

- **Add more context detection:** You could add logic for stashes, tags, or specific commit histories.
- **Customize prompts:** Tune the AI prompts for your team’s tone or requirements.
- **Integrate notifications:** Trigger Slack/Teams notifications on PR description creation, or automate fully with GitHub Actions.

For further inspiration, explore the [GenAIScript sample scripts](https://github.com/microsoft/genaiscript/tree/main/packages/sample/src) and check out the [function reference](https://microsoft.github.io/genaiscript/reference/).

---

## Wrap Up

With just a few lines of code, GenAIScript can make your AI scripts **context-aware and workflow-smart**, letting you automate more and type less—even in complex Git situations. Try it out in your next project!

Questions? Ideas? [Join the GenAIScript discussion](https://github.com/microsoft/genaiscript/discussions) and share your own workflows!

Happy scripting! 🛠️✨