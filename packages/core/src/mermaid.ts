import { genaiscriptDebug } from "./debug"
import { installWindow } from "./dom"
import { errorMessage } from "./error"
import type { Mermaid } from "mermaid"
const dbg = genaiscriptDebug("mermaid")

let _mermaid: Promise<Mermaid>
async function importMermaid() {
    if (_mermaid) return _mermaid

    await installWindow()
    dbg(`importing`)
    const mermaid = (await import("mermaid")).default
    mermaid.initialize({ startOnLoad: false })
    return mermaid
}

export async function mermaidParse(
    text: string
): Promise<{ diagramType?: string; error?: string }> {
    const mermaid = await importMermaid()
    try {
        dbg(`parsing %s`, text)
        const res = await mermaid.parse(text, { suppressErrors: false })
        if (!res) return { error: "no result" }
        dbg(`parsed diagram type: %s`, res.diagramType)
        return { diagramType: res.diagramType }
    } catch (e) {
        dbg(e)
        const m = errorMessage(e)
        return { error: m }
    }
}
