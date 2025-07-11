![A yellow square with the word "gen" in lowercase black letters above the uppercase black letters "AI."](./docs/public/images/favicon.png)

# GenAIScript

## Prompting is Coding

Programmatically assemble prompts for LLMs using JavaScript. Orchestrate LLMs, tools, and data in code.

- JavaScript toolbox to work with prompts
- Abstraction to make it easy and productive
- Seamless Visual Studio Code integration or flexible command line
- Built-in support for GitHub Copilot and GitHub Models, OpenAI, Azure OpenAI, Anthropic, and more

- 📄 **Read the ONLINE DOCUMENTATION at [microsoft.github.io/genaiscript](https://microsoft.github.io/genaiscript/)**
- 💬 Join the [Discord server](https://discord.gg/y7HpumjHeB)
- 📝 Read the [blog](https://microsoft.github.io/genaiscript/blog/) for the latest news
- 📺 Watch [Mr. Maeda's Cozy AI Kitchen](https://youtu.be/ajEbAm6kjI4)
- 🤖 Agents - read the [llms-full.txt](https://microsoft.github.io/genaiscript/llms-full.txt)

---

## Hello world

Say to you want to create an LLM script that generates a 'hello world' poem. You can write the following script:

```js
$`Write a 'hello world' poem.`
```

The `$` function is a template tag that creates a prompt. The prompt is then sent to the LLM (you configured), which generates the poem.

Let's make it more interesting by adding files, data and structured output. Say you want to include a file in the prompt, and then save the output in a file. You can write the following script:

```js
// read files
const file = await workspace.readText("data.txt")
// include the file content in the prompt in a context-friendly way
def("DATA", file)
// the task
$`Analyze DATA and extract data in JSON in data.json.`
```

The `def` function includes the content of the file, and optimizes it if necessary for the target LLM. GenAIScript script also parses the LLM output
and will extract the `data.json` file automatically.

---

## 🚀 Quickstart Guide

Get started quickly by installing the [Visual Studio Code Extension](https://microsoft.github.io/genaiscript/getting-started/installation/) or using the [command line](https://microsoft.github.io/genaiscript/getting-started/installation).

---

## ✨ Features

### 🎨 Stylized JavaScript & TypeScript

Build prompts programmatically using [JavaScript](https://microsoft.github.io/genaiscript/reference/scripts/) or [TypeScript](https://microsoft.github.io/genaiscript/reference/scripts/typescript).

```js
def("FILE", env.files, { endsWith: ".pdf" })
$`Summarize FILE. Today is ${new Date()}.`
```

---

### 🚀 Fast Development Loop

Edit, [Debug](https://microsoft.github.io/genaiscript/getting-started/debugging-scripts/), [Run](https://microsoft.github.io/genaiscript/getting-started/running-scripts/), and [Test](https://microsoft.github.io/genaiscript/getting-started/testing-scripts/) your scripts in [Visual Studio Code](https://microsoft.github.io/genaiscript/getting-started/installation) or with the [command line](https://microsoft.github.io/genaiscript/getting-started/installation).

---

### 🔗 Reuse and Share Scripts

Scripts are [files](https://microsoft.github.io/genaiscript/reference/scripts/)! They can be versioned, shared, and forked.

```js
// define the context
def("FILE", env.files, { endsWith: ".pdf" })
// structure the data
const schema = defSchema("DATA", { type: "array", items: { type: "string" } })
// assign the task
$`Analyze FILE and extract data to JSON using the ${schema} schema.`
```

---

### 📋 Data Schemas

Define, validate, and repair data using [schemas](https://microsoft.github.io/genaiscript/reference/scripts/schemas). Zod support builtin.

```js
const data = defSchema("MY_DATA", { type: "array", items: { ... } })
$`Extract data from files using ${data} schema.`
```

---

### 📄 Ingest Text from PDFs, DOCX, ...

Manipulate [PDFs](https://microsoft.github.io/genaiscript/reference/scripts/pdf), [DOCX](https://microsoft.github.io/genaiscript/reference/scripts/docx), ...

```js
def("PDF", env.files, { endsWith: ".pdf" })
const { pages } = await parsers.PDF(env.files[0])
```

---

### 📊 Ingest Tables from CSV, XLSX, ...

Manipulate tabular data from [CSV](https://microsoft.github.io/genaiscript/reference/scripts/csv), [XLSX](https://microsoft.github.io/genaiscript/reference/scripts/xlsx), ...

```js
def("DATA", env.files, { endsWith: ".csv", sliceHead: 100 })
const rows = await parsers.CSV(env.files[0])
defData("ROWS", rows, { sliceHead: 100 })
```

---

### 📝 Generate Files

Extract files and diff from the LLM output. Preview changes in Refactoring UI.

```js
$`Save the result in poem.txt.`
```

```txt
FILE ./poem.txt
The quick brown fox jumps over the lazy dog.
```

---

### 🔍 File Search

Grep or fuzz search [files](https://microsoft.github.io/genaiscript/reference/scripts/files).

```js
const { files } = await workspace.grep(/[a-z][a-z0-9]+/, { globs: "*.md" })
```

---

## Classify

Classify text, images or a mix of all.

```js
const joke = await classify(
    "Why did the chicken cross the road? To fry in the sun.",
    {
        yes: "funny",
        no: "not funny",
    }
)
```

### LLM Tools

Register JavaScript functions as [tools](https://microsoft.github.io/genaiscript/reference/scripts/tools)
(with fallback for models that don't support tools). [Model Context Protocol (MCP) tools](https://microsoft.github.io/genaiscript/reference/scripts/mcp-tools) are also supported.

```js
defTool(
    "weather",
    "query a weather web api",
    { location: "string" },
    async (args) =>
        await fetch(`https://weather.api.api/?location=${args.location}`)
)
```

---

### LLM Agents

Register JavaScript functions as **tools** and combine tools + prompt into agents.

```js
defAgent(
    "git",
    "Query a repository using Git to accomplish tasks.",
    `Your are a helpful LLM agent that can use the git tools to query the current repository.
    Answer the question in QUERY.
    - The current repository is the same as github repository.`,
    { model, system: ["system.github_info"], tools: ["git"] }
)
```

then use it as a tool

```js
script({ tools: "agent_git" })

$`Do a statistical analysis of the last commits`
```

See the [git agent source](https://github.com/microsoft/genaiscript/blob/main/packages/cli/genaisrc/system.agent_git.genai.mts).

---

### 🔍 RAG Built-in

[Vector search](https://microsoft.github.io/genaiscript/reference/scripts/vector-search/).

```js
const { files } = await retrieval.vectorSearch("cats", "**/*.md")
```

---

### 🐙 GitHub Models and GitHub Copilot

Run models through [GitHub Models](https://microsoft.github.io/genaiscript/configuration/github) or [GitHub Copilot](https://microsoft.github.io/genaiscript/configuration/github-copilot-chat).

```js
script({ ..., model: "github:gpt-4o" })
```

---

### 💻 Local Models

Run your scripts with [Open Source models](https://microsoft.github.io/genaiscript/getting-started/configuration/), like [Phi-3](https://azure.microsoft.com/en-us/blog/introducing-phi-3-redefining-whats-possible-with-slms/), using [Ollama](https://ollama.com/), [LocalAI](https://localai.io/).

```js
script({ ..., model: "ollama:phi3" })
```

---

### 🐍 Code Interpreter

Let the LLM run code in a sand-boxed execution environment.

```js
script({ tools: ["python_code_interpreter"] })
```

---

### 🐳 Containers

Run code in Docker [containers](https://microsoft.github.io/genaiscript/reference/scripts/container).

```js
const c = await host.container({ image: "python:alpine" })
const res = await c.exec("python --version")
```

---

### Video processing

Transcribe and screenshot your videos so that you can feed them efficiently in your LLMs requests.

```js
// transcribe
const transcript = await transcript("path/to/audio.mp3")
// screenshots at segments
const frames = await ffmpeg.extractFrames("path_url_to_video", { transcript })
def("TRANSCRIPT", transcript)
def("FRAMES", frames)
```

### 🧩 LLM Composition

[Run LLMs](https://microsoft.github.io/genaiscript/reference/scripts/inline-prompts/) to build your LLM prompts.

```js
for (const file of env.files) {
    const { text } = await runPrompt((_) => {
        _.def("FILE", file)
        _.$`Summarize the FILE.`
    })
    def("SUMMARY", text)
}
$`Summarize all the summaries.`
```

---

### 🅿️ Prompty support

Run your [Prompty](https://prompty.ai) files as well!

```markdown
---
name: poem
---

Write me a poem
```

---

### Pluggable Secret Scanning

Scan your chats for secrets using [secret scanning](/genaiscript/reference/scripts/secret-scanning).

```json
{
    "secretPatterns": {
        ...,
        "OpenAI API Key": "sk-[A-Za-z0-9]{32,48}"
    }
}
```

### ⚙ Automate with CLI or API

Automate using the [CLI](https://microsoft.github.io/genaiscript/reference/cli) or [API](https://microsoft.github.io/genaiscript/reference/api).

```bash
npx genaiscript run tlaplus-linter "*.tla"
```

```js
import { run } from "genaiscript/api"

const res = await run("tlaplus-linter", "*.tla")
```

---

### Safety First!

GenAIScript provides built-in Responsible AI system prompts and Azure Content Safety supports
to validate [content safety](https://microsoft.github.io/genaiscript/reference/scripts/content-safety).

```js wrap
script({ ...,
    system: ["system.safety_harmful_content", ...],
    contentSafety: "azure" // use azure content safety
})

const safety = await host.contentSafety()
const res = await safety.detectPromptInjection(env.vars.input)
```

---

### 💬 Pull Request Reviews

Integrate into your [Pull Requests checks](https://microsoft.github.io/genaiscript/reference/cli/run/#pull-requests) through comments, reviews, or description updates. Supports GitHub Actions and Azure DevOps pipelines.

```bash wrap
npx genaiscript ... --pull-request-reviews
```

---

### ⭐ Tests and Evals

Build reliable prompts using [tests and evals](https://microsoft.github.io/genaiscript/reference/scripts/tests) powered by [promptfoo](https://promptfoo.dev/).

```js wrap
script({ ..., tests: {
  files: "penguins.csv",
  rubric: "is a data analysis report",
  facts: "The data refers about penguin population in Antarctica.",
}})
```

---

### LLM friendly docs

The entire content of the docs is rendered at https://microsoft.github.io/genaiscript/llms-full.txt in markdown. Feed it directly into your favorite RAG system.

If you are an LLM crawler, add the `.md` suffix to any documentation URLs to get a raw markdown content. For example, https://microsoft.github.io/genaiscript/guides/prompt-as-code.md (note the .md extension)

## Contributing

We accept contributions! Checkout the [CONTRIBUTING](./CONTRIBUTING.md) page for details and developer setup.

---

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
