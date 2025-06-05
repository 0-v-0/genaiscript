---
title: "Securing GenAIScript Scripts: Auth, Secrets & Safe Access"
date: 2025-06-05
authors: genaiscript
tags:
  - security
  - genaiscript
  - authentication
  - secrets management
  - best practices
  - tutorial
draft: true

---

# "Securing GenAIScript Scripts: Auth, Secrets & Safe Access"

Keeping GenAIScript scripts **safe and secure** is crucial, especially when automating tasks that may expose sensitive data or access external APIs. In this post, we'll walk through a fully annotated script that demonstrates **authentication**, **secrets management**, and **safe access patterns**—all three pillars of script security. Each line is explained for clarity, so you can confidently secure your own GenAIScript projects.

---

## 🏗️ Script Overview

Here's the script we'll break down:

```js
script({
    title: "Securing GenAIScript: Auth, Secrets & Safe Access",
    description: "Demonstrates authentication, secrets management, and safe access patterns in GenAIScript.",
    secrets: ["TAVILY_API_KEY", "MY_SERVICE_TOKEN"],
    env: ["SAFE_USER"],
    params: {
        user: { type: "string", description: "The user requesting access." },
        query: { type: "string", description: "A search query for Tavily." }
    }
})

// --- Authentication ---
function checkUser(user) {
    const safeUser = env.SAFE_USER || "admin";
    if (user !== safeUser) {
        throw new Error(`Unauthorized user: ${user}`);
    }
}

// --- Secrets Management ---
async function tavilySearch(query) {
    if (!env.secrets.TAVILY_API_KEY) throw new Error("Missing Tavily API Key");
    const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api_key": env.secrets.TAVILY_API_KEY
        },
        body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error("Search failed");
    return await res.json();
}

// --- Safe Access Pattern Example ---
async function safeServiceCall() {
    // Only allow if a valid token is present
    const token = env.secrets.MY_SERVICE_TOKEN;
    if (!token) throw new Error("Service token missing");
    // Example safe API call
    const resp = await fetch("https://api.example.com/protected", {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) throw new Error("Protected API call failed");
    return await resp.json();
}

// --- Main Logic ---
const { user, query } = params;
checkUser(user);

const searchResult = await tavilySearch(query);
const protectedData = await safeServiceCall();

$`User ${user} performed a secure search for "${query}".\n\nTavily Search Result: ${JSON.stringify(searchResult)}\n\nProtected Data: ${JSON.stringify(protectedData)}\n\nAll sensitive access was performed using secrets and authentication checks.`
```

---

## 📝 Breaking Down the Script, Line by Line

Let's walk through each section and line to understand how the script implements robust security.

### 1. Script Metadata & Declarations

```js
script({
    title: "Securing GenAIScript: Auth, Secrets & Safe Access",
    description: "Demonstrates authentication, secrets management, and safe access patterns in GenAIScript.",
    secrets: ["TAVILY_API_KEY", "MY_SERVICE_TOKEN"],
    env: ["SAFE_USER"],
    params: {
        user: { type: "string", description: "The user requesting access." },
        query: { type: "string", description: "A search query for Tavily." }
    }
})
```

- **`script({ ... })`**  
  Defines a GenAIScript module. The object sets key metadata.

    - **`title`**   
      Human-friendly script title—useful for documentation and discoverability.
    - **`description`**  
      Brief explanation of what the script does.
    - **`secrets`**  
      List of secret names the script expects. Here, `"TAVILY_API_KEY"` and `"MY_SERVICE_TOKEN"` let the script securely consume sensitive tokens!  
      Learn more about [secrets in the documentation](https://microsoft.github.io/genaiscript/docs/reference/script/#secrets).
    - **`env`**  
      Environment variables that the script can read.  
      - `"SAFE_USER"` defines the only authorized user.
    - **`params`**  
      Runtime arguments the script accepts.  
      - `user`: Who is running this script?
      - `query`: The search string for Tavily.

---

### 2. Authentication Logic

```js
function checkUser(user) {
    const safeUser = env.SAFE_USER || "admin";
    if (user !== safeUser) {
        throw new Error(`Unauthorized user: ${user}`);
    }
}
```

- **Purpose:** Only allow access for a trusted user.
- **How it works:**  
  1. **Grabs the allowed user** from an environment variable, or defaults to `"admin"`.
  2. **Checks the input `user`**. If they don’t match, the script immediately throws an error, halting execution.  
  👉 Restricting access by user is a common security practice.

---

### 3. Safe Secrets Management

```js
async function tavilySearch(query) {
    if (!env.secrets.TAVILY_API_KEY) throw new Error("Missing Tavily API Key");
    const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api_key": env.secrets.TAVILY_API_KEY
        },
        body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error("Search failed");
    return await res.json();
}
```

- **Purpose:** Call out to the Tavily API using a protected API key.
- **Line by line:**
    - **Check for secret:** `env.secrets.TAVILY_API_KEY` must be set; otherwise, the script fails fast.
    - **Make POST request:**  
      - Sends the search `query` in the request body.
      - Sets content type and passes API key as a header.
    - **Handle errors:** If the request fails, the error is raised clearly.
    - **Return JSON:** Returns the parsed results to the caller.

🗝️ Notice how the API key is **never hardcoded**; it's injected from `secrets`—one of GenAIScript's best practices!

---

### 4. Safe Access Pattern with Protected Tokens

```js
async function safeServiceCall() {
    // Only allow if a valid token is present
    const token = env.secrets.MY_SERVICE_TOKEN;
    if (!token) throw new Error("Service token missing");
    // Example safe API call
    const resp = await fetch("https://api.example.com/protected", {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) throw new Error("Protected API call failed");
    return await resp.json();
}
```

- **Purpose:** Demonstrates a common pattern for secure API access using bearer tokens.
- **Key steps:**
    - **Check token presence.**
    - **Attach token as an Authorization header.**
    - **Error out if the secret or the response is invalid.**
    - **Return parsed response.**

This approach **reduces the risk of leaking or misusing sensitive access tokens**.

---

### 5. Main Flow: Enforcing Security

```js
const { user, query } = params;
checkUser(user);

const searchResult = await tavilySearch(query);
const protectedData = await safeServiceCall();
```

- **Destructure and validate parameters.**
- **Run security checks early.**  
  🔒 The user is checked **before** any secret access or remote call occurs.
- **Obtain search results and protected data**—all with safe, authenticated access.

---

### 6. Final Output

```js
$`User ${user} performed a secure search for "${query}".\n\nTavily Search Result: ${JSON.stringify(searchResult)}\n\nProtected Data: ${JSON.stringify(protectedData)}\n\nAll sensitive access was performed using secrets and authentication checks.`
```

- **Dynamic Output:**  
  Uses JavaScript interpolation in a template string to construct a summary.
- **Transparency:**  
  It’s clear what was searched for and what data was accessed, which can assist with auditing or debugging.

---

## 🔚 Conclusion

By following these patterns—**declaring secrets, checking user authentication, and safely using sensitive tokens**—you make your GenAIScript scripts much more secure 🦺. Whether you’re calling third-party APIs or managing internal automation, these are practices you should always include.

Want to dig deeper? Explore the [GenAIScript documentation](https://microsoft.github.io/genaiscript/) or check out example scripts in [packages/sample/src/](https://github.com/microsoft/genaiscript/tree/main/packages/sample/src) for more idioms and advanced security workflows!

---

Happy scripting, and keep it secure! 🔐