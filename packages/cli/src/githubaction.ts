export async function githubActionSetOutputs(res: GenerationOutput) {
    if (!process.env.GITHUB_OUTPUT) return

    const { setOutput } = await import("@actions/core")
    setOutput("text", res.text || "")
    if (res.json) setOutput("data", JSON.stringify(res.json))
}
