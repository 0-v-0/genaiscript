---
title: '"Harnessing GenAIScript for Automated Data Extraction and Transformation
  Pipelines"'
date: 2025-06-15
authors: genaiscript
draft: true
tags:
  - automation
  - data processing
  - genaiscript
  - prompt engineering
  - scripting

---

# "Harnessing GenAIScript for Automated Data Extraction and Transformation Pipelines"

Automating the journey from raw data to actionable insights is crucial for analytics, reporting, and dataset preparation. With GenAIScript, you can orchestrate advanced pipelines that extract, clean, enrich, and summarize data from almost any source—all with code that is readable, modifiable, and prompt-driven. In this guide, we’ll walk through a robust script for this challenge, demystifying every line so you can confidently design and adapt your own pipelines!

---

## 🗂️ The Big Picture

We'll break down a GenAIScript pipeline that:

1. **Extracts** data from CSV, JSON, APIs, or web pages
2. **Transforms and cleans** the data using AI-powered prompts
3. **Enriches** data with external sources or model context
4. **Summarizes** and saves the result for analytics

Along the way, you’ll learn how each scripting element works—no magic, just clear, well-documented steps!

---

## 🚦 Step-by-Step: Script Overview

Let’s look at the script structure, then delve into each section line by line.

```javascript
script({
  description: "Automate extraction, transformation, and summarization of data from various sources (CSV, JSON, API, Web) into analytics-ready output.",
  steps: [
    // Steps go here...
  ]
})
```

- `script({ ... })`: Defines the GenAIScript pipeline.  
- `description`: Human-readable summary for discoverability and documentation.  
- `steps`: The heart of the workflow—a list where each object is a named function run sequentially.

---

## 1️⃣ Extract Data

This step fetches structured or semi-structured data from different sources. GenAIScript offers ambient access to file, fetch, and AI helpers.

```javascript
{
  name: "Extract Data",
  description: "Extract structured or semi-structured data from source.",
  input: {
    sourceType: { type: "string", description: "Type of data source: csv, json, api, web" },
    sourcePath: { type: "string", description: "Path, URL, or identifier for the data source" }
  },
  async run({ sourceType, sourcePath }) {
    if (sourceType === "csv") {
      const csv = await host.readFile(sourcePath)
      const rows = await ai.extract(csv, "Extract CSV rows as array of objects")
      return { rows }
    } else if (sourceType === "json") {
      const json = await host.readFile(sourcePath)
      const rows = JSON.parse(json)
      return { rows }
    } else if (sourceType === "api") {
      const data = await ai.fetch(sourcePath, { method: "GET" })
      return { rows: data }
    } else if (sourceType === "web") {
      const html = await ai.fetch(sourcePath, { method: "GET", responseType: "text" })
      const rows = await ai.extract(html, "Extract tabular or list data as array of objects from HTML")
      return { rows }
    } else {
      throw new Error("Unsupported source type")
    }
  }
}
```

### Line-by-line

- `name`, `description`: Used for clarity and developer experience.
- `input`: Declares the parameters required at execution (`sourceType` and `sourcePath`).
- `async run(...)`: The runnable logic for this step.
  - **CSV source:**  
    - `host.readFile(sourcePath)`: Reads the CSV as text.  
    - `ai.extract(csv, ...)`: LLM-driven parsing to array of objects ([docs](https://microsoft.github.io/genaiscript/docs/ai-api#extract)).
  - **JSON source:**  
    - Reads then parses JSON directly—no model needed!
  - **API source:**  
    - `ai.fetch(sourcePath, { method: "GET" })`: Fetches and parses data from an API ([docs](https://microsoft.github.io/genaiscript/docs/ai-api#fetch)).
  - **Web page source:**  
    - Fetches HTML, then extracts tabular/list data using the LLM.
  - Throws an error if an unsupported type is given.

---

## 2️⃣ Clean and Transform Data

Once data is loaded, this step lets you reshape, standardize, or filter it—using a natural-language prompt to describe your desired transformation.

```javascript
{
  name: "Clean and Transform Data",
  description: "Clean, normalize, and transform the extracted data.",
  input: {
    rows: { type: "array", description: "Extracted data rows" },
    transformationPrompt: { type: "string", description: "Prompt describing how to clean or transform the data" }
  },
  async run({ rows, transformationPrompt }) {
    const transformed = await ai.transform(rows, transformationPrompt)
    return { rows: transformed }
  }
}
```

### Line-by-line

- `rows`: The previously extracted data.
- `transformationPrompt`: A natural-language prompt, e.g.,  
  `"Standardize date formats and remove incomplete entries."`
- `ai.transform(rows, transformationPrompt)`: GenAIScript LLM call to process and return the transformed array ([docs](https://microsoft.github.io/genaiscript/docs/ai-api#transform)).

---

## 3️⃣ Enrich Data (Optional)

You may want to add extra information or derive new values; this step does so using similar prompt-driven enrichments.

```javascript
{
  name: "Enrich Data",
  description: "Enrich data using external APIs or LLM context.",
  input: {
    rows: { type: "array", description: "Data rows to enrich" },
    enrichmentPrompt: { type: "string", description: "Prompt describing enrichment (e.g., lookup, augment, classify)" }
  },
  async run({ rows, enrichmentPrompt }) {
    const enriched = await ai.transform(rows, enrichmentPrompt)
    return { rows: enriched }
  }
}
```

### Line-by-line

- Accepts rows and an enrichment prompt, such as:
  - `"Add latitude and longitude for each address."`
  - `"Categorize each entry into predefined classes."`
- Reuses `ai.transform` to inject new intelligence contextually, inspired by your prompt.

---

## 4️⃣ Summarize and Output

Before handing data off for analytics, summarize or aggregate as needed—and optionally save it to disk.

```javascript
{
  name: "Summarize and Output",
  description: "Summarize, aggregate, or output the final dataset.",
  input: {
    rows: { type: "array", description: "Final data rows to summarize or output" },
    summaryPrompt: { type: "string", description: "Prompt describing how to summarize or aggregate the data" },
    outputPath: { type: "string", description: "Where to save the output (optional)" }
  },
  async run({ rows, summaryPrompt, outputPath }) {
    const summary = await ai.summarize(rows, summaryPrompt)
    if (outputPath) {
      await host.writeFile(outputPath, JSON.stringify(summary, null, 2))
    }
    return { summary }
  }
}
```

### Line-by-line

- `rows`, `summaryPrompt`, `outputPath`: Input and output parameters.
- `ai.summarize(rows, summaryPrompt)`: LLM-driven summarization/aggregation ([docs](https://microsoft.github.io/genaiscript/docs/ai-api#summarize)).
- If an `outputPath` is provided, the output (JSON) is written to the specified file.

---

## 👀 Full Example: GenAIScript End-to-End

Here’s the full script as described above—copy, modify, and expand it for your own automation scenarios!

```javascript
script({
  description: "Automate extraction, transformation, and summarization of data from various sources (CSV, JSON, API, Web) into analytics-ready output.",
  steps: [
    {
      name: "Extract Data",
      description: "Extract structured or semi-structured data from source.",
      input: {
        sourceType: { type: "string", description: "Type of data source: csv, json, api, web" },
        sourcePath: { type: "string", description: "Path, URL, or identifier for the data source" }
      },
      async run({ sourceType, sourcePath }) {
        if (sourceType === "csv") {
          const csv = await host.readFile(sourcePath)
          const rows = await ai.extract(csv, "Extract CSV rows as array of objects")
          return { rows }
        } else if (sourceType === "json") {
          const json = await host.readFile(sourcePath)
          const rows = JSON.parse(json)
          return { rows }
        } else if (sourceType === "api") {
          const data = await ai.fetch(sourcePath, { method: "GET" })
          return { rows: data }
        } else if (sourceType === "web") {
          const html = await ai.fetch(sourcePath, { method: "GET", responseType: "text" })
          const rows = await ai.extract(html, "Extract tabular or list data as array of objects from HTML")
          return { rows }
        } else {
          throw new Error("Unsupported source type")
        }
      }
    },
    {
      name: "Clean and Transform Data",
      description: "Clean, normalize, and transform the extracted data.",
      input: {
        rows: { type: "array", description: "Extracted data rows" },
        transformationPrompt: { type: "string", description: "Prompt describing how to clean or transform the data" }
      },
      async run({ rows, transformationPrompt }) {
        const transformed = await ai.transform(rows, transformationPrompt)
        return { rows: transformed }
      }
    },
    {
      name: "Enrich Data",
      description: "Enrich data using external APIs or LLM context.",
      input: {
        rows: { type: "array", description: "Data rows to enrich" },
        enrichmentPrompt: { type: "string", description: "Prompt describing enrichment (e.g., lookup, augment, classify)" }
      },
      async run({ rows, enrichmentPrompt }) {
        const enriched = await ai.transform(rows, enrichmentPrompt)
        return { rows: enriched }
      }
    },
    {
      name: "Summarize and Output",
      description: "Summarize, aggregate, or output the final dataset.",
      input: {
        rows: { type: "array", description: "Final data rows to summarize or output" },
        summaryPrompt: { type: "string", description: "Prompt describing how to summarize or aggregate the data" },
        outputPath: { type: "string", description: "Where to save the output (optional)" }
      },
      async run({ rows, summaryPrompt, outputPath }) {
        const summary = await ai.summarize(rows, summaryPrompt)
        if (outputPath) {
          await host.writeFile(outputPath, JSON.stringify(summary, null, 2))
        }
        return { summary }
      }
    }
  ]
})
```

---

## 💡 Tips for Advanced Pipelines

- **Prompt engineering is key:** Your transformation, enrichment, and summarization steps are only as effective as their prompts. Be specific!
- **Chain steps as needed:** Add more steps before or after—filter, merge, or visualize!
- **Integrate with anything:** Use `host.readFile`, `ai.fetch`, or new tools for creative, cross-system workflows.
- **Error handling:** Consider catching and reporting errors at each stage for resilience.

---

## 📝 Learn More

- [GenAIScript Documentation](https://microsoft.github.io/genaiscript/)
- [Sample Scripts Gallery](https://microsoft.github.io/genaiscript/docs/blog/)
- [AI API Reference](https://microsoft.github.io/genaiscript/docs/ai-api)

With prompt-driven pipelines, GenAIScript makes advanced data wrangling accessible and scalable—automate smarter, not harder! 🚀