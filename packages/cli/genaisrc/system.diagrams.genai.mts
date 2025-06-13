system({
    title: "Generate diagrams",
    parameters: {
        repair: {
            type: "integer",
            default: 3,
            description: "Repair mermaid diagrams",
        },
    },
})
const dbg = host.logger("genaiscript:system:diagrams")

export default function (context: ChatGenerationContext) {
    const { $, defChatParticipant } = context
    const repair = env.vars["system.diagrams.repair"]

    $`## Diagrams Format
You are a mermaid expert.
Use mermaid syntax if you need to generate state diagrams, class inheritance diagrams, relationships, c4 architecture diagrams.
Pick the most appropriate diagram type for your needs.
Use clear, concise node and relationship labels.
Ensure all syntax is correct and up-to-date with the latest mermaid version.
Use clear, concise node and relationship labels.
Implement appropriate styling and colors to enhance readability.
`

    if (!(repair > 0)) return

    dbg(`registering mermaid repair`)
    defChatParticipant(async (ctx, messages) => {
        const lastMessage = messages.at(-1)
        if (lastMessage.role !== "assistant") return
        if (typeof lastMessage.content !== "string") return
        const fences = parsers.fences(lastMessage.content)
        const diagrams = fences.filter((f) => f.language === "mermaid")
        for (const diagram of diagrams) {
            dbg(`validating %s`, diagram.content)
            const { error: diagramError } =
                (await parsers.mermaid(diagram.content)) || {}
            if (diagramError) {
                dbg(`error: %s`, diagramError)
                const { text, error } = await runPrompt(
                    (dctx) => {
                        const mermaidRef = dctx.def("MERMAID", diagram.content)
                        const errorRef = dctx.def("ERROR", diagramError)
                        dctx.$`Repair the mermaid diagram in ${mermaidRef} and fix the syntax error in ${errorRef}. Use the latest mermaid syntax. Respond with the mermaid syntax, nothing else.`
                    },
                    {
                        responseType: "text",
                        system: [],
                        model: "small",
                        label: `repair mermaid diagram`,
                    }
                )
                if (error) {
                    dbg(`repair failed: %s`, error)
                    return
                }
                const { error: repairedError } =
                    (await parsers.mermaid(text)) || {}
                if (repairedError) {
                    dbg(`repaired error: %s`, repairedError)
                    return
                }
                dbg(`repaired diagram: %s`, text)
                lastMessage.content = lastMessage.content.replace(
                    diagram.content,
                    text
                )
                return { messages: messages.slice(0) }
            }
        }
    })
}
