import debug from "debug"
const runnerDbg = debug("genaiscript:promptrunner")

// Import necessary modules and functions for handling chat sessions, templates, file management, etc.
import { executeChatSession, tracePromptResult } from "./chat"
import { GenerationStatus, Project } from "./server/messages"
import { arrayify, assert, relativePath } from "./util"
import { runtimeHost } from "./host"
import { MarkdownTrace } from "./trace"
import { CORE_VERSION } from "./version"
import { expandFiles } from "./fs"
import { dataToMarkdownTable } from "./csv"
import { Fragment, GenerationOptions } from "./generation"
import { traceCliArgs } from "./clihelp"
import { GenerationResult } from "./server/messages"
import { resolveModelConnectionInfo } from "./models"
import { RequestError, errorMessage } from "./error"
import { renderFencedVariables } from "./fence"
import { parsePromptParameters } from "./vars"
import { resolveFileContent } from "./file"
import { expandTemplate } from "./expander"
import { resolveLanguageModel } from "./lm"
import { checkCancelled } from "./cancellation"
import { lastAssistantReasoning } from "./chatrender"
import { unthink } from "./think"
import { deleteUndefinedValues } from "./cleaners"
import { DEBUG_SCRIPT_CATEGORY } from "./constants"

// Asynchronously resolve expansion variables needed for a template
/**
 * Resolves variables required for the expansion of a template.
 * @param project The project context.
 * @param trace The markdown trace for logging.
 * @param template The prompt script template.
 * @param fragment The fragment containing files and metadata.
 * @param vars The user-provided variables.
 * @returns An object containing resolved variables.
 */
async function resolveExpansionVars(
    project: Project,
    trace: MarkdownTrace,
    template: PromptScript,
    fragment: Fragment,
    output: OutputTrace,
    options: GenerationOptions
): Promise<ExpansionVariables> {
    const { vars, runDir, runId } = options
    const root = runtimeHost.projectFolder()

    assert(!!vars)
    assert(!!runDir)
    assert(!!runId)

    const files: WorkspaceFile[] = []
    const templateFiles = arrayify(template.files)
    const referenceFiles = fragment.files.slice(0)
    const workspaceFiles = fragment.workspaceFiles?.slice(0) || []
    const filenames = await expandFiles(
        referenceFiles.length || workspaceFiles.length
            ? referenceFiles
            : templateFiles,
        {
            applyGitIgnore: false,
            accept: template.accept,
        }
    )
    for (let filename of filenames) {
        filename = relativePath(root, filename)

        // Skip if file already in the list
        if (files.find((lk) => lk.filename === filename)) continue
        const file: WorkspaceFile = { filename }
        await resolveFileContent(file)
        files.push(file)
    }

    for (const wf of workspaceFiles) {
        if (!files.find((f) => f.filename === wf.filename)) {
            await resolveFileContent(wf)
            files.push(wf)
        }
    }

    // Parse and obtain attributes from prompt parameters
    const attrs = parsePromptParameters(project, template, vars)
    const secrets: Record<string, string> = {}

    // Read secrets defined in the template
    for (const secret of template.secrets || []) {
        const value = await runtimeHost.readSecret(secret)
        if (value) {
            trace.item(`secret \`${secret}\` used`)
            secrets[secret] = value
        } else trace.error(`secret \`${secret}\` not found`)
    }

    // Create and return an object containing resolved variables
    const meta: PromptDefinition & ModelConnectionOptions = structuredClone({
        id: template.id,
        title: template.title,
        description: template.description,
        group: template.group,
        model: template.model,
        defTools: template.defTools,
    }) // frozen later
    const res = {
        dir: ".",
        files,
        meta,
        vars: attrs,
        secrets,
        output,
        generator: undefined as ChatGenerationContext,
        runDir,
        runId,
        dbg: debug(DEBUG_SCRIPT_CATEGORY),
    } satisfies ExpansionVariables
    return res
}

// Main function to run a template with given options
/**
 * Executes a prompt template with specified options.
 *
 * @param prj The project context providing runtime and configuration.
 * @param template The prompt script template to execute.
 * @param fragment Additional context such as files, workspace files, and metadata.
 * @param options Configuration for generation, including model, trace, output trace, cancellation token, stats, and other generation parameters.
 * @returns A generation result containing execution details, outputs, and potential errors, including status, messages, edits, annotations, file changes, and usage statistics.
 */
export async function runTemplate(
    prj: Project,
    template: PromptScript,
    fragment: Fragment,
    options: GenerationOptions
): Promise<GenerationResult> {
    assert(fragment !== undefined)
    assert(options !== undefined)
    assert(options.trace !== undefined)
    assert(options.outputTrace !== undefined)
    const {
        label,
        cliInfo,
        trace,
        outputTrace,
        cancellationToken,
        model,
        runId,
    } = options
    const version = CORE_VERSION
    assert(model !== undefined)

    runtimeHost.project = prj

    try {
        if (cliInfo) {
            trace.heading(3, `🤖 ${template.id}`)
            traceCliArgs(trace, template, options)
        }

        // Resolve expansion variables for the template
        const env = await resolveExpansionVars(
            prj,
            trace,
            template,
            fragment,
            outputTrace,
            options
        )
        let {
            messages,
            schemas,
            tools,
            fileMerges,
            outputProcessors,
            chatParticipants,
            fileOutputs,
            prediction,
            status,
            statusText,
            temperature,
            reasoningEffort,
            topP,
            maxTokens,
            fallbackTools,
            seed,
            responseType,
            responseSchema,
            logprobs,
            topLogprobs,
            disposables,
            cache,
            metadata,
        } = await expandTemplate(prj, template, options, env)
        const { output, generator, secrets, dbg: envDbg, ...restEnv } = env

        runnerDbg(`messages ${messages.length}`)

        // Handle failed expansion scenario
        if (status !== "success" || !messages.length) {
            trace.renderErrors()
            return {
                status: status as GenerationStatus,
                statusText,
                messages,
                env: restEnv,
                label,
                version,
                text: unthink(outputTrace.content),
                reasoning: lastAssistantReasoning(messages),
                edits: [],
                annotations: [],
                changelogs: [],
                fileEdits: {},
                fences: [],
                frames: [],
                schemas: {},
                usage: undefined,
                runId,
            } satisfies GenerationResult
        }

        // Resolve model connection information
        const connection = await resolveModelConnectionInfo(
            { model },
            { trace, token: true }
        )
        if (connection.info.error)
            throw new Error(errorMessage(connection.info.error))
        if (!connection.configuration)
            throw new RequestError(
                403,
                `LLM configuration missing for model ${model}`,
                connection.info
            )
        checkCancelled(cancellationToken)
        const { ok } = await runtimeHost.pullModel(
            connection.configuration,
            options
        )
        if (!ok) {
            trace.renderErrors()
            return deleteUndefinedValues({
                status: "error",
                statusText: "",
                messages,
                env: restEnv,
                label,
                version,
                text: unthink(outputTrace.content),
                reasoning: lastAssistantReasoning(messages),
                edits: [],
                annotations: [],
                changelogs: [],
                fileEdits: {},
                fences: [],
                frames: [],
                schemas: {},
                usage: undefined,
                runId,
            } satisfies GenerationResult)
        }

        const { completer } = await resolveLanguageModel(
            connection.configuration.provider
        )

        // Execute chat session with the resolved configuration
        const runStats = options.stats.createChild(connection.info.model)
        const genOptions: GenerationOptions = {
            ...options,
            cache,
            choices: template.choices,
            responseType,
            responseSchema,
            model,
            temperature,
            reasoningEffort,
            maxTokens,
            topP,
            seed,
            logprobs,
            topLogprobs,
            fallbackTools,
            metadata,
            stats: runStats,
        }
        const chatResult = await executeChatSession(
            connection.configuration,
            cancellationToken,
            messages,
            tools,
            schemas,
            fileOutputs,
            outputProcessors,
            fileMerges,
            prediction,
            completer,
            chatParticipants,
            disposables,
            genOptions
        )
        tracePromptResult(trace, chatResult)

        const {
            json,
            fences,
            frames,
            error,
            finishReason,
            fileEdits,
            changelogs,
            edits,
        } = chatResult
        let { annotations } = chatResult

        // Reporting and tracing output
        if (fences?.length)
            trace.details("📩 code regions", renderFencedVariables(fences))
        if (fileEdits && Object.keys(fileEdits).length) {
            trace.startDetails("📝 file edits")
            for (const [f, e] of Object.entries(fileEdits))
                trace.detailsFenced(f, e.after)
            trace.endDetails()
        }
        if (annotations?.length)
            trace.details(
                "⚠️ annotations",
                dataToMarkdownTable(
                    annotations.map((a) => ({
                        ...a,
                        line: a.range?.[0]?.[0],
                        endLine: a.range?.[1]?.[0] ?? "",
                        code: a.code ?? "",
                    })),
                    {
                        headers: [
                            "severity",
                            "filename",
                            "line",
                            "endLine",
                            "code",
                            "message",
                        ],
                    }
                )
            )

        trace.renderErrors()
        const res: GenerationResult = {
            status:
                finishReason === "cancel"
                    ? "cancelled"
                    : error
                      ? "error"
                      : finishReason === "stop"
                        ? "success"
                        : "error",
            finishReason,
            error,
            messages,
            env: restEnv,
            edits,
            annotations,
            changelogs,
            fileEdits,
            text: unthink(outputTrace.content),
            reasoning: lastAssistantReasoning(messages),
            version,
            fences,
            frames,
            schemas,
            json,
            choices: chatResult.choices,
            logprobs: chatResult.logprobs,
            perplexity: chatResult.perplexity,
            uncertainty: chatResult.uncertainty,
            usage: chatResult.usage,
            runId,
        }

        // If there's an error, provide status text
        if (res.status === "error" && !res.statusText && res.finishReason) {
            res.statusText = `LLM finish reason: ${res.finishReason}`
        }
        return res
    } finally {
        // Cleanup any resources like running containers or browsers
        runtimeHost.userState = {}
        await runtimeHost.removeContainers()
        await runtimeHost.removeBrowsers()
    }
}
