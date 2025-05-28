---
title: '"From Idea to Automation: Interactive User Input and Custom Prompt Flows
  in GenAIScript"'
date: 2025-05-28
authors: genaiscript
tags:
  - genaiscript
  - user input
  - automation
  - prompt engineering
  - scripting
draft: true

---

# "From Idea to Automation: Interactive User Input and Custom Prompt Flows in GenAIScript"

Giving automation scripts the ability to gather user input at runtime creates flexible, responsive, and delightful user experiences. In this guide, we’ll walk through a practical GenAIScript that demonstrates how to construct customizable prompt flows that adapt based on user choices. By the end, you’ll know how to write scripts that ask questions, branch logic, and generate AI prompts—all in response to your user's needs.

Let’s break down the script line by line, highlighting the 'why' and 'how' for each step. 🚀

---

## Full Script Overview

```javascript
// GenAIScript: Interactive User Input and Custom Prompt Flows
// This script demonstrates soliciting user input, branching, and dynamic prompt generation

async function main() {
    // Step 1: Greet the user and ask for their automation goal
    const userGoal = await input.text({
        label: "What would you like to automate today?",
        placeholder: "e.g., summarize a document, generate a report, refactor code..."
    });

    // Step 2: Offer a choice of automation type
    const automationType = await input.choice({
        label: "Select the type of automation flow:",
        choices: [
            { label: "Single-step (one prompt)", value: "single" },
            { label: "Multi-step (guided flow)", value: "multi" },
            { label: "Not sure (recommend for me)", value: "recommend" }
        ]
    });

    let prompt;
    let recommendation;
    if (automationType === "recommend") {
        // Step 3a: Recommend a flow based on the user's goal
        prompt = `The user wants to automate: ${userGoal}.\nSuggest whether a single-step or multi-step automation is better and why.`;
        recommendation = await ai.prompt(prompt);
        output.print("Recommendation: " + recommendation.trim());
    }

    // Step 4: Adapt prompt flow based on user input
    if (automationType === "single" || (automationType === "recommend" && recommendation && recommendation.includes("single"))) {
        // Single-step: ask for details and run one prompt
        const details = await input.text({
            label: "Provide any details or context for your automation:",
            placeholder: "Paste relevant text or describe your input..."
        });
        prompt = `Task: ${userGoal}\nDetails: ${details}\nPlease perform this automation in a single step.`;
        const result = await ai.prompt(prompt);
        output.print("Automation Result:\n" + result.trim());
    } else {
        // Multi-step: guided flow example
        output.print("Let's break down your automation into steps.");
        const step1 = await input.text({
            label: "Step 1: Describe the first part of your automation:",
            placeholder: "e.g., extract main ideas from text, select files, etc."
        });
        const step2 = await input.text({
            label: "Step 2: Describe the next part:",
            placeholder: "e.g., summarize, transform, analyze, etc."
        });
        prompt = `Task: ${userGoal}\nStep 1: ${step1}\nStep 2: ${step2}\nGuide the user through this automation, providing output for each step.`;
        const result = await ai.prompt(prompt);
        output.print("Multi-step Automation Result:\n" + result.trim());
    }
}

main();
```

---

## Line-by-Line Walkthrough

### 1. Script Entry Point

```javascript
async function main() {
```
Every GenAIScript script begins execution from a top-level function, often called `main`. Marking it `async` allows us to use `await` to handle user prompts and AI calls asynchronously.

---

### 2. Ask for the User's Goal

```javascript
const userGoal = await input.text({
    label: "What would you like to automate today?",
    placeholder: "e.g., summarize a document, generate a report, refactor code..."
});
```
- `input.text`: Prompts for free-form text ([docs](https://microsoft.github.io/genaiscript/reference/apis/input/#text)).
- `label`: Appears as the prompt to guide the user.
- `placeholder`: A hint showing possible answers.

This line invites the user to share their automation goal, letting the script adapt to unique workflows.

---

### 3. Offer an Automation Type Choice

```javascript
const automationType = await input.choice({
    label: "Select the type of automation flow:",
    choices: [
        { label: "Single-step (one prompt)", value: "single" },
        { label: "Multi-step (guided flow)", value: "multi" },
        { label: "Not sure (recommend for me)", value: "recommend" }
    ]
});
```
- `input.choice`: Lets users pick from a list ([docs](https://microsoft.github.io/genaiscript/reference/apis/input/#choice)).
- Each `choice` provides a `label` (user-facing) and a `value` (used in branching logic).

This key interaction is your branch point: does the user want a quick automation, a guided multi-step process, or a recommendation?

---

### 4. Handle the "Recommend" Path

```javascript
let prompt;
let recommendation;
if (automationType === "recommend") {
    prompt = `The user wants to automate: ${userGoal}.\nSuggest whether a single-step or multi-step automation is better and why.`;
    recommendation = await ai.prompt(prompt);
    output.print("Recommendation: " + recommendation.trim());
}
```
- If the user isn't sure, construct a prompt for the AI to suggest the best flow.
- `ai.prompt`: Send a dynamically constructed prompt to the AI model ([docs](https://microsoft.github.io/genaiscript/reference/apis/ai/#prompt)).
- `output.print`: Display AI suggestions to the user ([docs](https://microsoft.github.io/genaiscript/reference/apis/output/#print)).

This approach harnesses AI to provide personalized guidance!

---

### 5. Launch the Single-Step Flow

```javascript
if (automationType === "single" || (automationType === "recommend" && recommendation && recommendation.includes("single"))) {
    const details = await input.text({
        label: "Provide any details or context for your automation:",
        placeholder: "Paste relevant text or describe your input..."
    });
    prompt = `Task: ${userGoal}\nDetails: ${details}\nPlease perform this automation in a single step.`;
    const result = await ai.prompt(prompt);
    output.print("Automation Result:\n" + result.trim());
}
```
- If the user chose single-step, or the AI recommended it, gather more context.
- Generate a prompt tailored to this task and context.
- Submit to the AI and print the result.

This shows how to create highly responsive, adaptive single-turn flows from user input.

---

### 6. Run a Multi-Step, Guided Automation Flow

```javascript
else {
    output.print("Let's break down your automation into steps.");
    const step1 = await input.text({
        label: "Step 1: Describe the first part of your automation:",
        placeholder: "e.g., extract main ideas from text, select files, etc."
    });
    const step2 = await input.text({
        label: "Step 2: Describe the next part:",
        placeholder: "e.g., summarize, transform, analyze, etc."
    });
    prompt = `Task: ${userGoal}\nStep 1: ${step1}\nStep 2: ${step2}\nGuide the user through this automation, providing output for each step.`;
    const result = await ai.prompt(prompt);
    output.print("Multi-step Automation Result:\n" + result.trim());
}
```
- For the multi-step path, guide the user through individual parts of their process, collecting input at each stage.
- Build a rich, structured prompt using these step descriptions.
- Ask the AI to process and guide through all provided steps.

This section models how to break tasks down for the AI and generate a more nuanced automation flow.

---

### 7. Script Execution

```javascript
main();
```
- Trigger the `main` function to start; in GenAIScript, no need to import or run anything else!

---

## Best Practices & Patterns

- **Prompt Dynamically:** Use user responses to shape AI prompts (`Task: ${userGoal}`), making outcomes tailored and meaningful.
- **Use Choices for Branching:** Present choices for clear, guided flows (single vs. multi-step).
- **Leverage AI for Guidance:** When in doubt, let AI recommend the best way forward.
- **Keep Asking:** For complex automations, gather multiple pieces of info in sequence.

For more details and API reference, see the [official GenAIScript documentation](https://microsoft.github.io/genaiscript/).

---

## ✨ Summary

Interactive input and custom prompt flows turn static scripts into powerful, user-responsive automation tools. By mixing `input.text`, `input.choice`, and dynamic AI calls, you can craft scripts that feel conversational, adapt to any scenario, and deliver rich automation experiences—entirely from the command line.

Happy scripting! 💡🤖