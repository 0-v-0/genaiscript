---
title: Leveraging GenAIScript for Real-Time Collaborative Editing and Shared AI
  Workflows
date: 2025-06-16
authors: genaiscript
draft: true
tags:
  - genaiscript
  - collaboration
  - real-time-editing
  - workflows
  - scripting

---

# "Leveraging GenAIScript for Real-Time Collaborative Editing and Shared AI Workflows" 🚀

Real-time collaboration is transforming the way teams code and interact with AI systems. GenAIScript, with its versatile scripting capabilities, allows you to build collaborative experiences directly into your AI-powered workflows. In this post, we'll walk through a complete GenAIScript script that enables shared editing sessions, AI-driven summaries, and workflow suggestions—bringing seamless teamwork to your next-gen agent projects.

Let's break down the script line-by-line so you can tailor and extend it for your own real-time collaborative needs!

---

## Script Metadata and Parameters

```javascript
script({
    title: "Real-Time Collaborative Editing and Shared AI Workflows",
    description: "Enable collaborative editing and shared AI workflows using GenAIScript agents and shared state.",
    systemSafety: true,
    tools: ["agent_fs"],
    parameters: {
        sessionId: {
            description: "Unique identifier for the collaborative session",
            type: "string",
            required: true
        },
        userId: {
            description: "User ID for tracking individual collaborators",
            type: "string",
            required: true
        },
        filePath: {
            description: "The file being collaboratively edited",
            type: "string",
            required: true
        },
        message: {
            description: "The latest edit or instruction from the user",
            type: "string",
            required: false
        }
    }
})
```

- `script({ ... })` defines the script's metadata and input parameters for GenAIScript ([reference](https://microsoft.github.io/genaiscript/docs/reference/script/)). Here, we're declaring four parameters to uniquely identify each session and user, track which file is being edited, and capture any new contributions.

---

## Environment Variables Extraction 🌍

```javascript
const { vars, dbg } = env
const { sessionId, userId, filePath, message } = vars
```

- Grabs ambient values (`env`) provided by the GenAIScript runtime, extracting both utility functions (`dbg`) and the user-provided parameters.

---

## Shared Session State Management 🔄

```javascript
// Shared state in a session file
const sessionFile = `.genaiscript/collab/${sessionId}.json`
```

- Defines where collaborative session data will be stored—a JSON file unique to each session.

```javascript
// Initialize or update session state
let sessionState = {}
try {
    sessionState = await agent_fs.readFile(sessionFile, { json: true }) || {}
} catch {
    sessionState = { edits: [], users: [] }
}
```

- Attempts to read persistent session state from disk using `agent_fs.readFile`. If the file doesn't exist, initializes with empty edits and users arrays.
- The [`agent_fs`](https://microsoft.github.io/genaiscript/docs/reference/agent_fs/) tool provides basic file I/O support, perfect for collaborative scenarios.

---

## Tracking Participating Users 👤

```javascript
// Track active users
if (!sessionState.users.includes(userId)) {
    sessionState.users.push(userId)
}
```

- Checks if the current user is already listed as active. If not, they're added—enabling real-time tracking of all collaborators in the session.

---

## Recording Edits ✍️

```javascript
// Track new edit
if (message) {
    sessionState.edits.push({
        userId,
        timestamp: new Date().toISOString(),
        filePath,
        message
    })
}
```

- Every message (edit or instruction) from a user is timestamped and logged with their ID and the relevant file. The script only logs new edits if a message is present.

---

## Persisting Updated State 💾

```javascript
// Write updated state
await agent_fs.writeFile(sessionFile, sessionState, { json: true })
```

- The modified session state is saved—making all changes available to future script runs and collaborators.

---

## Displaying File Contents 📄

```javascript
// Read current file content
const fileContent = await agent_fs.readFile(filePath, { encoding: "utf8" }) || ""
```

- Loads the file being collaboratively edited so AI-driven summaries and feedback are always up-to-date.

---

## Synthesis: Collaborative Session Report & AI Insights 🤖

```javascript
// Synthesize collaborative summary and next steps
$`# Collaborative Editing Session

## Session ID: ${sessionId}
## File: ${filePath}

### Active Users:
${sessionState.users.map(u => `- ${u}`).join("\n")}

### Recent Edits:
${sessionState.edits.slice(-5).map(e => `- [${e.timestamp}] **${e.userId}**: ${e.message}`).join("\n")}

---

## Current File Content:

\`\`\`
${fileContent.slice(0, 1000)}
\`\`\`

---

## AI Suggestions

- Summarize the recent changes collaboratively made by all users.
- Suggest next steps for further editing or improvements.
- If conflicts are detected in edits, propose a resolution strategy.
`
```

- The template literal (`$``...``) synthesizes a Markdown-formatted collaborative session summary. It includes:
  - Session and file details
  - List of active users
  - The five most recent edits, displaying user, time, and messages
  - The latest file contents for context
  - Prompts for AI agents to summarize changes, suggest improvements, and offer resolution strategies if user edits conflict.

---

## What's Next?

With this script, teams can build real-time, AI-augmented collaboration directly into any GenAIScript-powered automation. Extend it by:
- Adding authentication or finer access controls
- Integrating notifications (email, chat, etc.)
- Customizing the AI prompts to suit your workflow (see [Prompt Design](https://microsoft.github.io/genaiscript/docs/prompting/))

Explore more examples in the [`packages/sample/src/`](https://github.com/microsoft/genaiscript/tree/main/packages/sample/src) directory and tailor GenAIScript to your team's collaboration needs today!

---

Happy collaborating! 🛠✨

For further reference, check out the [GenAIScript documentation](https://microsoft.github.io/genaiscript/).