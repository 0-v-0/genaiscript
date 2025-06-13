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
    const { $, defChatParticipant, runPrompt } = context
    const repair = env.vars["system.diagrams.repair"]

    $`## Diagrams Format
You are a mermaid expert (v11.6.0).
Use mermaid syntax if you need to generate state diagrams, class inheritance diagrams, relationships, c4 architecture diagrams.
Pick the most appropriate diagram type for your needs.
Use clear, concise node and relationship labels.
Ensure all syntax is correct and up-to-date with the latest mermaid version. Validate the syntax 3 times before returning.
If you encounter any syntax errors, repair the diagram using the latest mermaid syntax.
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
        let repairs = 0
        for (const diagram of diagrams) {
            const content = diagram.content
            dbg(`validating %s`, content)
            for (let retry = 0; retry < 3; ++retry) {
                const { error: diagramError } =
                    (await parsers.mermaid(diagram.content)) || {}
                if (!diagramError) break
                const { text, error } = await runPrompt(
                    (dctx) => {
                        const mermaidRef = dctx.def(
                            "MERMAID",
                            diagram.content,
                            { lineNumbers: true }
                        )
                        const errorRef = dctx.def("ERROR", diagramError)
                        dctx.$`Repair the mermaid diagram in ${mermaidRef} and fix the syntax error in ${errorRef}. 
                        Use the latest mermaid syntax. Respond with the mermaid syntax, nothing else.`.role(
                            "system"
                        )
                    },
                    {
                        responseType: "text",
                        system: [],
                        model: "small",
                        label: `repair mermaid diagram (#${retry})`,
                    }
                )
                if (error) {
                    dbg(`repair failed: %s`, error)
                    break
                }
                diagram.content = parsers.unfence(text, "mermaid")
            }
            lastMessage.content = lastMessage.content.replace(
                content,
                diagram.content
            )
        }
        // if (repairs > 0) return { messages: messages.slice(0) }
        // return undefined
    })
}
