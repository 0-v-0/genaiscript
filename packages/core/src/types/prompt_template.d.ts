/**
 * GenAIScript Ambient Type Definition File
 * @version 0.0.0
 */
type OptionsOrString<TOptions extends string> = (string & {}) | TOptions

type ElementOrArray<T> = T | T[]

interface PromptGenerationConsole {
    log(...data: any[]): void
    warn(...data: any[]): void
    debug(...data: any[]): void
    error(...data: any[]): void
}

type DiagnosticSeverity = "error" | "warning" | "info"

interface Diagnostic {
    filename: string
    range: CharRange
    severity: DiagnosticSeverity
    message: string
    /**
     * suggested fix
     */
    suggestion?: string
    /**
     * error or warning code
     */
    code?: string
}

type Awaitable<T> = T | PromiseLike<T>

interface SerializedError {
    name?: string
    message?: string
    stack?: string
    cause?: unknown
    code?: string
    line?: number
    column?: number
}

interface PromptDefinition {
    /**
     * Based on file name.
     */
    id: string

    /**
     * Something like "Summarize children", show in UI.
     */
    title?: string

    /**
     * Longer description of the prompt. Shows in UI grayed-out.
     */
    description?: string

    /**
     * Groups template in UI
     */
    group?: string

    /**
     * List of tools defined in the script
     */
    defTools?: { id: string; description: string; kind: "tool" | "agent" }[]
}

interface PromptLike extends PromptDefinition {
    /**
     * File where the prompt comes from (if any).
     */
    filename?: string

    /**
     * The actual text of the prompt template.
     * Only used for system prompts.
     */
    text?: string

    /**
     * The text of the prompt JS source code.
     */
    jsSource?: string

    /**
     * Resolved system ids
     */
    resolvedSystem?: SystemPromptInstance[]

    /**
     * Inferred input schema for parameters
     */
    inputSchema?: JSONSchemaObject
}

type SystemPromptId = OptionsOrString<string>

type SystemPromptInstance = {
    id: SystemPromptId
    parameters?: Record<string, string | boolean | number | object | any>
    vars?: Record<string, string | boolean | number | object | any>
}

type SystemToolId = OptionsOrString<string>

type FileMergeHandler = (
    filename: string,
    label: string,
    before: string,
    generated: string
) => Awaitable<string>

interface PromptOutputProcessorResult {
    /**
     * Updated text
     */
    text?: string
    /**
     * Generated files from the output
     */
    files?: Record<string, string>

    /**
     * User defined errors
     */
    annotations?: Diagnostic[]
}

type PromptOutputProcessorHandler = (
    output: GenerationOutput
) =>
    | PromptOutputProcessorResult
    | Promise<PromptOutputProcessorResult>
    | undefined
    | Promise<undefined>
    | void
    | Promise<void>

type PromptTemplateResponseType =
    | "text"
    | "json"
    | "yaml"
    | "markdown"
    | "json_object"
    | "json_schema"
    | undefined

type ModelType = OptionsOrString<
    | "large"
    | "small"
    | "tiny"
    | "long"
    | "vision"
    | "vision_small"
    | "reasoning"
    | "reasoning_small"
    | "openai:gpt-4.1"
    | "openai:gpt-4.1-mini"
    | "openai:gpt-4.1-nano"
    | "openai:gpt-4o"
    | "openai:gpt-4o-mini"
    | "openai:gpt-3.5-turbo"
    | "openai:o3-mini"
    | "openai:o3-mini:low"
    | "openai:o3-mini:medium"
    | "openai:o3-mini:high"
    | "openai:o1"
    | "openai:o1-mini"
    | "openai:o1-preview"
    | "github:openai/gpt-4.1"
    | "github:openai/gpt-4o"
    | "github:openai/gpt-4o-mini"
    | "github:openai/o1"
    | "github:openai/o1-mini"
    | "github:openai/o3-mini"
    | "github:openai/o3-mini:low"
    | "github:microsoft/mai-ds-r1"
    | "github:deepseek/deepseek-v3"
    | "github:deepseek/deepseek-r1"
    | "github:microsoft/phi-4"
    | "github_copilot_chat:current"
    | "github_copilot_chat:gpt-3.5-turbo"
    | "github_copilot_chat:gpt-4o-mini"
    | "github_copilot_chat:gpt-4o-2024-11-20"
    | "github_copilot_chat:gpt-4"
    | "github_copilot_chat:o1"
    | "github_copilot_chat:o1:low"
    | "github_copilot_chat:o1:medium"
    | "github_copilot_chat:o1:high"
    | "github_copilot_chat:o3-mini"
    | "github_copilot_chat:o3-mini:low"
    | "github_copilot_chat:o3-mini:medium"
    | "github_copilot_chat:o3-mini:high"
    | "azure:gpt-4o"
    | "azure:gpt-4o-mini"
    | "azure:o1"
    | "azure:o1-mini"
    | "azure:o1-preview"
    | "azure:o3-mini"
    | "azure:o3-mini:low"
    | "azure:o3-mini:medium"
    | "azure:o3-mini:high"
    | "azure_ai_inference:gpt-4.1"
    | "azure_ai_inference:gpt-4o"
    | "azure_ai_inference:gpt-4o-mini"
    | "azure_ai_inference:o1"
    | "azure_ai_inference:o1-mini"
    | "azure_ai_inference:o1-preview"
    | "azure_ai_inference:o3-mini"
    | "azure_ai_inference:o3-mini:low"
    | "azure_ai_inference:o3-mini:medium"
    | "azure_ai_inference:o3-mini:high"
    | "azure_ai_inference:deepSeek-v3"
    | "azure_ai_inference:deepseek-r1"
    | "ollama:gemma3:4b"
    | "ollama:marco-o1"
    | "ollama:tulu3"
    | "ollama:athene-v2"
    | "ollama:opencoder"
    | "ollama:qwen2.5-coder"
    | "ollama:llama3.2-vision"
    | "ollama:llama3.2"
    | "ollama:phi4"
    | "ollama:phi3.5"
    | "ollama:deepseek-r1:1.5b"
    | "ollama:deepseek-r1:7b"
    | "ollama:olmo2:7b"
    | "ollama:command-r7b:7b"
    | "anthropic:claude-3-7-sonnet-latest"
    | "anthropic:claude-3-7-sonnet-latest:low"
    | "anthropic:claude-3-7-sonnet-latest:medium"
    | "anthropic:claude-3-7-sonnet-latest:high"
    | "anthropic:claude-3-7-sonnet-20250219"
    | "anthropic:claude-3-5-sonnet-latest"
    | "anthropic:claude-3-5-sonnet-20240620"
    | "anthropic:claude-3-opus-20240229"
    | "anthropic:claude-3-sonnet-20240229"
    | "anthropic:claude-3-haiku-20240307"
    | "anthropic:claude-2.1"
    | "anthropic_bedrock:anthropic.claude-3-7-sonnet-20250219-v1:0"
    | "anthropic_bedrock:anthropic.claude-3-7-sonnet-20250219-v1:0:low"
    | "anthropic_bedrock:anthropic.claude-3-7-sonnet-20250219-v1:0:medium"
    | "anthropic_bedrock:anthropic.claude-3-7-sonnet-20250219-v1:0:high"
    | "anthropic_bedrock:anthropic.claude-3-5-haiku-20241022-v1:0"
    | "anthropic_bedrock:anthropic.claude-3-5-sonnet-20241022-v2:0"
    | "anthropic_bedrock:anthropic.claude-3-5-sonnet-20240620-v1:0"
    | "anthropic_bedrock:anthropic.claude-3-opus-20240229-v1:0"
    | "anthropic_bedrock:anthropic.claude-3-sonnet-20240229-v1:0"
    | "anthropic_bedrock:anthropic.claude-3-haiku-20240307-v1:0"
    | "huggingface:microsoft/Phi-3-mini-4k-instruct"
    | "jan:llama3.2-3b-instruct"
    | "google:gemini-2.0-flash-exp"
    | "google:gemini-2.0-flash-thinking-exp-1219"
    | "google:gemini-1.5-flash"
    | "google:gemini-1.5-flash-latest"
    | "google:gemini-1.5-flash-8b"
    | "google:gemini-1.5-flash-8b-latest"
    | "google:gemini-1.5-pro"
    | "google:gemini-1.5-pro-latest"
    | "mistral:mistral-large-latest"
    | "mistral:mistral-small-latest"
    | "mistral:pixtral-large-latest"
    | "mistral:codestral-latest"
    | "mistral:nemo"
    | "alibaba:qwen-turbo"
    | "alibaba:qwen-max"
    | "alibaba:qwen-plus"
    | "alibaba:qwen2-72b-instruct"
    | "alibaba:qwen2-57b-a14b-instruct"
    | "deepseek:deepseek-chat"
    //    | "transformers:onnx-community/Qwen2.5-0.5B-Instruct:q4"
    //    | "transformers:HuggingFaceTB/SmolLM2-1.7B-Instruct:q4f16"
    | "llamafile"
    | "sglang"
    | "vllm"
    | "echo"
    | "none"
>

type EmbeddingsModelType = OptionsOrString<
    | "openai:text-embedding-3-small"
    | "openai:text-embedding-3-large"
    | "openai:text-embedding-ada-002"
    | "github:text-embedding-3-small"
    | "github:text-embedding-3-large"
    | "azure:text-embedding-3-small"
    | "azure:text-embedding-3-large"
    | "azure_ai_inference:text-embedding-3-small"
    | "azure_ai_inference:text-embedding-3-large"
    | "ollama:nomic-embed-text"
    | "google:text-embedding-004"
    | "huggingface:nomic-ai/nomic-embed-text-v1.5"
>

type ModelSmallType = OptionsOrString<
    | "openai:gpt-4o-mini"
    | "github:openai/gpt-4o-mini"
    | "azure:gpt-4o-mini"
    | "github:microsoft/phi-4"
>

type ModelVisionType = OptionsOrString<
    | "openai:gpt-4o"
    | "github:openai/gpt-4o"
    | "azure:gpt-4o"
    | "azure:gpt-4o-mini"
>

type ModelImageGenerationType = OptionsOrString<
    "openai:gpt-image-1" | "openai:dall-e-2" | "openai:dall-e-3"
>

type ModelProviderType = OptionsOrString<
    | "openai"
    | "azure"
    | "azure_serverless"
    | "azure_serverless_models"
    | "anthropic"
    | "anthropic_bedrock"
    | "google"
    | "huggingface"
    | "mistral"
    | "alibaba"
    | "github"
    | "transformers"
    | "ollama"
    | "lmstudio"
    | "jan"
    | "sglang"
    | "vllm"
    | "llamafile"
    | "litellm"
    | "github_copilot_chat"
    | "deepseek"
    | "whisperasr"
    | "echo"
>

interface ModelConnectionOptions {
    /**
     * Which LLM model by default or for the `large` alias.
     */
    model?: ModelType
}

interface ModelAliasesOptions extends ModelConnectionOptions {
    /**
     * Configure the `small` model alias.
     */
    smallModel?: ModelSmallType

    /**
     * Configure the `vision` model alias.
     */
    visionModel?: ModelVisionType

    /**
     * A list of model aliases to use.
     */
    modelAliases?: Record<string, string>
}

type ReasoningEffortType = "high" | "medium" | "low"

type ChatToolChoice =
    | "none"
    | "auto"
    | "required"
    | {
          /**
           * The name of the function to call.
           */
          name: string
      }

interface ModelOptions
    extends ModelConnectionOptions,
        ModelTemplateOptions,
        CacheOptions {
    /**
     * Temperature to use. Higher temperature means more hallucination/creativity.
     * Range 0.0-2.0.
     *
     * @default 0.2
     */
    temperature?: number

    /**
     * Enables fallback tools mode
     */
    fallbackTools?: boolean

    /**
     * OpenAI o* reasoning models support a reasoning effort parameter.
     * For Clause, these are mapped to thinking budget tokens
     */
    reasoningEffort?: ReasoningEffortType

    /**
     * A list of keywords that should be found in the output.
     */
    choices?: ElementOrArray<
        string | { token: string | number; weight?: number }
    >

    /**
     * Returns the log probabilities of the each tokens. Not supported in all models.
     */
    logprobs?: boolean

    /**
     * Number of alternate token logprobs to generate, up to 5. Enables logprobs.
     */
    topLogprobs?: number

    /**
     * Specifies the type of output. Default is plain text.
     * - `text` enables plain text mode (through system prompts)
     * - `json` enables JSON mode (through system prompts)
     * - `yaml` enables YAML mode (through system prompts)
     * - `json_object` enables JSON mode (native)
     * - `json_schema` enables structured outputs (native)
     * Use `responseSchema` to specify an output schema.
     */
    responseType?: PromptTemplateResponseType

    /**
     * JSON object schema for the output. Enables the `json_object` output mode by default.
     */
    responseSchema?: PromptParametersSchema | JSONSchema

    /**
     * “Top_p” or nucleus sampling is a setting that decides how many possible words to consider.
     * A high “top_p” value means the model looks at more possible words, even the less likely ones,
     * which makes the generated text more diverse.
     */
    topP?: number

    /**
     * Maximum number of completion tokens
     *
     */
    maxTokens?: number

    /**
     * Tool selection strategy. Default is 'auto'.
     */
    toolChoice?: ChatToolChoice

    /**
     * Maximum number of tool calls to make.
     */
    maxToolCalls?: number

    /**
     * Maximum number of data repairs to attempt.
     */
    maxDataRepairs?: number

    /**
     * A deterministic integer seed to use for the model.
     */
    seed?: number

    /**
     * A list of model ids and their maximum number of concurrent requests.
     */
    modelConcurrency?: Record<string, number>
}

interface EmbeddingsModelOptions {
    /**
     * LLM model to use for embeddings.
     */
    embeddingsModel?: EmbeddingsModelType
}

interface PromptSystemOptions extends PromptSystemSafetyOptions {
    /**
     * List of system script ids used by the prompt.
     */
    system?: ElementOrArray<SystemPromptId | SystemPromptInstance>

    /**
     * List of tools used by the prompt.
     */
    tools?: ElementOrArray<SystemToolId>

    /**
     * List of system to exclude from the prompt.
     */
    excludedSystem?: ElementOrArray<SystemPromptId>

    /**
     * MCP server configuration. The tools will be injected into the prompt.
     */
    mcpServers?: McpServersConfig

    /**
     * MCP agent configuration. Each mcp server will be wrapped with an agent.
     */
    mcpAgentServers?: McpAgentServersConfig
}

interface ScriptRuntimeOptions extends LineNumberingOptions {
    /**
     * Secrets required by the prompt
     */
    secrets?: string[]
}

type PromptJSONParameterType<T> = T & { required?: boolean }

type PromptParameterType =
    | string
    | number
    | boolean
    | object
    | PromptJSONParameterType<JSONSchemaNumber>
    | PromptJSONParameterType<JSONSchemaString>
    | PromptJSONParameterType<JSONSchemaBoolean>
type PromptParametersSchema = Record<
    string,
    PromptParameterType | [PromptParameterType]
>
type PromptParameters = Record<string, string | number | boolean | object>

type PromptAssertion = {
    // How heavily to weigh the assertion. Defaults to 1.0
    weight?: number
    /**
     * The transformation to apply to the output before checking the assertion.
     */
    transform?: string
} & (
    | {
          // type of assertion
          type:
              | "icontains"
              | "not-icontains"
              | "equals"
              | "not-equals"
              | "starts-with"
              | "not-starts-with"
          // The expected value
          value: string
      }
    | {
          // type of assertion
          type:
              | "contains-all"
              | "not-contains-all"
              | "contains-any"
              | "not-contains-any"
              | "icontains-all"
              | "not-icontains-all"
          // The expected values
          value: string[]
      }
    | {
          // type of assertion
          type: "levenshtein" | "not-levenshtein"
          // The expected value
          value: string
          // The threshold value
          threshold?: number
      }
    | {
          type: "javascript"
          /**
           * JavaScript expression to evaluate.
           */
          value: string
          /**
           * Optional threshold if the javascript expression returns a number
           */
          threshold?: number
      }
)

interface PromptTest {
    /**
     * Short name of the test
     */
    name?: string
    /**
     * Description of the test.
     */
    description?: string
    /**
     * List of files to apply the test to.
     */
    files?: ElementOrArray<string>
    /**
     * List of in-memory files to apply the test to.
     */
    workspaceFiles?: ElementOrArray<WorkspaceFile>
    /**
     * Extra set of variables for this scenario
     */
    vars?: Record<string, string | boolean | number>
    /**
     * LLM output matches a given rubric, using a Language Model to grade output.
     */
    rubrics?: ElementOrArray<string>
    /**
     * LLM output adheres to the given facts, using Factuality method from OpenAI evaluation.
     */
    facts?: ElementOrArray<string>
    /**
     * List of keywords that should be contained in the LLM output.
     */
    keywords?: ElementOrArray<string>
    /**
     * List of keywords that should not be contained in the LLM output.
     */
    forbidden?: ElementOrArray<string>
    /**
     * Additional deterministic assertions.
     */
    asserts?: ElementOrArray<PromptAssertion>

    /**
     * Determines what kind of output is sent back to the test engine. Default is "text".
     */
    format?: "text" | "json"
}

/**
 * Configure promptfoo redteam plugins
 */
interface PromptRedteam {
    /**
     * The `purpose` property is used to guide the attack generation process. It should be as clear and specific as possible.
     * Include the following information:
     * - Who the user is and their relationship to the company
     * - What data the user has access to
     * - What data the user does not have access to
     * - What actions the user can perform
     * - What actions the user cannot perform
     * - What systems the agent has access to
     * @link https://www.promptfoo.dev/docs/red-team/troubleshooting/attack-generation/
     */
    purpose: string

    /**
     * Redteam identifier used for reporting purposes
     */
    label?: string

    /**
     * Default number of inputs to generate for each plugin.
     * The total number of tests will be `(numTests * plugins.length * (1 + strategies.length) * languages.length)`
     * Languages.length is 1 by default, but is added when the multilingual strategy is used.
     */
    numTests?: number

    /**
     * List of languages to target. Default is English.
     */
    language?: string

    /**
     * Red team plugin list
     * @link https://www.promptfoo.dev/docs/red-team/owasp-llm-top-10/
     */
    plugins?: ElementOrArray<
        OptionsOrString<
            | "default"
            | "nist:ai:measure"
            | "owasp:llm"
            | "owasp:api"
            | "mitre:atlas"
            | "owasp:llm:01"
            | "owasp:llm:02"
            | "owasp:llm:04"
            | "owasp:llm:06"
            | "owasp:llm:09"
            | "contracts"
            | "divergent-repetition"
            | "excessive-agency"
            | "hallucination"
            | "harmful:chemical-biological-weapons"
            | "harmful:child-exploitation"
            | "harmful:copyright-violations"
            | "harmful:cybercrime"
            | "harmful:cybercrime:malicious-code"
            | "harmful:graphic-content"
            | "harmful:harassment-bullying"
            | "harmful:hate"
            | "harmful:illegal-activities"
            | "harmful:illegal-drugs"
            | "harmful:illegal-drugs:meth"
            | "harmful:indiscriminate-weapons"
            | "harmful:insults"
            | "harmful:intellectual-property"
            | "harmful:misinformation-disinformation"
            | "harmful:non-violent-crime"
            | "harmful:privacy"
            | "harmful:profanity"
            | "harmful:radicalization"
            | "harmful:self-harm"
            | "harmful:sex-crime"
            | "harmful:sexual-content"
            | "harmful:specialized-advice"
            | "harmful:unsafe-practices"
            | "harmful:violent-crime"
            | "harmful:weapons:ied"
            | "hijacking"
            | "pii:api-db"
            | "pii:direct"
            | "pii:session"
            | "pii:social"
            | "politics"
        >
    >

    /**
     * Adversary prompt generation strategies
     */
    strategies?: ElementOrArray<
        OptionsOrString<
            | "default"
            | "basic"
            | "jailbreak"
            | "jailbreak:composite"
            | "base64"
            | "jailbreak"
            | "prompt-injection"
        >
    >
}

/**
 * Different ways to render a fence block.
 */
type FenceFormat = "markdown" | "xml" | "none"

interface FenceFormatOptions {
    /**
     * Formatting of code sections
     */
    fenceFormat?: FenceFormat
}

interface ModelTemplateOptions extends FenceFormatOptions {
    /**
     * Budget of tokens to apply the prompt flex renderer.
     */
    flexTokens?: number
}

interface McpToolAnnotations {
    /**
     * Annotations for MCP tools
     * @link https://modelcontextprotocol.io/docs/concepts/tools#available-tool-annotations
     */
    annotations?: {
        /**
         * If true, indicates the tool does not modify its environment
         */
        readOnlyHint?: boolean
        /**
         * If true, the tool may perform destructive updates (only meaningful when readOnlyHint is false)
         */
        destructiveHint?: boolean
        /**
         * If true, calling the tool repeatedly with the same arguments has no additional effect (only meaningful when readOnlyHint is false)
         */
        idempotentHint?: boolean
        /**
         * If true, the tool may interact with an “open world” of external entities
         */
        openWorldHint?: boolean
    }
}

interface MetadataOptions {
    /**
     * Set of 16 key-value pairs that can be attached to an object.
     * This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.
     * Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.
     */
    metadata?: Record<string, string>
}

interface PromptScript
    extends PromptLike,
        ModelOptions,
        ModelAliasesOptions,
        PromptSystemOptions,
        EmbeddingsModelOptions,
        ContentSafetyOptions,
        SecretDetectionOptions,
        GitIgnoreFilterOptions,
        ScriptRuntimeOptions,
        McpToolAnnotations,
        MetadataOptions {
    /**
     * Which provider to prefer when picking a model.
     */
    provider?: ModelProviderType

    /**
     * Additional template parameters that will populate `env.vars`
     */
    parameters?: PromptParametersSchema

    /**
     * A file path or list of file paths or globs.
     * The content of these files will be by the files selected in the UI by the user or the cli arguments.
     */
    files?: ElementOrArray<string>

    /**
     * A comma separated list of file extensions to accept.
     */
    accept?: OptionsOrString<".md,.mdx" | "none">

    /**
     * Extra variable values that can be used to configure system prompts.
     */
    vars?: Record<string, string>

    /**
     * Tests to validate this script.
     */
    tests?: ElementOrArray<string | PromptTest>

    /**
     * Models to use with tests
     */
    testModels?: ElementOrArray<ModelType | ModelAliasesOptions>

    /**
     * LLM vulnerability checks
     */
    redteam?: PromptRedteam

    /**
     * Don't show it to the user in lists. Template `system.*` are automatically unlisted.
     */
    unlisted?: boolean

    /**
     * Set if this is a system prompt.
     */
    isSystem?: boolean
}
/**
 * Represent a workspace file and optional content.
 */
interface WorkspaceFile {
    /**
     * Name of the file, relative to project root.
     */
    filename: string

    /**
     * Content mime-type if known
     */
    type?: string

    /**
     * Encoding of the content
     */
    encoding?: "base64"

    /**
     * Content of the file.
     */
    content?: string

    /**
     * Size in bytes if known
     */
    size?: number
}

interface WorkspaceFileWithScore extends WorkspaceFile {
    /**
     * Score allocated by search algorithm
     */
    score?: number
}

interface ToolDefinition {
    /**
     * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
     * underscores and dashes, with a maximum length of 64.
     */
    name: string

    /**
     * A description of what the function does, used by the model to choose when and
     * how to call the function.
     */
    description?: string

    /**
     * The parameters the functions accepts, described as a JSON Schema object. See the
     * [guide](https://platform.openai.com/docs/guides/text-generation/function-calling)
     * for examples, and the
     * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
     * documentation about the format.
     *
     * Omitting `parameters` defines a function with an empty parameter list.
     */
    parameters?: JSONSchema
}

/**
 * Interface representing an output trace with various logging and tracing methods.
 * Extends the `ToolCallTrace` interface.
 */
interface OutputTrace extends ToolCallTrace {
    /**
     * Logs a heading message at the specified level.
     * @param level - The level of the heading.
     * @param message - The heading message.
     */
    heading(level: number, message: string): void

    /**
     * Logs an image with an optional caption.
     * @param url - The URL of the image.
     * @param caption - The optional caption for the image.
     */
    image(url: BufferLike, caption?: string): Promise<void>

    /**
     * Logs a markdown table
     * @param rows
     */
    table(rows: object[]): void

    /**
     * Computes and renders diff between two files.
     */
    diff(
        left: string | WorkspaceFile,
        right: string | WorkspaceFile,
        options?: { context?: number }
    ): void

    /**
     * Logs a result item with a boolean value and a message.
     * @param value - The boolean value of the result item.
     * @param message - The message for the result item.
     */
    resultItem(value: boolean, message: string): void

    /**
     * Starts a trace with details in markdown format.
     * @param title - The title of the trace.
     * @param options - Optional settings for the trace.
     * @returns A `MarkdownTrace` instance.
     */
    startTraceDetails(
        title: string,
        options?: { expanded?: boolean }
    ): OutputTrace

    /**
     * Appends content to the trace.
     * @param value - The content to append.
     */
    appendContent(value: string): void

    /**
     * Starts a details section in the trace.
     * @param title - The title of the details section.
     * @param options - Optional settings for the details section.
     */
    startDetails(
        title: string,
        options?: { success?: boolean; expanded?: boolean }
    ): void

    /**
     * Ends the current details section in the trace.
     */
    endDetails(): void

    /**
     * Logs a video with a name, file path, and optional alt text.
     * @param name - The name of the video.
     * @param filepath - The file path of the video.
     * @param alt - The optional alt text for the video.
     */
    video(name: string, filepath: string, alt?: string): void

    /**
     * Logs an audio file
     * @param name
     * @param filepath
     * @param alt
     */
    audio(name: string, filepath: string, alt?: string): void

    /**
     * Logs a details section with a title and body.
     * @param title - The title of the details section.
     * @param body - The body content of the details section, can be a string or an object.
     * @param options - Optional settings for the details section.
     */
    details(
        title: string,
        body: string | object,
        options?: { success?: boolean; expanded?: boolean }
    ): void

    /**
     * Logs a fenced details section with a title, body, and optional content type.
     * @param title - The title of the details section.
     * @param body - The body content of the details section, can be a string or an object.
     * @param contentType - The optional content type of the body.
     * @param options - Optional settings for the details section.
     */
    detailsFenced(
        title: string,
        body: string | object,
        contentType?: string,
        options?: { expanded?: boolean }
    ): void

    /**
     * Logs an item with a name, value, and optional unit.
     * @param name - The name of the item.
     * @param value - The value of the item.
     * @param unit - The optional unit of the value.
     */
    itemValue(name: string, value: any, unit?: string): void

    /**
     * Adds a url link item
     * @param name name url
     * @param url url. If missing, name is treated as the url.
     */
    itemLink(name: string, url?: string | URL, title?: string): void

    /**
     * Writes a paragraph of text with empty lines before and after.
     * @param text paragraph to write
     */
    p(text: string): void

    /**
     * Logs a warning message.
     * @param msg - The warning message to log.
     */
    warn(msg: string): void

    /**
     * Logs a caution message.
     * @param msg - The caution message to log.
     */
    caution(msg: string): void

    /**
     * Logs a note message.
     * @param msg - The note message to log.
     */
    note(msg: string): void

    /**
     * Logs an error object
     * @param err
     */
    error(message: string, error?: unknown): void
}

/**
 * Interface representing a tool call trace for logging various types of messages.
 */
interface ToolCallTrace {
    /**
     * Logs a general message.
     * @param message - The message to log.
     */
    log(message: string): void

    /**
     * Logs an item message.
     * @param message - The item message to log.
     */
    item(message: string): void

    /**
     * Logs a tip message.
     * @param message - The tip message to log.
     */
    tip(message: string): void

    /**
     * Logs a fenced message, optionally specifying the content type.
     * @param message - The fenced message to log.
     * @param contentType - The optional content type of the message.
     */
    fence(message: string | unknown, contentType?: string): void
}

/**
 * Position (line, character) in a file. Both are 0-based.
 */
type CharPosition = [number, number]

/**
 * Describes a run of text.
 */
type CharRange = [CharPosition, CharPosition]

/**
 * 0-based line numbers.
 */
type LineRange = [number, number]

interface FileEdit {
    type: string
    filename: string
    label?: string
    validated?: boolean
}

interface ReplaceEdit extends FileEdit {
    type: "replace"
    range: CharRange | LineRange
    text: string
}

interface InsertEdit extends FileEdit {
    type: "insert"
    pos: CharPosition | number
    text: string
}

interface DeleteEdit extends FileEdit {
    type: "delete"
    range: CharRange | LineRange
}

interface CreateFileEdit extends FileEdit {
    type: "createfile"
    overwrite?: boolean
    ignoreIfExists?: boolean
    text: string
}

type Edits = InsertEdit | ReplaceEdit | DeleteEdit | CreateFileEdit

interface ToolCallContent {
    type?: "content"
    content: string
    edits?: Edits[]
}

type ToolCallOutput =
    | string
    | number
    | boolean
    | ToolCallContent
    | ShellOutput
    | WorkspaceFile
    | RunPromptResult
    | SerializedError
    | undefined

interface WorkspaceFileCache<K, V> {
    /**
     * Name of the cache
     */
    name: string
    /**
     * Gets the value associated with the key, or undefined if there is none.
     * @param key
     */
    get(key: K): Promise<V | undefined>
    /**
     * Sets the value associated with the key.
     * @param key
     * @param value
     */
    set(key: K, value: V): Promise<void>

    /**
     * List the values in the cache.
     */
    values(): Promise<V[]>

    /**
     * Gets the sha of the key
     * @param key
     */
    getSha(key: K): Promise<string>

    /**
     * Gets an existing value or updates it with the updater function.
     */
    getOrUpdate(
        key: K,
        updater: () => Promise<V>,
        validator?: (val: V) => boolean
    ): Promise<{ key: string; value: V; cached?: boolean }>
}

interface WorkspaceGrepOptions extends FilterGitFilesOptions {
    /**
     * List of paths to
     */
    path?: ElementOrArray<string>
    /**
     * list of filename globs to search. !-prefixed globs are excluded. ** are not supported.
     */
    glob?: ElementOrArray<string>
    /**
     * Read file content. default is true.
     */
    readText?: boolean

    /**
     * Enable grep logging to discover what files are searched.
     */
    debug?: boolean
}

interface WorkspaceGrepResult {
    files: WorkspaceFile[]
    matches: WorkspaceFile[]
}

interface INIParseOptions extends JSONSchemaValidationOptions {
    defaultValue?: any
}

interface FilterGitFilesOptions {
    /**
     * Ignore workspace .gitignore instructions
     */
    applyGitIgnore?: false | undefined
}

interface FindFilesOptions extends FilterGitFilesOptions {
    /** Glob patterns to ignore */
    ignore?: ElementOrArray<string>

    /**
     * Set to false to skip read text content. True by default
     */
    readText?: boolean
}

interface FileStats {
    /**
     * Size of the file in bytes
     */
    size: number
    mode: number
}

interface JSONSchemaValidationOptions {
    schema?: JSONSchema
    throwOnValidationError?: boolean
}

interface WorkspaceFileSystem {
    /**
     * Searches for files using the glob pattern and returns a list of files.
     * Ignore `.env` files and apply `.gitignore` if present.
     * @param glob
     */
    findFiles(
        glob: ElementOrArray<string>,
        options?: FindFilesOptions
    ): Promise<WorkspaceFile[]>

    /**
     * Performs a grep search over the files in the workspace using ripgrep.
     * @param pattern A string to match or a regex pattern.
     * @param options Options for the grep search.
     */
    grep(
        pattern: string | RegExp,
        options?: WorkspaceGrepOptions
    ): Promise<WorkspaceGrepResult>
    grep(
        pattern: string | RegExp,
        glob: string,
        options?: Omit<WorkspaceGrepOptions, "path" | "glob">
    ): Promise<WorkspaceGrepResult>

    /**
     * Reads metadata information about the file. Returns undefined if the file does not exist.
     * @param filename
     */
    stat(filename: string): Promise<FileStats>

    /**
     * Reads the content of a file as text
     * @param path
     */
    readText(path: string | Awaitable<WorkspaceFile>): Promise<WorkspaceFile>

    /**
     * Reads the content of a file and parses to JSON, using the JSON5 parser.
     * @param path
     */
    readJSON(
        path: string | Awaitable<WorkspaceFile>,
        options?: JSONSchemaValidationOptions
    ): Promise<any>

    /**
     * Reads the content of a file and parses to YAML.
     * @param path
     */
    readYAML(
        path: string | Awaitable<WorkspaceFile>,
        options?: JSONSchemaValidationOptions
    ): Promise<any>

    /**
     * Reads the content of a file and parses to XML, using the XML parser.
     */
    readXML(
        path: string | Awaitable<WorkspaceFile>,
        options?: XMLParseOptions
    ): Promise<any>

    /**
     * Reads the content of a CSV file.
     * @param path
     */
    readCSV<T extends object>(
        path: string | Awaitable<WorkspaceFile>,
        options?: CSVParseOptions
    ): Promise<T[]>

    /**
     * Reads the content of a file and parses to INI
     */
    readINI(
        path: string | Awaitable<WorkspaceFile>,
        options?: INIParseOptions
    ): Promise<any>

    /**
     * Reads the content of a file and attempts to parse it as data.
     * @param path
     * @param options
     */
    readData(
        path: string | Awaitable<WorkspaceFile>,
        options?: CSVParseOptions &
            INIParseOptions &
            XMLParseOptions &
            JSONSchemaValidationOptions
    ): Promise<any>

    /**
     * Appends text to a file as text to the file system. Creates the file if needed.
     * @param path
     * @param content
     */
    appendText(path: string, content: string): Promise<void>

    /**
     * Writes a file as text to the file system
     * @param path
     * @param content
     */
    writeText(path: string, content: string): Promise<void>

    /**
     * Caches a buffer to file and returns the unique file name
     * @param bytes
     */
    writeCached(
        bytes: BufferLike,
        options?: {
            scope?: "workspace" | "run"
            /**
             * Filename extension
             */
            ext?: string
        }
    ): Promise<string>

    /**
     * Writes one or more files to the workspace
     * @param file a in-memory file or list of files
     */
    writeFiles(file: ElementOrArray<WorkspaceFile>): Promise<void>

    /**
     * Copies a file between two paths
     * @param source
     * @param destination
     */
    copyFile(source: string, destination: string): Promise<void>

    /**
     * Opens a file-backed key-value cache for the given cache name.
     * The cache is persisted across runs of the script. Entries are dropped when the cache grows too large.
     * @param cacheName
     */
    cache<K = any, V = any>(
        cacheName: string
    ): Promise<WorkspaceFileCache<K, V>>
}

interface ToolCallContext {
    log(message: string): void
    debug(message: string): void
    trace: ToolCallTrace
}

interface ToolCallback {
    spec: ToolDefinition
    options?: DefToolOptions
    generator?: ChatGenerationContext
    impl: (
        args: { context: ToolCallContext } & Record<string, any>
    ) => Awaitable<ToolCallOutput>
}

interface ChatContentPartText {
    /**
     * The text content.
     */
    text: string

    /**
     * The type of the content part.
     */
    type: "text"
}

interface ChatContentPartImage {
    image_url: {
        /**
         * Either a URL of the image or the base64 encoded image data.
         */
        url: string

        /**
         * Specifies the detail level of the image. Learn more in the
         * [Vision guide](https://platform.openai.com/docs/guides/vision#low-or-high-fidelity-image-understanding).
         */
        detail?: "auto" | "low" | "high"
    }

    /**
     * The type of the content part.
     */
    type: "image_url"
}

interface ChatContentPartInputAudio {
    input_audio: {
        /**
         * Base64 encoded audio data.
         */
        data: string

        /**
         * The format of the encoded audio data. Currently supports "wav" and "mp3".
         */
        format: "wav" | "mp3"
    }

    /**
     * The type of the content part. Always `input_audio`.
     */
    type: "input_audio"
}

interface ChatContentPartFile {
    file: {
        /**
         * The base64 encoded file data, used when passing the file to the model as a
         * string.
         */
        file_data?: string

        /**
         * The ID of an uploaded file to use as input.
         */
        file_id?: string

        /**
         * The name of the file, used when passing the file to the model as a string.
         */
        filename?: string
    }

    /**
     * The type of the content part. Always `file`.
     */
    type: "file"
}

interface ChatContentPartRefusal {
    /**
     * The refusal message generated by the model.
     */
    refusal: string

    /**
     * The type of the content part.
     */
    type: "refusal"
}

interface ChatSystemMessage {
    /**
     * The contents of the system message.
     */
    content: string | ChatContentPartText[]

    /**
     * The role of the messages author, in this case `system`.
     */
    role: "system"

    /**
     * An optional name for the participant. Provides the model information to
     * differentiate between participants of the same role.
     */
    name?: string
}

/**
 * @deprecated
 */
interface ChatFunctionMessage {
    content: string
    name: string
    role: "function"
}

interface ChatToolMessage {
    /**
     * The contents of the tool message.
     */
    content: string | ChatContentPartText[]

    /**
     * The role of the messages author, in this case `tool`.
     */
    role: "tool"

    /**
     * Tool call that this message is responding to.
     */
    tool_call_id: string
}

interface ChatMessageToolCall {
    /**
     * The ID of the tool call.
     */
    id: string

    /**
     * The function that the model called.
     */
    function: {
        /**
         * The arguments to call the function with, as generated by the model in JSON
         * format. Note that the model does not always generate valid JSON, and may
         * hallucinate parameters not defined by your function schema. Validate the
         * arguments in your code before calling your function.
         */
        arguments: string

        /**
         * The name of the function to call.
         */
        name: string
    }

    /**
     * The type of the tool. Currently, only `function` is supported.
     */
    type: "function"
}

interface ChatAssistantMessage {
    /**
     * The role of the messages author, in this case `assistant`.
     */
    role: "assistant"

    /**
     * The contents of the assistant message. Required unless `tool_calls` or
     * `function_call` is specified.
     */
    content?: string | (ChatContentPartText | ChatContentPartRefusal)[]

    /**
     * An optional name for the participant. Provides the model information to
     * differentiate between participants of the same role.
     */
    name?: string

    /**
     * The refusal message by the assistant.
     */
    refusal?: string | null

    /**
     * The tool calls generated by the model, such as function calls.
     */
    tool_calls?: ChatMessageToolCall[]

    /**
     * The reasoning of the model
     */
    reasoning?: string
}

type ChatContentPart =
    | ChatContentPartText
    | ChatContentPartImage
    | ChatContentPartInputAudio
    | ChatContentPartFile

interface ChatUserMessage {
    /**
     * The contents of the user message.
     */
    content: string | ChatContentPart[]

    /**
     * The role of the messages author, in this case `user`.
     */
    role: "user"

    /**
     * An optional name for the participant. Provides the model information to
     * differentiate between participants of the same role.
     */
    name?: string
}

type ChatMessage =
    | ChatSystemMessage
    | ChatUserMessage
    | ChatAssistantMessage
    | ChatToolMessage
    | ChatFunctionMessage

type ChatParticipantHandler = (
    /**
     * Prompt generation context to create a new message in the conversation
     */
    context: ChatTurnGenerationContext,
    /**
     * Chat conversation messages
     */
    messages: ChatMessage[],
    /**
     * The last assistant text, without
     * reasoning sections.
     */
    assistantText: string
) => Awaitable<{ messages?: ChatMessage[] } | undefined | void>

interface ChatParticipantOptions {
    label?: string
}

interface ChatParticipant {
    generator: ChatParticipantHandler
    options: ChatParticipantOptions
}

/**
 * A set of text extracted from the context of the prompt execution
 */
interface ExpansionVariables {
    /**
     * Directory where the prompt is executed
     */
    dir: string

    /**
     * Directory where output files (trace, output) are created
     */
    runDir: string

    /**
     * Unique identifier for the run
     */
    runId: string

    /**
     * List of linked files parsed in context
     */
    files: WorkspaceFile[]

    /**
     * User defined variables
     */
    vars: Record<string, string | boolean | number | object | any> & {
        /**
         * When running in GitHub Copilot Chat, the current user prompt
         */
        question?: string
        /**
         * When running in GitHub Copilot Chat, the current chat history
         */
        "copilot.history"?: (HistoryMessageUser | HistoryMessageAssistant)[]
        /**
         * When running in GitHub Copilot Chat, the current editor content
         */
        "copilot.editor"?: string
        /**
         * When running in GitHub Copilot Chat, the current selection
         */
        "copilot.selection"?: string
        /**
         * When running in GitHub Copilot Chat, the current terminal content
         */
        "copilot.terminalSelection"?: string
        /**
         * Selected model identifier in GitHub Copilot Chat
         */
        "copilot.model"?: string
        /**
         * selected text in active text editor
         */
        "editor.selectedText"?: string
    }

    /**
     * List of secrets used by the prompt, must be registered in `genaiscript`.
     */
    secrets: Record<string, string>

    /**
     * Root prompt generation context
     */
    generator: ChatGenerationContext

    /**
     * Output trace builder
     */
    output: OutputTrace

    /**
     * Resolved metadata
     */
    meta: PromptDefinition & ModelConnectionOptions

    /**
     * The script debugger logger
     */
    dbg: DebugLogger
}

type MakeOptional<T, P extends keyof T> = Partial<Pick<T, P>> & Omit<T, P>

type PromptArgs = Omit<
    PromptScript,
    "text" | "id" | "jsSource" | "defTools" | "resolvedSystem"
>

type PromptSystemArgs = Omit<
    PromptArgs,
    | "model"
    | "embeddingsModel"
    | "temperature"
    | "topP"
    | "maxTokens"
    | "seed"
    | "tests"
    | "responseLanguage"
    | "responseType"
    | "responseSchema"
    | "files"
    | "modelConcurrency"
    | "redteam"
    | "metadata"
>

type StringLike = string | WorkspaceFile | WorkspaceFile[]

interface LineNumberingOptions {
    /**
     * Prepend each line with a line numbers. Helps with generating diffs.
     */
    lineNumbers?: boolean
}

interface FenceOptions extends LineNumberingOptions, FenceFormatOptions {
    /**
     * Language of the fenced code block. Defaults to "markdown".
     */
    language?:
        | "markdown"
        | "json"
        | "yaml"
        | "javascript"
        | "typescript"
        | "python"
        | "shell"
        | "toml"
        | string

    /**
     * JSON schema identifier
     */
    schema?: string
}

type PromptCacheControlType = "ephemeral"

interface ContextExpansionOptions {
    /**
     * Specifies an maximum of estimated tokens for this entry; after which it will be truncated.
     */
    maxTokens?: number

    /*
     * Value that is conceptually similar to a zIndex (higher number == higher priority).
     * If a rendered prompt has more message tokens than can fit into the available context window, the prompt renderer prunes messages with the lowest priority from the ChatMessages result, preserving the order in which they were declared. This means your extension code can safely declare TSX components for potentially large pieces of context like conversation history and codebase context.
     */
    priority?: number

    /**
     * Controls the proportion of tokens allocated from the container's budget to this element.
     * It defaults to 1 on all elements.
     */
    flex?: number

    /**
     * Caching policy for this text. `ephemeral` means the prefix can be cached for a short amount of time.
     */
    cacheControl?: PromptCacheControlType
}

interface RangeOptions {
    /**
     * The inclusive start of the line range, with a 1-based index
     */
    lineStart?: number
    /**
     * The inclusive end of the line range, with a 1-based index
     */
    lineEnd?: number
}

interface GitIgnoreFilterOptions {
    /**
     * Disable filtering files based on the `.gitignore` file.
     */
    ignoreGitIgnore?: true | undefined
}

interface FileFilterOptions extends GitIgnoreFilterOptions {
    /**
     * Filename filter based on file suffix. Case insensitive.
     */
    endsWith?: ElementOrArray<string>

    /**
     * Filename filter using glob syntax.
     */
    glob?: ElementOrArray<string>
}

interface ContentSafetyOptions {
    /**
     * Configure the content safety provider.
     */
    contentSafety?: ContentSafetyProvider
    /**
     * Runs the default content safety validator
     * to prevent prompt injection.
     */
    detectPromptInjection?: "always" | "available" | boolean
}

interface PromptSystemSafetyOptions {
    /**
     * Policy to inject builtin system prompts. See to `false` prevent automatically injecting.
     */
    systemSafety?: "default" | boolean
}

interface SecretDetectionOptions {
    /**
     * Policy to disable secret scanning when communicating with the LLM.
     * Set to `false` to disable.
     */
    secretScanning?: boolean
}

interface DefOptions
    extends FenceOptions,
        ContextExpansionOptions,
        DataFilter,
        RangeOptions,
        FileFilterOptions,
        ContentSafetyOptions {
    /**
     * By default, throws an error if the value in def is empty.
     */
    ignoreEmpty?: boolean

    /**
     * The content of the def is a predicted output.
     * This setting disables line numbers.
     */
    prediction?: boolean
}

/**
 * Options for the `defDiff` command.
 */
interface DefDiffOptions
    extends ContextExpansionOptions,
        FenceFormatOptions,
        LineNumberingOptions {}

interface ImageTransformOptions {
    /**
     * Crops the image to the specified region.
     */
    crop?: { x?: number; y?: number; w?: number; h?: number }
    /**
     * Auto cropping same color on the edges of the image
     */
    autoCrop?: boolean
    /**
     * Applies a scaling factor to the image after cropping.
     */
    scale?: number
    /**
     * Rotates the image by the specified number of degrees.
     */
    rotate?: number
    /**
     * Maximum width of the image. Applied after rotation.
     */
    maxWidth?: number
    /**
     * Maximum height of the image. Applied after rotation.
     */
    maxHeight?: number
    /**
     * Removes colors from the image using ITU Rec 709 luminance values
     */
    greyscale?: boolean

    /**
     * Flips the image horizontally and/or vertically.
     */
    flip?: { horizontal?: boolean; vertical?: boolean }

    /**
     * Output mime
     */
    mime?: "image/jpeg" | "image/png"
}

interface DefImagesOptions extends ImageTransformOptions {
    /**
     * A "low" detail image is always downsampled to 512x512 pixels.
     */
    detail?: "high" | "low"
    /**
     * Selects the first N elements from the data
     */
    sliceHead?: number
    /**
     * Selects the last N elements from the data
     */
    sliceTail?: number
    /**
     * Selects the a random sample of N items in the collection.
     */
    sliceSample?: number
    /**
     * Renders all images in a single tiled image
     */
    tiled?: boolean

    /**
     * By default, throws an error if no images are passed.
     */
    ignoreEmpty?: boolean
}

type JSONSchemaTypeName =
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "object"
    | "array"
    | "null"

type JSONSchemaSimpleType =
    | JSONSchemaString
    | JSONSchemaNumber
    | JSONSchemaBoolean
    | JSONSchemaObject
    | JSONSchemaArray

type JSONSchemaType = JSONSchemaSimpleType | JSONSchemaAnyOf | null

interface JSONSchemaAnyOf {
    anyOf: JSONSchemaType[]
    uiGroup?: string
}

interface JSONSchemaDescribed {
    /**
     * A short description of the property
     */
    title?: string
    /**
     * A clear description of the property.
     */
    description?: string

    /**
     * Moves the field to a sub-group in the form, potentially collapsed
     */
    uiGroup?: string
}

interface JSONSchemaString extends JSONSchemaDescribed {
    type: "string"
    uiType?: "textarea"
    uiSuggestions?: string[]
    enum?: string[]
    default?: string
    pattern?: string
}

interface JSONSchemaNumber extends JSONSchemaDescribed {
    type: "number" | "integer"
    default?: number
    minimum?: number
    exclusiveMinimum?: number
    maximum?: number
    exclusiveMaximum?: number
}

interface JSONSchemaBoolean extends JSONSchemaDescribed {
    type: "boolean"
    uiType?: "runOption"
    default?: boolean
}

interface JSONSchemaObject extends JSONSchemaDescribed {
    $schema?: string
    type: "object"
    properties?: {
        [key: string]: JSONSchemaType
    }
    required?: string[]
    additionalProperties?: boolean

    default?: object
}

interface JSONSchemaArray extends JSONSchemaDescribed {
    $schema?: string
    type: "array"
    items?: JSONSchemaType

    default?: any[]
}

type JSONSchema = JSONSchemaObject | JSONSchemaArray

interface FileEditValidation {
    /**
     * JSON schema
     */
    schema?: JSONSchema
    /**
     * Error while validating the JSON schema
     */
    schemaError?: string
    /**
     * The path was validated with a file output (defFileOutput)
     */
    pathValid?: boolean
}

interface DataFrame {
    schema?: string
    data: unknown
    validation?: FileEditValidation
}

interface Logprob {
    /**
     * Token text
     */
    token: string
    /**
     * Log probably of the generated token
     */
    logprob: number
    /**
     * Logprob value converted to %
     */
    probPercent?: number
    /**
     * Normalized entropy
     */
    entropy?: number
    /**
     * Other top tokens considered by the LLM
     */
    topLogprobs?: { token: string; logprob: number }[]
}

interface RunPromptUsage {
    /**
     * Estimated cost in $ of the generation
     */
    cost?: number
    /**
     * Estimated duration of the generation
     * including multiple rounds with tools
     */
    duration?: number
    /**
     * Number of tokens in the generated completion.
     */
    completion: number

    /**
     * Number of tokens in the prompt.
     */
    prompt: number
    /**
     * Total number of tokens used in the request (prompt + completion).
     */
    total: number
}

interface RunPromptResult {
    messages: ChatMessage[]
    text: string
    reasoning?: string
    annotations?: Diagnostic[]
    fences?: Fenced[]
    frames?: DataFrame[]
    json?: any
    error?: SerializedError
    schemas?: Record<string, JSONSchema>
    finishReason:
        | "stop"
        | "length"
        | "tool_calls"
        | "content_filter"
        | "cancel"
        | "fail"
    fileEdits?: Record<string, FileUpdate>
    edits?: Edits[]
    changelogs?: string[]
    model?: ModelType
    choices?: Logprob[]
    logprobs?: Logprob[]
    perplexity?: number
    uncertainty?: number
    usage?: RunPromptUsage
}

/**
 * Path manipulation functions.
 */
interface Path {
    parse(path: string): {
        /**
         * The root of the path such as '/' or 'c:\'
         */
        root: string
        /**
         * The full directory path such as '/home/user/dir' or 'c:\path\dir'
         */
        dir: string
        /**
         * The file name including extension (if any) such as 'index.html'
         */
        base: string
        /**
         * The file extension (if any) such as '.html'
         */
        ext: string
        /**
         * The file name without extension (if any) such as 'index'
         */
        name: string
    }

    /**
     * Returns the last portion of a path. Similar to the Unix basename command.
     * @param path
     */
    dirname(path: string): string

    /**
     * Returns the extension of the path, from the last '.' to end of string in the last portion of the path.
     * @param path
     */
    extname(path: string): string

    /**
     * Returns the last portion of a path, similar to the Unix basename command.
     */
    basename(path: string, suffix?: string): string

    /**
     * The path.join() method joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
     * @param paths
     */
    join(...paths: string[]): string

    /**
     * The path.normalize() method normalizes the given path, resolving '..' and '.' segments.
     */
    normalize(...paths: string[]): string

    /**
     * The path.relative() method returns the relative path from from to to based on the current working directory. If from and to each resolve to the same path (after calling path.resolve() on each), a zero-length string is returned.
     */
    relative(from: string, to: string): string

    /**
     * The path.resolve() method resolves a sequence of paths or path segments into an absolute path.
     * @param pathSegments
     */
    resolve(...pathSegments: string[]): string

    /**
     * Determines whether the path is an absolute path.
     * @param path
     */
    isAbsolute(path: string): boolean

    /**
     * Change the extension of a path
     * @param path
     * @param ext
     */
    changeext(path: string, ext: string): string

    /**
     * Converts a file://... to a path
     * @param fileUrl
     */
    resolveFileURL(fileUrl: string): string

    /**
     * Sanitize a string to be safe for use as a filename by removing directory paths and invalid characters.
     * @param path file path
     */
    sanitize(path: string): string
}

interface Fenced {
    label: string
    language?: string
    content: string
    args?: { schema?: string } & Record<string, string>

    validation?: FileEditValidation
}

interface XMLParseOptions extends JSONSchemaValidationOptions {
    allowBooleanAttributes?: boolean
    ignoreAttributes?: boolean
    ignoreDeclaration?: boolean
    ignorePiTags?: boolean
    parseAttributeValue?: boolean
    removeNSPrefix?: boolean
    unpairedTags?: string[]
}

interface ParsePDFOptions {
    /**
     * Disable removing trailing spaces in text
     */
    disableCleanup?: boolean
    /**
     * Render each page as an image
     */
    renderAsImage?: boolean
    /**
     * Zoom scaling with rendering pages and figures
     */
    scale?: number
    /**
     * Disable caching with cache: false
     */
    cache?: boolean
    /**
     * Force system fonts use
     */
    useSystemFonts?: boolean
}

interface HTMLToTextOptions {
    /**
     * After how many chars a line break should follow in `p` elements.
     *
     * Set to `null` or `false` to disable word-wrapping.
     */
    wordwrap?: number | false | null | undefined
}

interface ParseXLSXOptions {
    // specific worksheet name
    sheet?: string
    // Use specified range (A1-style bounded range string)
    range?: string
}

interface WorkbookSheet {
    name: string
    rows: object[]
}

interface ParseZipOptions {
    glob?: string
}

type TokenEncoder = (text: string) => number[]
type TokenDecoder = (lines: Iterable<number>) => string

interface Tokenizer {
    model: string
    /**
     * Number of tokens
     */
    size?: number
    encode: TokenEncoder
    decode: TokenDecoder
}

interface CSVParseOptions extends JSONSchemaValidationOptions {
    delimiter?: string
    headers?: string[]
    repair?: boolean
}

interface TextChunk extends WorkspaceFile {
    lineStart: number
    lineEnd: number
}

interface TextChunkerConfig extends LineNumberingOptions {
    model?: ModelType
    chunkSize?: number
    chunkOverlap?: number
    docType?: OptionsOrString<
        | "cpp"
        | "python"
        | "py"
        | "java"
        | "go"
        | "c#"
        | "c"
        | "cs"
        | "ts"
        | "js"
        | "tsx"
        | "typescript"
        | "js"
        | "jsx"
        | "javascript"
        | "php"
        | "md"
        | "mdx"
        | "markdown"
        | "rst"
        | "rust"
    >
}

interface Tokenizers {
    /**
     * Estimates the number of tokens in the content. May not be accurate
     * @param model
     * @param text
     */
    count(text: string, options?: { model?: ModelType }): Promise<number>

    /**
     * Truncates the text to a given number of tokens, approximation.
     * @param model
     * @param text
     * @param maxTokens
     * @param options
     */
    truncate(
        text: string,
        maxTokens: number,
        options?: { model?: ModelType; last?: boolean }
    ): Promise<string>

    /**
     * Tries to resolve a tokenizer for a given model. Defaults to gpt-4o if not found.
     * @param model
     */
    resolve(model?: ModelType): Promise<Tokenizer>

    /**
     * Chunk the text into smaller pieces based on a token limit and chunking strategy.
     * @param text
     * @param options
     */
    chunk(
        file: Awaitable<string | WorkspaceFile>,
        options?: TextChunkerConfig
    ): Promise<TextChunk[]>
}

interface HashOptions {
    /**
     * Algorithm used for hashing
     */
    algorithm?: "sha-256"
    /**
     * Trim hash to this number of character
     */
    length?: number
    /**
     * Include genaiscript version in the hash
     */
    version?: boolean
    /**
     * Optional salting of the hash
     */
    salt?: string
    /**
     * Read the content of workspace files object into the hash
     */
    readWorkspaceFiles?: boolean
}

interface VideoProbeResult {
    streams: {
        index: number
        codec_name: string
        codec_long_name: string
        profile: string
        codec_type: string
        codec_tag_string: string
        codec_tag: string
        width?: number
        height?: number
        coded_width?: number
        coded_height?: number
        closed_captions?: number
        film_grain?: number
        has_b_frames?: number
        sample_aspect_ratio?: string
        display_aspect_ratio?: string
        pix_fmt?: string
        level?: number
        color_range?: string
        color_space?: string
        color_transfer?: string
        color_primaries?: string
        chroma_location?: string
        field_order?: string
        refs?: number
        is_avc?: string
        nal_length_size?: number
        id: string
        r_frame_rate: string
        avg_frame_rate: string
        time_base: string
        start_pts: number
        start_time: number
        duration_ts: number
        duration: number
        bit_rate: number
        max_bit_rate: string
        bits_per_raw_sample: number | string
        nb_frames: number | string
        nb_read_frames?: string
        nb_read_packets?: string
        extradata_size?: number
        tags?: {
            creation_time: string
            language?: string
            handler_name: string
            vendor_id?: string
            encoder?: string
        }
        disposition?: {
            default: number
            dub: number
            original: number
            comment: number
            lyrics: number
            karaoke: number
            forced: number
            hearing_impaired: number
            visual_impaired: number
            clean_effects: number
            attached_pic: number
            timed_thumbnails: number
            captions: number
            descriptions: number
            metadata: number
            dependent: number
            still_image: number
        }
        sample_fmt?: string
        sample_rate?: number
        channels?: number
        channel_layout?: string
        bits_per_sample?: number | string
    }[]
    format: {
        filename: string
        nb_streams: number
        nb_programs: number
        format_name: string
        format_long_name: string
        start_time: number
        duration: number
        size: number
        bit_rate: number
        probe_score: number
        tags: {
            major_brand: string
            minor_version: string
            compatible_brands: string
            creation_time: string
        }
    }
}

interface PDFPageImage extends WorkspaceFile {
    id: string
    width: number
    height: number
}

interface PDFPage {
    index: number
    content: string
    image?: string
    figures?: PDFPageImage[]
}

interface DocxParseOptions extends CacheOptions {
    /**
     * Desired output format
     */
    format?: "markdown" | "text" | "html"
}

interface EncodeIDsOptions {
    matcher?: RegExp
    prefix?: string
    open?: string
    close?: string
}

interface Parsers {
    /**
     * Parses text as a JSON5 payload
     */
    JSON5(
        content: string | WorkspaceFile,
        options?: { defaultValue?: any } & JSONSchemaValidationOptions
    ): any | undefined

    /**
     * Parses text generated by an LLM as JSON payload
     * @param content
     */
    JSONLLM(content: string): any | undefined

    /**
     * Parses text or file as a JSONL payload. Empty lines are ignore, and JSON5 is used for parsing.
     * @param content
     */
    JSONL(content: string | WorkspaceFile): any[] | undefined

    /**
     * Parses text as a YAML payload
     */
    YAML(
        content: string | WorkspaceFile,
        options?: { defaultValue?: any } & JSONSchemaValidationOptions
    ): any | undefined

    /**
     * Parses text as TOML payload
     * @param text text as TOML payload
     */
    TOML(
        content: string | WorkspaceFile,
        options?: { defaultValue?: any } & JSONSchemaValidationOptions
    ): any | undefined

    /**
     * Parses the front matter of a markdown file
     * @param content
     * @param defaultValue
     */
    frontmatter(
        content: string | WorkspaceFile,
        options?: {
            defaultValue?: any
            format: "yaml" | "json" | "toml"
        } & JSONSchemaValidationOptions
    ): any | undefined

    /**
     * Parses a file or URL as PDF
     * @param content
     */
    PDF(
        content: string | WorkspaceFile,
        options?: ParsePDFOptions
    ): Promise<
        | {
              /**
               * Reconstructed text content from page content
               */
              file: WorkspaceFile
              /**
               * Page text content
               */
              pages: string[]
              /**
               * Rendered pages as images if `renderAsImage` is set
               */
              images?: string[]

              /**
               * Parse PDF content
               */
              data: PDFPage[]
          }
        | undefined
    >

    /**
     * Parses a .docx file
     * @param content
     */
    DOCX(
        content: string | WorkspaceFile,
        options?: DocxParseOptions
    ): Promise<{ file?: WorkspaceFile; error?: string }>

    /**
     * Parses a CSV file or text
     * @param content
     */
    CSV(
        content: string | WorkspaceFile,
        options?: CSVParseOptions
    ): object[] | undefined

    /**
     * Parses a XLSX file and a given worksheet
     * @param content
     */
    XLSX(
        content: WorkspaceFile,
        options?: ParseXLSXOptions
    ): Promise<WorkbookSheet[] | undefined>

    /**
     * Parses a .env file
     * @param content
     */
    dotEnv(content: string | WorkspaceFile): Record<string, string>

    /**
     * Parses a .ini file
     * @param content
     */
    INI(
        content: string | WorkspaceFile,
        options?: INIParseOptions
    ): any | undefined

    /**
     * Parses a .xml file
     * @param content
     */
    XML(
        content: string | WorkspaceFile,
        options?: { defaultValue?: any } & XMLParseOptions
    ): any | undefined

    /**
     * Parses .vtt or .srt transcription files
     * @param content
     */
    transcription(content: string | WorkspaceFile): TranscriptionSegment[]

    /**
     * Convert HTML to text
     * @param content html string or file
     * @param options
     */
    HTMLToText(
        content: string | WorkspaceFile,
        options?: HTMLToTextOptions
    ): Promise<string>

    /**
     * Convert HTML to markdown
     * @param content html string or file
     * @param options rendering options
     */
    HTMLToMarkdown(
        content: string | WorkspaceFile,
        options?: HTMLToMarkdownOptions
    ): Promise<string>

    /**
     * Parsers a mermaid diagram and returns the parse error if any
     * @param content
     */
    mermaid(
        content: string | WorkspaceFile
    ): Promise<{ error?: string; diagramType?: string }>

    /**
     * Extracts the contents of a zip archive file
     * @param file
     * @param options
     */
    unzip(
        file: WorkspaceFile,
        options?: ParseZipOptions
    ): Promise<WorkspaceFile[]>

    /**
     * Estimates the number of tokens in the content.
     * @param content content to tokenize
     */
    tokens(content: string | WorkspaceFile): number

    /**
     * Parses fenced code sections in a markdown text
     */
    fences(content: string | WorkspaceFile): Fenced[]

    /**
     * Parses various format of annotations (error, warning, ...)
     * @param content
     */
    annotations(content: string | WorkspaceFile): Diagnostic[]

    /**
     * Executes a tree-sitter query on a code file
     * @param file
     * @param query tree sitter query; if missing, returns the entire tree. `tags` return tags
     */
    code(
        file: WorkspaceFile,
        query?: OptionsOrString<"tags">
    ): Promise<{ captures: QueryCapture[] }>

    /**
     * Parses and evaluates a math expression
     * @param expression math expression compatible with mathjs
     * @param scope object to read/write variables
     */
    math(
        expression: string,
        scope?: object
    ): Promise<string | number | undefined>

    /**
     * Using the JSON schema, validates the content
     * @param schema JSON schema instance
     * @param content object to validate
     */
    validateJSON(schema: JSONSchema, content: any): FileEditValidation

    /**
     * Renders a mustache template
     * @param text template text
     * @param data data to render
     */
    mustache(text: string | WorkspaceFile, data: Record<string, any>): string

    /**
     * Renders a jinja template
     */
    jinja(text: string | WorkspaceFile, data: Record<string, any>): string

    /**
     * Computes a diff between two files
     */
    diff(
        left: string | WorkspaceFile,
        right: string | WorkspaceFile,
        options?: DefDiffOptions
    ): string

    /**
     * Cleans up a dataset made of rows of data
     * @param rows
     * @param options
     */
    tidyData(rows: object[], options?: DataFilter): object[]

    /**
     * Applies a GROQ query to the data
     * @param data data object to filter
     * @param query query
     * @see https://groq.dev/
     */
    GROQ(query: string, data: any): Promise<any>

    /**
     * Computes a sha1 that can be used for hashing purpose, not cryptographic.
     * @param content content to hash
     */
    hash(content: any, options?: HashOptions): Promise<string>

    /**
     * Optionally removes a code fence section around the text
     * @param text
     * @param language
     */
    unfence(text: string, language?: ElementOrArray<string>): string

    /**
     * Erase <think>...</think> tags
     * @param text
     */
    unthink(text: string): string

    /**
     * Remove left indentation
     * @param text
     */
    dedent(templ: TemplateStringsArray | string, ...values: unknown[]): string

    /**
     * Encodes ids in a text and returns the function to decode them
     * @param text
     * @param options
     */
    encodeIDs(
        text: string,
        options?: EncodeIDsOptions
    ): {
        encoded: string
        text: string
        decode: (text: string) => string
        matcher: RegExp
        ids: Record<string, string>
    }

    /**
     * Parses a prompty file
     * @param file
     */
    prompty(file: WorkspaceFile): Promise<PromptyDocument>
}

interface YAML {
    /**
     * Parses a YAML string into a JavaScript object using JSON5.
     */
    (strings: TemplateStringsArray, ...values: any[]): any

    /**
     * Converts an object to its YAML representation
     * @param obj
     */
    stringify(obj: any): string
    /**
     * Parses a YAML string to object
     */
    parse(text: string | WorkspaceFile): any
}

interface Z3Solver {
    /**
     * Runs Z3 on a given SMT string
     * @param smt
     */
    run(smt: string): Promise<string>

    /**
     * Native underlying Z3 api
     */
    api(): any
}

interface Z3SolverHost {
    /**
     * Loads the Z3 solver from the host
     */
    z3(): Promise<Z3Solver>
}

interface PromptyFrontmatter {
    name?: string
    description?: string
    version?: string
    authors?: string[]
    tags?: string[]
    sample?: Record<string, any> | string
    inputs?: Record<
        string,
        | JSONSchemaArray
        | JSONSchemaNumber
        | JSONSchemaBoolean
        | JSONSchemaString
        | JSONSchemaObject
        | { type: "list" }
    >
    outputs?: JSONSchemaObject
    model?: {
        api?: "chat" | "completion"
        configuration?: {
            type?: string
            name?: string
            organization?: string
            api_version?: string
            azure_deployment: string
            azure_endpoint: string
        }
        parameters?: {
            response_format?: { type: "json_object" | "json_schema" }
            max_tokens?: number
            temperature?: number
            top_p?: number
            n?: number
            seed?: number
            stream?: boolean // ignored
            tools?: unknown[] // ignored
        }
    }

    // unofficial
    files?: string | string[]
    tests?: PromptTest | PromptTest[]
}

interface PromptyDocument {
    meta: PromptArgs
    frontmatter: PromptyFrontmatter
    content: string
    messages: ChatMessage[]
}

interface DiffFile {
    chunks: DiffChunk[]
    deletions: number
    additions: number
    from?: string
    to?: string
    oldMode?: string
    newMode?: string
    index?: string[]
    deleted?: true
    new?: true
}

interface DiffChunk {
    content: string
    changes: DiffChange[]
    oldStart: number
    oldLines: number
    newStart: number
    newLines: number
}

interface DiffNormalChange {
    type: "normal"
    ln1: number
    ln2: number
    normal: true
    content: string
}

interface DiffAddChange {
    type: "add"
    add: true
    ln: number
    content: string
}

interface DiffDeleteChange {
    type: "del"
    del: true
    ln: number
    content: string
}

type DiffChangeType = "normal" | "add" | "del"

type DiffChange = DiffNormalChange | DiffAddChange | DiffDeleteChange

interface DIFF {
    /**
     * Parses a diff string into a structured object
     * @param input
     */
    parse(input: string): DiffFile[]

    /**
     * Given a filename and line number (0-based), finds the chunk in the diff
     * @param file
     * @param range line index or range [start, end] inclusive
     * @param diff
     */
    findChunk(
        file: string,
        range: number | [number, number] | number[],
        diff: ElementOrArray<DiffFile>
    ): { file?: DiffFile; chunk?: DiffChunk } | undefined

    /**
     * Creates a two file path
     * @param left
     * @param right
     * @param options
     */
    createPatch(
        left: string | WorkspaceFile,
        right: string | WorkspaceFile,
        options?: {
            context?: number
            ignoreCase?: boolean
            ignoreWhitespace?: boolean
        }
    ): string
}

interface XML {
    /**
     * Parses an XML payload to an object
     * @param text
     */
    parse(text: string | WorkspaceFile, options?: XMLParseOptions): any
}

interface JSONSchemaUtilities {
    /**
     * Infers a JSON schema from an object
     * @param obj
     * @deprecated Use `fromParameters` instead
     */
    infer(obj: any): Promise<JSONSchema>

    /**
     * Converts a parameters schema to a JSON schema
     * @param parameters
     */
    fromParameters(parameters: PromptParametersSchema | undefined): JSONSchema
}

interface HTMLTableToJSONOptions {
    useFirstRowForHeadings?: boolean
    headers?: {
        from?: number
        to: number
        concatWith: string
    }
    stripHtmlFromHeadings?: boolean
    stripHtmlFromCells?: boolean
    stripHtml?: boolean | null
    forceIndexAsNumber?: boolean
    countDuplicateHeadings?: boolean
    ignoreColumns?: number[] | null
    onlyColumns?: number[] | null
    ignoreHiddenRows?: boolean
    id?: string[] | null
    headings?: string[] | null
    containsClasses?: string[] | null
    limitrows?: number | null
}

interface HTMLToMarkdownOptions {
    disableGfm?: boolean
}

interface HTML {
    /**
     * Converts all HTML tables to JSON.
     * @param html
     * @param options
     */
    convertTablesToJSON(
        html: string,
        options?: HTMLTableToJSONOptions
    ): Promise<object[][]>
    /**
     * Converts HTML markup to plain text
     * @param html
     */
    convertToText(html: string): Promise<string>
    /**
     * Converts HTML markup to markdown
     * @param html
     */
    convertToMarkdown(
        html: string,
        options?: HTMLToMarkdownOptions
    ): Promise<string>
}

interface GitCommit {
    sha: string
    date: string
    message: string
}

interface Git {
    /**
     * Current working directory
     */
    cwd: string

    /**
     * Resolves the default branch for this repository
     */
    defaultBranch(): Promise<string>

    /**
     * Gets the last tag in the repository
     */
    lastTag(): Promise<string>

    /**
     * Gets the current branch of the repository
     */
    branch(): Promise<string>

    /**
     * Executes a git command in the repository and returns the stdout
     * @param cmd
     */
    exec(
        args: string[] | string,
        options?: {
            label?: string
        }
    ): Promise<string>

    /**
     * Git fetches the remote repository
     * @param options
     */
    fetch(
        remote?: OptionsOrString<"origin">,
        branchOrSha?: string,
        options?: {
            prune?: boolean
            all?: boolean
        }
    ): Promise<string>

    /**
     * Git pull the remote repository
     * @param options
     */
    pull(options?: { ff?: boolean }): Promise<string>

    /**
     * Lists the branches in the git repository
     */
    listBranches(): Promise<string[]>

    /**
     * Finds specific files in the git repository.
     * By default, work
     * @param options
     */
    listFiles(
        scope?: "modified-base" | "staged" | "modified",
        options?: {
            base?: string
            /**
             * Ask the user to stage the changes if the diff is empty.
             */
            askStageOnEmpty?: boolean
            paths?: ElementOrArray<string>
            excludedPaths?: ElementOrArray<string>
        }
    ): Promise<WorkspaceFile[]>

    /**
     *
     * @param options
     */
    diff(options?: {
        staged?: boolean
        /**
         * Ask the user to stage the changes if the diff is empty.
         */
        askStageOnEmpty?: boolean
        base?: string
        head?: string
        paths?: ElementOrArray<string>
        excludedPaths?: ElementOrArray<string>
        unified?: number
        nameOnly?: boolean
        algorithm?: "patience" | "minimal" | "histogram" | "myers"
        ignoreSpaceChange?: boolean
        extras?: string[]
        /**
         * Modifies the diff to be in a more LLM friendly format
         */
        llmify?: boolean
        /**
         * Maximum of tokens before returning a name-only diff
         */
        maxTokensFullDiff?: number
    }): Promise<string>

    /**
     * Lists the commits in the git repository
     */
    log(options?: {
        base?: string
        head?: string
        count?: number
        merges?: boolean
        author?: string
        until?: string
        after?: string
        excludedGrep?: string | RegExp
        paths?: ElementOrArray<string>
        excludedPaths?: ElementOrArray<string>
    }): Promise<GitCommit[]>

    /**
     * Run git blame on a file, line
     * @param filename
     * @param line
     */
    blame(filename: string, line: number): Promise<string>

    /**
     * Create a shallow git clone
     * @param repository URL of the remote repository
     * @param options various clone options
     * @returns the path to the cloned repository
     */
    shallowClone(
        repository: string,
        options?: {
            /**
             * Branch to clone
             */
            branch?: string

            /**
             * Do not reuse previous clone
             */
            force?: boolean

            /**
             * Runs install command after cloning
             */
            install?: boolean

            /**
             * Number of commits to fetch
             */
            depth?: number
        }
    ): Promise<Git>

    /**
     * Open a git client on a different directory
     * @param cwd working directory
     */
    client(cwd: string): Git
}

/**
 * A ffmpeg command builder. This instance is the 'native' fluent-ffmpeg command builder.
 */
interface FfmpegCommandBuilder {
    seekInput(startTime: number | string): FfmpegCommandBuilder
    duration(duration: number | string): FfmpegCommandBuilder
    noVideo(): FfmpegCommandBuilder
    noAudio(): FfmpegCommandBuilder
    audioCodec(codec: string): FfmpegCommandBuilder
    audioBitrate(bitrate: string | number): FfmpegCommandBuilder
    audioChannels(channels: number): FfmpegCommandBuilder
    audioFrequency(freq: number): FfmpegCommandBuilder
    audioQuality(quality: number): FfmpegCommandBuilder
    audioFilters(
        filters: string | string[] /*| AudioVideoFilter[]*/
    ): FfmpegCommandBuilder
    toFormat(format: string): FfmpegCommandBuilder

    videoCodec(codec: string): FfmpegCommandBuilder
    videoBitrate(
        bitrate: string | number,
        constant?: boolean
    ): FfmpegCommandBuilder
    videoFilters(filters: string | string[]): FfmpegCommandBuilder
    outputFps(fps: number): FfmpegCommandBuilder
    frames(frames: number): FfmpegCommandBuilder
    keepDisplayAspectRatio(): FfmpegCommandBuilder
    size(size: string): FfmpegCommandBuilder
    aspectRatio(aspect: string | number): FfmpegCommandBuilder
    autopad(pad?: boolean, color?: string): FfmpegCommandBuilder

    inputOptions(...options: string[]): FfmpegCommandBuilder
    outputOptions(...options: string[]): FfmpegCommandBuilder
}

interface FFmpegCommandOptions extends CacheOptions {
    inputOptions?: ElementOrArray<string>
    outputOptions?: ElementOrArray<string>
    /**
     * For video conversion, output size as `wxh`
     */
    size?: string
}

interface VideoExtractFramesOptions extends FFmpegCommandOptions {
    /**
     * A set of seconds or timestamps (`[[hh:]mm:]ss[.xxx]`)
     */
    timestamps?: number[] | string[]
    /**
     * Number of frames to extract
     */
    count?: number
    /**
     * Extract frames on the start of each transcript segment
     */
    transcript?: TranscriptionResult | string
    /**
     * Extract Intra frames (keyframes). This is a efficient and fast decoding.
     */
    keyframes?: boolean
    /**
     * Picks frames that exceed scene threshold (between 0 and 1), typically between 0.2, and 0.5.
     * This is computationally intensive.
     */
    sceneThreshold?: number
    /**
     * Output of the extracted frames
     */
    format?: OptionsOrString<"jpeg" | "png">
}

interface VideoExtractClipOptions extends FFmpegCommandOptions {
    /**
     * Start time of the clip in seconds or timestamp (`[[hh:]mm:]ss[.xxx]`)
     */
    start: number | string
    /**
     * Duration of the clip in seconds or timestamp (`[[hh:]mm:]ss[.xxx]`).
     * You can also specify `end`.
     */
    duration?: number | string
    /**
     * End time of the clip in seconds or timestamp (`[[hh:]mm:]ss[.xxx]`).
     * You can also specify `duration`.
     */
    end?: number | string
}

interface VideoExtractAudioOptions extends FFmpegCommandOptions {
    /**
     * Optimize for speech-to-text transcription. Default is true.
     */
    transcription?: boolean

    forceConversion?: boolean
}

interface Ffmpeg {
    /**
     * Extracts metadata information from a video file using ffprobe
     * @param filename
     */
    probe(
        file: string | WorkspaceFile,
        options?: FFmpegCommandOptions
    ): Promise<VideoProbeResult>

    /**
     * Extracts frames from a video file
     * @param options
     */
    extractFrames(
        file: string | WorkspaceFile,
        options?: VideoExtractFramesOptions
    ): Promise<string[]>

    /**
     * Extracts a clip from a video. Returns the generated video file path.
     */
    extractClip(
        file: string | WorkspaceFile,
        options: VideoExtractClipOptions
    ): Promise<string>

    /**
     * Extract the audio track from a video
     * @param videoPath
     */
    extractAudio(
        file: string | WorkspaceFile,
        options?: VideoExtractAudioOptions
    ): Promise<string>

    /**
     * Runs a ffmpeg command and returns the list of generated file names
     * @param input
     * @param builder manipulates the ffmpeg command and returns the output name
     */
    run(
        input: string | WorkspaceFile,
        builder: (
            cmd: FfmpegCommandBuilder,
            options?: { input: string; dir: string }
        ) => Awaitable<string>,
        options?: FFmpegCommandOptions
    ): Promise<string[]>
}

interface TranscriptionSegment {
    id?: string
    start: number
    end?: number
    text: string
}

interface GitHubOptions {
    owner: string
    repo: string
    baseUrl?: string
    auth?: string
    ref?: string
    refName?: string
    issueNumber?: number
}

type GitHubWorkflowRunStatus =
    | "completed"
    | "action_required"
    | "cancelled"
    | "failure"
    | "neutral"
    | "skipped"
    | "stale"
    | "success"
    | "timed_out"
    | "in_progress"
    | "queued"
    | "requested"
    | "waiting"
    | "pending"

interface GitHubWorkflowRun {
    id: number
    run_number: number
    name?: string
    display_title: string
    status: string
    conclusion: string
    html_url: string
    created_at: string
    head_branch: string
    head_sha: string
    workflow_id: number
    run_started_at?: string
}

interface GitHubWorkflowJob {
    id: number
    run_id: number
    status: string
    conclusion: string
    name: string
    html_url: string
    logs_url: string
    logs: string
    started_at: string
    completed_at: string
    content: string
}

interface GitHubIssue {
    id: number
    body?: string
    title: string
    number: number
    state: string
    state_reason?: "completed" | "reopened" | "not_planned" | null
    html_url: string
    draft?: boolean
    reactions?: GitHubReactions
    user: GitHubUser
    assignee?: GitHubUser
}

interface GitHubRef {
    ref: string
    url: string
}

interface GitHubReactions {
    url: string
    total_count: number
    "+1": number
    "-1": number
    laugh: number
    confused: number
    heart: number
    hooray: number
    eyes: number
    rocket: number
}

interface GitHubComment {
    id: number
    body?: string
    user: GitHubUser
    created_at: string
    updated_at: string
    html_url: string
    reactions?: GitHubReactions
}

interface GitHubPullRequest extends GitHubIssue {
    head: {
        ref: string
    }
    base: {
        ref: string
    }
}

interface GitHubCodeSearchResult {
    name: string
    path: string
    sha: string
    html_url: string
    score: number
    repository: string
}

interface GitHubWorkflow {
    id: number
    name: string
    path: string
}

interface GitHubPaginationOptions {
    /**
     * Default number of items to fetch, default is 50.
     */
    count?: number
}

interface GitHubFile extends WorkspaceFile {
    type: "file" | "dir" | "submodule" | "symlink"
    size: number
}

interface GitHubUser {
    login: string
}

interface GitHubRelease {
    id: number
    tag_name: string
    name: string
    draft?: boolean
    prerelease?: boolean
    html_url: string
    published_at: string
    body?: string
}

interface GitHubGist {
    id: string
    description?: string
    created_at?: string
    files: WorkspaceFile[]
}

interface GitHubArtifact {
    id: number
    name: string
    size_in_bytes: number
    url: string
    archive_download_url: string
    expires_at: string
}

interface GitHubIssueUpdateOptions {
    title?: string
    body?: string
    assignee?: string
    state?: "open" | "closed"
    assignees?: string[]
    labels?: string[]
}

interface GitHub {
    /**
     * Gets connection information for octokit
     */
    info(): Promise<GitHubOptions | undefined>

    /**
     * Gets the details of a GitHub workflow
     * @param workflowId
     */
    workflow(workflowId: number | string): Promise<GitHubWorkflow>

    /**
     * Lists workflows in a GitHub repository
     */
    listWorkflows(options?: GitHubPaginationOptions): Promise<GitHubWorkflow[]>

    /**
     * Lists workflow runs for a given workflow
     * @param workflowId
     * @param options
     */
    listWorkflowRuns(
        workflow_id: string | number,
        options?: {
            branch?: string
            event?: string
            status?: GitHubWorkflowRunStatus
        } & GitHubPaginationOptions
    ): Promise<GitHubWorkflowRun[]>

    /**
     * Gets the details of a GitHub Action workflow run
     * @param runId
     */
    workflowRun(runId: number | string): Promise<GitHubWorkflowRun>

    /**
     * List artifacts for a given workflow run
     * @param runId
     */
    listWorkflowRunArtifacts(
        runId: number | string,
        options?: GitHubPaginationOptions
    ): Promise<GitHubArtifact[]>

    /**
     * Gets the details of a GitHub Action workflow run artifact
     * @param artifactId
     */
    artifact(artifactId: number | string): Promise<GitHubArtifact>

    /**
     * Downloads and unzips archive files from a GitHub Action Artifact
     * @param artifactId
     */
    downloadArtifactFiles(artifactId: number | string): Promise<WorkspaceFile[]>

    /**
     * Downloads a GitHub Action workflow run log
     * @param runId
     */
    listWorkflowJobs(
        runId: number,
        options?: GitHubPaginationOptions
    ): Promise<GitHubWorkflowJob[]>

    /**
     * Downloads a GitHub Action workflow run log
     * @param jobId
     */
    downloadWorkflowJobLog(
        jobId: number,
        options?: { llmify?: boolean }
    ): Promise<string>

    /**
     * Diffs two GitHub Action workflow job logs
     */
    diffWorkflowJobLogs(job_id: number, other_job_id: number): Promise<string>

    /**
     * Lists issues for a given repository
     * @param options
     */
    listIssues(
        options?: {
            state?: "open" | "closed" | "all"
            labels?: string
            sort?: "created" | "updated" | "comments"
            direction?: "asc" | "desc"
            creator?: string
            assignee?: string
            since?: string
            mentioned?: string
        } & GitHubPaginationOptions
    ): Promise<GitHubIssue[]>

    /**
     * Lists gists for a given user
     */
    listGists(): Promise<GitHubGist[]>

    /**
     * Gets the files of a gist
     * @param gist_id
     */
    getGist(gist_id: string): Promise<GitHubGist | undefined>

    /**
     * Gets the details of a GitHub issue
     * @param issueNumber issue number (not the issue id!). If undefined, reads value from GITHUB_ISSUE environment variable.
     */
    getIssue(issueNumber?: number | string): Promise<GitHubIssue>

    /**
     * Updates an issue or pull request on GitHub
     * @param issueNumber
     * @param options
     */
    updateIssue(
        issueNumber: number | string,
        options: GitHubIssueUpdateOptions
    ): Promise<GitHubIssue>

    /**
     * Create a GitHub issue comment
     * @param issueNumber issue number (not the issue id!). If undefined, reads value from GITHUB_ISSUE environment variable.
     * @param body the body of the comment as Github Flavored markdown
     */
    createIssueComment(
        issueNumber: number | string,
        body: string
    ): Promise<GitHubComment>

    /**
     * Lists comments for a given issue
     * @param issue_number
     * @param options
     */
    listIssueComments(
        issue_number: number | string,
        options?: GitHubPaginationOptions
    ): Promise<GitHubComment[]>

    /**
     * Updates a comment on a GitHub issue
     * @param comment_id
     * @param body the updated comment body
     */
    updateIssueComment(
        comment_id: number | string,
        body: string
    ): Promise<GitHubComment>

    /**
     * Lists pull requests for a given repository
     * @param options
     */
    listPullRequests(
        options?: {
            state?: "open" | "closed" | "all"
            sort?: "created" | "updated" | "popularity" | "long-running"
            direction?: "asc" | "desc"
        } & GitHubPaginationOptions
    ): Promise<GitHubPullRequest[]>

    /**
     * Gets the details of a GitHub pull request
     * @param pull_number pull request number. Default resolves the pull request for the current branch.
     */
    getPullRequest(pull_number?: number | string): Promise<GitHubPullRequest>

    /**
     * Lists comments for a given pull request
     * @param pull_number
     * @param options
     */
    listPullRequestReviewComments(
        pull_number: number,
        options?: GitHubPaginationOptions
    ): Promise<GitHubComment[]>

    /**
     * Gets the content of a file from a GitHub repository
     * @param filepath
     * @param options
     */
    getFile(
        filepath: string,
        /**
         * commit sha, branch name or tag name
         */
        ref: string
    ): Promise<WorkspaceFile>

    /**
     * Searches code in a GitHub repository
     */
    searchCode(
        query: string,
        options?: GitHubPaginationOptions
    ): Promise<GitHubCodeSearchResult[]>

    /**
     * Lists branches in a GitHub repository
     */
    listBranches(options?: GitHubPaginationOptions): Promise<string[]>

    /**
     * Lists tags in a GitHub repository
     */
    listRepositoryLanguages(): Promise<Record<string, number>>

    /**
     * List latest releases in a GitHub repository
     * @param options
     */
    listReleases(options?: GitHubPaginationOptions): Promise<GitHubRelease[]>

    /**
     * Lists tags in a GitHub repository
     */
    getRepositoryContent(
        path?: string,
        options?: {
            ref?: string
            glob?: string
            downloadContent?: boolean
            maxDownloadSize?: number
            type?: GitHubFile["type"]
        }
    ): Promise<GitHubFile[]>

    /**
     * Uploads a file to an orphaned branch in the repository and returns the raw url
     * Uploads a single copy of the file using hash as the name.
     * @param file file or data to upload
     * @param options
     */
    uploadAsset(
        file: BufferLike,
        options?: {
            branchName?: string
        }
    ): Promise<string>

    /**
     * Resolves user uploaded assets to a short lived URL with access token. Returns undefined if the asset is not found.
     */
    resolveAssetUrl(url: string): Promise<string | undefined>

    /**
     * Gets the underlying Octokit client
     */
    api(): Promise<any>

    /**
     * Opens a client to a different repository
     * @param owner
     * @param repo
     */
    client(owner: string, repo: string): GitHub
}

interface MD {
    /**
     * Parses front matter from markdown
     * @param text
     */
    frontmatter(
        text: string | WorkspaceFile,
        format?: "yaml" | "json" | "toml" | "text"
    ): any

    /**
     * Removes the front matter from the markdown text
     */
    content(text: string | WorkspaceFile): string

    /**
     * Merges frontmatter with the existing text
     * @param text
     * @param frontmatter
     * @param format
     */
    updateFrontmatter(
        text: string,
        frontmatter: any,
        format?: "yaml" | "json"
    ): string

    /**
     * Attempts to chunk markdown in text section in a way that does not splitting the heading structure.
     * @param text
     * @param options
     */
    chunk(
        text: string | WorkspaceFile,
        options?: { maxTokens?: number; model?: string; pageSeparator?: string }
    ): Promise<TextChunk[]>

    /**
     * Pretty prints object to markdown
     * @param value
     */
    stringify(
        value: any,
        options?: {
            quoteValues?: boolean
            headings?: number
            headingLevel?: number
        }
    ): string
}

interface JSONL {
    /**
     * Parses a JSONL string to an array of objects
     * @param text
     */
    parse(text: string | WorkspaceFile): any[]
    /**
     * Converts objects to JSONL format
     * @param objs
     */
    stringify(objs: any[]): string
}

interface INI {
    /**
     * Parses a .ini file
     * @param text
     */
    parse(text: string | WorkspaceFile): any

    /**
     * Converts an object to.ini string
     * @param value
     */
    stringify(value: any): string
}

interface JSON5 {
    /**
     * Parses a JSON/YAML/XML string to an object
     * @param text
     */
    parse(text: string | WorkspaceFile): any

    /**
     * Renders an object to a JSON5-LLM friendly string
     * @param value
     */
    stringify(value: any): string
}

interface CSVStringifyOptions {
    delimiter?: string
    header?: boolean
}

/**
 * Interface representing CSV operations.
 */
interface CSV {
    /**
     * Parses a CSV string to an array of objects.
     *
     * @param text - The CSV string to parse.
     * @param options - Optional settings for parsing.
     * @param options.delimiter - The delimiter used in the CSV string. Defaults to ','.
     * @param options.headers - An array of headers to use. If not provided, headers will be inferred from the first row.
     * @returns An array of objects representing the parsed CSV data.
     */
    parse(text: string | WorkspaceFile, options?: CSVParseOptions): object[]

    /**
     * Converts an array of objects to a CSV string.
     *
     * @param csv - The array of objects to convert.
     * @param options - Optional settings for stringifying.
     * @param options.headers - An array of headers to use. If not provided, headers will be inferred from the object keys.
     * @returns A CSV string representing the data.
     */
    stringify(csv: object[], options?: CSVStringifyOptions): string

    /**
     * Converts an array of objects that represents a data table to a markdown table.
     *
     * @param csv - The array of objects to convert.
     * @param options - Optional settings for markdown conversion.
     * @param options.headers - An array of headers to use. If not provided, headers will be inferred from the object keys.
     * @returns A markdown string representing the data table.
     */
    markdownify(csv: object[], options?: { headers?: string[] }): string

    /**
     * Splits the original array into chunks of the specified size.
     * @param csv
     * @param rows
     */
    chunk(
        csv: object[],
        size: number
    ): { chunkStartIndex: number; rows: object[] }[]
}

/**
 * Provide service for responsible.
 */
interface ContentSafety {
    /**
     * Service identifier
     */
    id: string

    /**
     * Scans text for the risk of a User input attack on a Large Language Model.
     * If not supported, the method is not defined.
     */
    detectPromptInjection?(
        content: Awaitable<
            ElementOrArray<string> | ElementOrArray<WorkspaceFile>
        >
    ): Promise<{ attackDetected: boolean; filename?: string; chunk?: string }>
    /**
     * Analyzes text for harmful content.
     * If not supported, the method is not defined.
     * @param content
     */
    detectHarmfulContent?(
        content: Awaitable<
            ElementOrArray<string> | ElementOrArray<WorkspaceFile>
        >
    ): Promise<{
        harmfulContentDetected: boolean
        filename?: string
        chunk?: string
    }>
}

interface HighlightOptions {
    maxLength?: number
}

interface WorkspaceFileIndex {
    /**
     * Gets the index name
     */
    name: string
    /**
     * Uploads or merges files into the index
     */
    insertOrUpdate: (file: ElementOrArray<WorkspaceFile>) => Promise<void>
    /**
     * Searches the index
     */
    search: (
        query: string,
        options?: { topK?: number; minScore?: number }
    ) => Promise<WorkspaceFileWithScore[]>
}

interface VectorIndexOptions extends EmbeddingsModelOptions {
    /**
     * Type of database implementation.
     * - `local` uses a local database using embeddingsModel
     * - `azure_ai_search` uses Azure AI Search
     */
    type?: "local" | "azure_ai_search"
    version?: number
    deleteIfExists?: boolean
    chunkSize?: number
    chunkOverlap?: number

    /**
     * Embeddings vector size
     */
    vectorSize?: number
    /**
     * Override default embeddings cache name
     */
    cacheName?: string
    /**
     * Cache salt to invalidate cache entries
     */
    cacheSalt?: string
}

interface VectorSearchOptions extends VectorIndexOptions {
    /**
     * Maximum number of embeddings to use
     */
    topK?: number
    /**
     * Minimum similarity score
     */
    minScore?: number
    /**
     * Index to use
     */
    indexName?: string
}

interface FuzzSearchOptions {
    /**
     * Controls whether to perform prefix search. It can be a simple boolean, or a
     * function.
     *
     * If a boolean is passed, prefix search is performed if true.
     *
     * If a function is passed, it is called upon search with a search term, the
     * positional index of that search term in the tokenized search query, and the
     * tokenized search query.
     */
    prefix?: boolean
    /**
     * Controls whether to perform fuzzy search. It can be a simple boolean, or a
     * number, or a function.
     *
     * If a boolean is given, fuzzy search with a default fuzziness parameter is
     * performed if true.
     *
     * If a number higher or equal to 1 is given, fuzzy search is performed, with
     * a maximum edit distance (Levenshtein) equal to the number.
     *
     * If a number between 0 and 1 is given, fuzzy search is performed within a
     * maximum edit distance corresponding to that fraction of the term length,
     * approximated to the nearest integer. For example, 0.2 would mean an edit
     * distance of 20% of the term length, so 1 character in a 5-characters term.
     * The calculated fuzziness value is limited by the `maxFuzzy` option, to
     * prevent slowdown for very long queries.
     */
    fuzzy?: boolean | number
    /**
     * Controls the maximum fuzziness when using a fractional fuzzy value. This is
     * set to 6 by default. Very high edit distances usually don't produce
     * meaningful results, but can excessively impact search performance.
     */
    maxFuzzy?: number
    /**
     * Maximum number of results to return
     */
    topK?: number
    /**
     * Minimum score
     */
    minScore?: number
}

interface Retrieval {
    /**
     * Executers a web search with Tavily or Bing Search.
     * @param query
     */
    webSearch(
        query: string,
        options?: {
            count?: number
            provider?: "tavily" | "bing"
            /**
             * Return undefined when no web search providers are present
             */
            ignoreMissingProvider?: boolean
        }
    ): Promise<WorkspaceFile[]>

    /**
     * Search using similarity distance on embeddings
     */
    vectorSearch(
        query: string,
        files: (string | WorkspaceFile) | (string | WorkspaceFile)[],
        options?: VectorSearchOptions
    ): Promise<WorkspaceFile[]>

    /**
     * Loads or creates a file index using a vector index
     * @param options
     */
    index(id: string, options?: VectorIndexOptions): Promise<WorkspaceFileIndex>

    /**
     * Performs a fuzzy search over the files
     * @param query keywords to search
     * @param files list of files
     * @param options fuzzing configuration
     */
    fuzzSearch(
        query: string,
        files: WorkspaceFile | WorkspaceFile[],
        options?: FuzzSearchOptions
    ): Promise<WorkspaceFile[]>
}

interface ArrayFilter {
    /**
     * Selects the first N elements from the data
     */
    sliceHead?: number
    /**
     * Selects the last N elements from the data
     */
    sliceTail?: number
    /**
     * Selects the a random sample of N items in the collection.
     */
    sliceSample?: number
}

interface DataFilter extends ArrayFilter {
    /**
     * The keys to select from the object.
     * If a key is prefixed with -, it will be removed from the object.
     */
    headers?: ElementOrArray<string>
    /**
     * Removes items with duplicate values for the specified keys.
     */
    distinct?: ElementOrArray<string>
    /**
     * Sorts the data by the specified key(s)
     */
    sort?: ElementOrArray<string>
}

interface DefDataOptions
    extends Omit<ContextExpansionOptions, "maxTokens">,
        FenceFormatOptions,
        DataFilter,
        ContentSafetyOptions {
    /**
     * Output format in the prompt. Defaults to Markdown table rendering.
     */
    format?: "json" | "yaml" | "csv"

    /**
     * GROQ query to filter the data
     * @see https://groq.dev/
     */
    query?: string
}

interface DefSchemaOptions {
    /**
     * Output format in the prompt.
     */
    format?: "typescript" | "json" | "yaml"
}

type ChatFunctionArgs = { context: ToolCallContext } & Record<string, any>
type ChatFunctionHandler = (args: ChatFunctionArgs) => Awaitable<ToolCallOutput>
type ChatMessageRole = "user" | "assistant" | "system"

interface HistoryMessageUser {
    role: "user"
    content: string
}

interface HistoryMessageAssistant {
    role: "assistant"
    name?: string
    content: string
}

interface WriteTextOptions extends ContextExpansionOptions {
    /**
     * Append text to the assistant response. This feature is not supported by all models.
     * @deprecated
     */
    assistant?: boolean
    /**
     * Specifies the message role. Default is user
     */
    role?: ChatMessageRole
}

type PromptGenerator = (ctx: ChatGenerationContext) => Awaitable<unknown>

interface PromptGeneratorOptions
    extends ModelOptions,
        PromptSystemOptions,
        ContentSafetyOptions,
        SecretDetectionOptions,
        MetadataOptions {
    /**
     * Label for trace
     */
    label?: string

    /**
     * Write file edits to the file system
     */
    applyEdits?: boolean

    /**
     * Throws if the generation is not successful
     */
    throwOnError?: boolean
}

interface FileOutputOptions {
    /**
     * Schema identifier to validate the generated file
     */
    schema?: string
}

interface FileOutput {
    pattern: string[]
    description?: string
    options?: FileOutputOptions
}

interface ImportTemplateOptions {
    /**
     * Ignore unknown arguments
     */
    allowExtraArguments?: boolean

    /**
     * Template engine syntax
     */
    format?: "mustache" | "jinja"
}

interface PromptTemplateString {
    /**
     * Set a priority similar to CSS z-index
     * to control the trimming of the prompt when the context is full
     * @param priority
     */
    priority(value: number): PromptTemplateString
    /**
     * Sets the context layout flex weight
     */
    flex(value: number): PromptTemplateString
    /**
     * Applies jinja template to the string lazily
     * @param data jinja data
     */
    jinja(data: Record<string, any>): PromptTemplateString
    /**
     * Applies mustache template to the string lazily
     * @param data mustache data
     */
    mustache(data: Record<string, any>): PromptTemplateString
    /**
     * Sets the max tokens for this string
     * @param tokens
     */
    maxTokens(tokens: number): PromptTemplateString

    /**
     * Updates the role of the message
     */
    role(role: ChatMessageRole): PromptTemplateString

    /**
     * Configure the cacheability of the prompt.
     * @param value cache control type
     */
    cacheControl(value: PromptCacheControlType): PromptTemplateString
}

type ImportTemplateArgumentType =
    | Awaitable<string | number | boolean>
    | (() => Awaitable<string | number | boolean>)

/**
 * Represents the context for generating a chat turn in a prompt template.
 * Provides methods for importing templates, writing text, adding assistant responses,
 * creating template strings, fencing code blocks, defining variables, and logging.
 */
interface ChatTurnGenerationContext {
    importTemplate(
        files: ElementOrArray<string | WorkspaceFile>,
        arguments?: Record<string, ImportTemplateArgumentType>,
        options?: ImportTemplateOptions
    ): void
    writeText(body: Awaitable<string>, options?: WriteTextOptions): void
    assistant(
        text: Awaitable<string>,
        options?: Omit<WriteTextOptions, "assistant">
    ): void
    $(strings: TemplateStringsArray, ...args: any[]): PromptTemplateString
    fence(body: StringLike, options?: FenceOptions): void
    def(
        name: string,
        body:
            | string
            | WorkspaceFile
            | WorkspaceFile[]
            | ShellOutput
            | Fenced
            | RunPromptResult,
        options?: DefOptions
    ): string
    defImages(
        files: ElementOrArray<BufferLike>,
        options?: DefImagesOptions
    ): void
    defData(
        name: string,
        data: Awaitable<object[] | object>,
        options?: DefDataOptions
    ): string
    defDiff<T extends string | WorkspaceFile>(
        name: string,
        left: T,
        right: T,
        options?: DefDiffOptions
    ): string
    console: PromptGenerationConsole
}

interface FileUpdate {
    before: string
    after: string
    validation?: FileEditValidation
}

interface RunPromptResultPromiseWithOptions extends Promise<RunPromptResult> {
    options(values?: PromptGeneratorOptions): RunPromptResultPromiseWithOptions
}

interface DefToolOptions extends ContentSafetyOptions {
    /**
     * Maximum number of tokens per tool content response
     */
    maxTokens?: number

    /**
     * Suffix to identify the variant instantiation of the tool
     */
    variant?: string

    /**
     * Updated description for the variant
     */
    variantDescription?: string

    /**
     * Intent of the tool that will be used for LLM judge validation of the output.
     * `description` uses the tool description as the intent.
     * If the intent is a function, it must build a LLM-as-Judge prompt that emits OK/ERR categories.
     */
    intent?:
        | OptionsOrString<"description">
        | ((options: {
              tool: ToolDefinition
              args: any
              result: string
              generator: ChatGenerationContext
          }) => Awaitable<void>)
}

interface DefAgentOptions
    extends Omit<PromptGeneratorOptions, "label">,
        DefToolOptions {
    /**
     * Excludes agent conversation from agent memory
     */
    disableMemory?: boolean

    /**
     * Disable memory query on each query (let the agent call the tool)
     */
    disableMemoryQuery?: boolean
}

type ChatAgentHandler = (
    ctx: ChatGenerationContext,
    args: ChatFunctionArgs
) => Awaitable<unknown>

interface McpToolSpecification {
    /**
     * Tool identifier
     */
    id: string
    /**
     * The high level intent of the tool, which can be used for LLM judge validation.
     * `description` uses the tool description as the intent.
     */
    intent?: DefToolOptions["intent"]
}

interface McpServerConfig extends ContentSafetyOptions {
    /**
     * The executable to run to start the server.
     */
    command: OptionsOrString<"npx" | "uv" | "dotnet" | "docker" | "cargo">
    /**
     * Command line arguments to pass to the executable.
     */
    args: string[]
    /**
     * The server version
     */
    version?: string
    /**
     * The environment to use when spawning the process.
     *
     * If not specified, the result of getDefaultEnvironment() will be used.
     */
    env?: Record<string, string>
    /**
     * The working directory to use when spawning the process.
     *
     * If not specified, the current working directory will be inherited.
     */
    cwd?: string

    id: string
    options?: DefToolOptions

    /**
     * A list of allowed tools and their specifications. This filtering is applied
     * before computing the sha signature.
     */
    tools?: ElementOrArray<string | McpToolSpecification>

    /**
     * The sha signature of the tools returned by the server.
     * If set, the tools will be validated against this sha.
     * This is used to ensure that the tools are not modified by the server.
     */
    toolsSha?: string

    /**
     * Validates that each tool has responses related to their description.
     */
    intent?: DefToolOptions["intent"]

    generator?: ChatGenerationContext
}

type McpServersConfig = Record<string, Omit<McpServerConfig, "id" | "options">>

interface McpAgentServerConfig extends McpServerConfig {
    description: string
    instructions?: string
    /**
     * Maximum number of tokens per tool content response
     */
    maxTokens?: number
}

type McpAgentServersConfig = Record<
    string,
    Omit<McpAgentServerConfig, "id" | "options">
>

type ZodTypeLike = { _def: any; safeParse: any; refine: any }

type BufferLike =
    | string
    | WorkspaceFile
    | Buffer
    | Blob
    | ArrayBuffer
    | Uint8Array
    | ReadableStream
    | SharedArrayBuffer

type TranscriptionModelType = OptionsOrString<
    "openai:whisper-1" | "openai:gpt-4o-transcribe" | "whisperasr:default"
>

interface ImageGenerationOptions extends ImageTransformOptions, RetryOptions {
    model?: OptionsOrString<ModelImageGenerationType>
    /**
     * The quality of the image that will be generated.
     * auto (default value) will automatically select the best quality for the given model.
     * high, medium and low are supported for gpt-image-1.
     * high is supported for dall-e-3.
     * dall-e-2 ignores this flag
     */
    quality?: "auto" | "low" | "medium" | "high"
    /**
     * Image size.
     * For gpt-image-1: 1024x1024, 1536x1024 (landscape), 1024x1536 (portrait), or auto (default value)
     * For dall-e: 256x256, 512x512, or 1024x1024 for dall-e-2, and one of 1024x1024, 1792x1024.
     */
    size?: OptionsOrString<
        | "auto"
        | "landscape"
        | "portrait"
        | "square"
        | "1536x1024"
        | "1024x1536"
        | "256x256"
        | "512x512"
        | "1024x1024"
        | "1024x1792"
        | "1792x1024"
    >
    /**
     * Only used for DALL-E 3
     */
    style?: OptionsOrString<"vivid" | "natural">

    /**
     * For gpt-image-1 only, the type of image format to generate.
     */
    outputFormat?: "png" | "jpeg" | "webp"
}

interface TranscriptionOptions extends CacheOptions, RetryOptions {
    /**
     * Model to use for transcription. By default uses the `transcribe` alias.
     */
    model?: TranscriptionModelType

    /**
     * Translate to English.
     */
    translate?: boolean

    /**
     * Input language in iso-639-1 format.
     * @see https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
     */
    language?: string

    /**
     * The sampling temperature, between 0 and 1.
     * Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     */
    temperature?: number
}

interface TranscriptionResult {
    /**
     * Complete transcription text
     */
    text: string
    /**
     * Error if any
     */
    error?: SerializedError

    /**
     * SubRip subtitle string from segments
     */
    srt?: string

    /**
     * WebVTT subtitle string from segments
     */
    vtt?: string

    /**
     * Individual segments
     */
    segments?: (TranscriptionSegment & {
        /**
         * Seek offset of the segment
         */
        seek?: number
        /**
         * Temperature used for the generation of the segment
         */
        temperature?: number
    })[]
}

type SpeechModelType = OptionsOrString<
    "openai:tts-1-hd" | "openai:tts-1" | "openai:gpt-4o-mini-tts"
>

type SpeechVoiceType = OptionsOrString<
    | "alloy"
    | "ash"
    | "coral"
    | "echo"
    | "fable"
    | "onyx"
    | "nova"
    | "sage"
    | "shimmer"
    | "verse"
    | "ballad"
>

interface SpeechOptions extends CacheOptions, RetryOptions {
    /**
     * Speech to text model
     */
    model?: SpeechModelType

    /**
     * Voice to use (model-specific)
     */
    voice?: SpeechVoiceType

    /**
     * Control the voice of your generated audio with additional instructions. Does not work with tts-1 or tts-1-hd.
     */
    instructions?: string
}

interface SpeechResult {
    /**
     * Generate audio-buffer file
     */
    filename?: string
    /**
     * Error if any
     */
    error?: SerializedError
}

interface ChatGenerationContext extends ChatTurnGenerationContext {
    env: ExpansionVariables
    defSchema(
        name: string,
        schema: JSONSchema | ZodTypeLike,
        options?: DefSchemaOptions
    ): string
    defTool(
        tool: Omit<ToolCallback, "generator"> | McpServersConfig,
        options?: DefToolOptions
    ): void
    defTool(
        name: string,
        description: string,
        parameters: PromptParametersSchema | JSONSchema,
        fn: ChatFunctionHandler,
        options?: DefToolOptions
    ): void
    defAgent(
        name: string,
        description: string,
        fn: string | ChatAgentHandler,
        options?: DefAgentOptions
    ): void
    defChatParticipant(
        participant: ChatParticipantHandler,
        options?: ChatParticipantOptions
    ): void
    defFileOutput(
        pattern: ElementOrArray<string | WorkspaceFile>,
        description: string,
        options?: FileOutputOptions
    ): void
    runPrompt(
        generator: string | PromptGenerator,
        options?: PromptGeneratorOptions
    ): Promise<RunPromptResult>
    prompt(
        strings: TemplateStringsArray,
        ...args: any[]
    ): RunPromptResultPromiseWithOptions
    defFileMerge(fn: FileMergeHandler): void
    defOutputProcessor(fn: PromptOutputProcessorHandler): void
    transcribe(
        audio: string | WorkspaceFile,
        options?: TranscriptionOptions
    ): Promise<TranscriptionResult>
    speak(text: string, options?: SpeechOptions): Promise<SpeechResult>
    generateImage(
        prompt: string,
        options?: ImageGenerationOptions
    ): Promise<{ image: WorkspaceFile; revisedPrompt?: string }>
}

interface GenerationOutput {
    /**
     * full chat history
     */
    messages: ChatMessage[]

    /**
     * LLM output.
     */
    text: string

    /**
     * Reasoning produced by model
     */
    reasoning?: string

    /**
     * Parsed fence sections
     */
    fences: Fenced[]

    /**
     * Parsed data sections
     */
    frames: DataFrame[]

    /**
     * A map of file updates
     */
    fileEdits: Record<string, FileUpdate>

    /**
     * Generated annotations
     */
    annotations: Diagnostic[]

    /**
     * Schema definition used in the generation
     */
    schemas: Record<string, JSONSchema>

    /**
     * Output as JSON if parsable
     */
    json?: any

    /**
     * Usage stats
     */
    usage?: RunPromptUsage
}

type Point = {
    row: number
    column: number
}

interface SyntaxNode {
    id: number
    typeId: number
    grammarId: number
    type: string
    grammarType: string
    isNamed: boolean
    isMissing: boolean
    isExtra: boolean
    hasChanges: boolean
    hasError: boolean
    isError: boolean
    text: string
    parseState: number
    nextParseState: number
    startPosition: Point
    endPosition: Point
    startIndex: number
    endIndex: number
    parent: SyntaxNode | null
    children: Array<SyntaxNode>
    namedChildren: Array<SyntaxNode>
    childCount: number
    namedChildCount: number
    firstChild: SyntaxNode | null
    firstNamedChild: SyntaxNode | null
    lastChild: SyntaxNode | null
    lastNamedChild: SyntaxNode | null
    nextSibling: SyntaxNode | null
    nextNamedSibling: SyntaxNode | null
    previousSibling: SyntaxNode | null
    previousNamedSibling: SyntaxNode | null
    descendantCount: number

    equals(other: SyntaxNode): boolean
    toString(): string
    child(index: number): SyntaxNode | null
    namedChild(index: number): SyntaxNode | null
    childForFieldName(fieldName: string): SyntaxNode | null
    childForFieldId(fieldId: number): SyntaxNode | null
    fieldNameForChild(childIndex: number): string | null
    childrenForFieldName(
        fieldName: string,
        cursor: TreeCursor
    ): Array<SyntaxNode>
    childrenForFieldId(fieldId: number, cursor: TreeCursor): Array<SyntaxNode>
    firstChildForIndex(index: number): SyntaxNode | null
    firstNamedChildForIndex(index: number): SyntaxNode | null

    descendantForIndex(index: number): SyntaxNode
    descendantForIndex(startIndex: number, endIndex: number): SyntaxNode
    namedDescendantForIndex(index: number): SyntaxNode
    namedDescendantForIndex(startIndex: number, endIndex: number): SyntaxNode
    descendantForPosition(position: Point): SyntaxNode
    descendantForPosition(startPosition: Point, endPosition: Point): SyntaxNode
    namedDescendantForPosition(position: Point): SyntaxNode
    namedDescendantForPosition(
        startPosition: Point,
        endPosition: Point
    ): SyntaxNode
    descendantsOfType(
        types: String | Array<String>,
        startPosition?: Point,
        endPosition?: Point
    ): Array<SyntaxNode>

    walk(): TreeCursor
}

interface TreeCursor {
    nodeType: string
    nodeTypeId: number
    nodeStateId: number
    nodeText: string
    nodeId: number
    nodeIsNamed: boolean
    nodeIsMissing: boolean
    startPosition: Point
    endPosition: Point
    startIndex: number
    endIndex: number
    readonly currentNode: SyntaxNode
    readonly currentFieldName: string
    readonly currentFieldId: number
    readonly currentDepth: number
    readonly currentDescendantIndex: number

    reset(node: SyntaxNode): void
    resetTo(cursor: TreeCursor): void
    gotoParent(): boolean
    gotoFirstChild(): boolean
    gotoLastChild(): boolean
    gotoFirstChildForIndex(goalIndex: number): boolean
    gotoFirstChildForPosition(goalPosition: Point): boolean
    gotoNextSibling(): boolean
    gotoPreviousSibling(): boolean
    gotoDescendant(goalDescendantIndex: number): void
}

interface QueryCapture {
    name: string
    node: SyntaxNode
}

interface SgEdit {
    /** The start position of the edit */
    startPos: number
    /** The end position of the edit */
    endPos: number
    /** The text to be inserted */
    insertedText: string
}
interface SgPos {
    /** line number starting from 0 */
    line: number
    /** column number starting from 0 */
    column: number
    /** byte offset of the position */
    index?: number
}
interface SgRange {
    /** starting position of the range */
    start: SgPos
    /** ending position of the range */
    end: SgPos
}
interface SgMatcher {
    /** The rule object, see https://ast-grep.github.io/reference/rule.html */
    rule: SgRule
    /** See https://ast-grep.github.io/guide/rule-config.html#constraints */
    constraints?: Record<string, SgRule>
}
type SgStrictness = "cst" | "smart" | "ast" | "relaxed" | "signature"
interface SgPatternObject {
    context: string
    selector?: string //NamedKinds<M> // only named node types
    strictness?: SgStrictness
}
type SgPatternStyle = string | SgPatternObject
interface SgRule {
    /** A pattern string or a pattern object. */
    pattern?: SgPatternStyle
    /** The kind name of the node to match. You can look up code's kind names in playground. */
    kind?: string
    /** The exact range of the node in the source code. */
    range?: SgRange
    /** A Rust regular expression to match the node's text. https://docs.rs/regex/latest/regex/#syntax */
    regex?: string
    /**
     * `nthChild` accepts number, string or object.
     * It specifies the position in nodes' sibling list. */
    nthChild?: string | number

    // relational
    /**
     * `inside` accepts a relational rule object.
     * the target node must appear inside of another node matching the `inside` sub-rule. */
    inside?: SgRelation
    /**
     * `has` accepts a relational rule object.
     * the target node must has a descendant node matching the `has` sub-rule. */
    has?: SgRelation
    /**
     * `precedes` accepts a relational rule object.
     * the target node must appear before another node matching the `precedes` sub-rule. */
    precedes?: SgRelation
    /**
     * `follows` accepts a relational rule object.
     * the target node must appear after another node matching the `follows` sub-rule. */
    follows?: SgRelation
    // composite
    /**
     * A list of sub rules and matches a node if all of sub rules match.
     * The meta variables of the matched node contain all variables from the sub-rules. */
    all?: Array<SgRule>
    /**
     * A list of sub rules and matches a node if any of sub rules match.
     * The meta variables of the matched node only contain those of the matched sub-rule. */
    any?: Array<SgRule>
    /** A single sub-rule and matches a node if the sub rule does not match. */
    not?: SgRule
    /** A utility rule id and matches a node if the utility rule matches. */
    matches?: string
}
interface SgRelation extends SgRule {
    /**
     * Specify how relational rule will stop relative to the target node.
     */
    stopBy?: "neighbor" | "end" | SgRule
    /** Specify the tree-sitter field in parent node. Only available in has/inside rule. */
    field?: string
}

/**
 * A asp-grep node, SgNode, is an immutable node in the abstract syntax tree.
 */
interface SgNode {
    id(): number
    range(): SgRange
    isLeaf(): boolean
    isNamed(): boolean
    isNamedLeaf(): boolean
    text(): string
    matches(m: string | number): boolean
    inside(m: string | number): boolean
    has(m: string | number): boolean
    precedes(m: string | number): boolean
    follows(m: string | number): boolean
    kind(): any
    is(kind: string): boolean
    getMatch(mv: string): SgNode | null
    getMultipleMatches(m: string): Array<SgNode>
    getTransformed(m: string): string | null
    getRoot(): SgRoot
    children(): Array<SgNode>
    find(matcher: string | number | SgMatcher): SgNode | null
    findAll(matcher: string | number | SgMatcher): Array<SgNode>
    field(name: string): SgNode | null
    fieldChildren(name: string): SgNode[]
    parent(): SgNode | null
    child(nth: number): SgNode | null
    child(nth: number): SgNode | null
    ancestors(): Array<SgNode>
    next(): SgNode | null
    nextAll(): Array<SgNode>
    prev(): SgNode | null
    prevAll(): Array<SgNode>
    replace(text: string): SgEdit
    commitEdits(edits: Array<SgEdit>): string
}

interface SgRoot {
    /** Returns the root SgNode of the ast-grep instance. */
    root(): SgNode
    /**
     * Returns the path of the file if it is discovered by ast-grep's `findInFiles`.
     * Returns `"anonymous"` if the instance is created by `lang.parse(source)`.
     */
    filename(): string
}

type SgLang = OptionsOrString<
    | "html"
    | "js"
    | "javascript"
    | "ts"
    | "typescript"
    | "tsx"
    | "css"
    | "c"
    | "sql"
    | "angular"
    | "csharp"
    | "python"
    | "rust"
    | "elixir"
    | "haskell"
    | "go"
    | "dart"
    | "swift"
    | "scala"
>

interface SgChangeSet {
    count: number
    replace(node: SgNode, text: string): SgEdit
    commit(): WorkspaceFile[]
}

interface SgSearchOptions extends Omit<FindFilesOptions, "readText"> {
    /**
     * Restrict matches that are part of the diff.
     */
    diff?: string | ElementOrArray<DiffFile>
}

interface Sg {
    /**
     * Create a change set
     */
    changeset(): SgChangeSet
    parse(file: WorkspaceFile, options: { lang?: SgLang }): Promise<SgRoot>
    search(
        lang: SgLang,
        glob: ElementOrArray<string>,
        matcher: string | SgMatcher,
        options?: SgSearchOptions
    ): Promise<{
        /**
         * Number of files found
         */
        files: number
        /**
         * Each individual file matches as a node
         */
        matches: SgNode[]
    }>
}

interface DebugLogger {
    /**
     * Creates a debug logging function. Debug uses printf-style formatting. Below are the officially supported formatters:
     * - `%O`	Pretty-print an Object on multiple lines.
     * - `%o`	Pretty-print an Object all on a single line.
     * - `%s`	String.
     * - `%d`	Number (both integer and float).
     * - `%j`	JSON. Replaced with the string '[Circular]' if the argument contains circular references.
     * - `%%`	Single percent sign ('%'). This does not consume an argument.
     * @param category
     * @see https://www.npmjs.com/package/debug
     */
    (formatter: any, ...args: any[]): void
    /**
     * Indicates if this logger is enabled
     */
    enabled: boolean
    /**
     * The namespace of the logger provided when calling 'host.logger'
     */
    namespace: string
}

interface LoggerHost {
    /**
     * Creates a debug logging function. Debug uses printf-style formatting. Below are the officially supported formatters:
     * - `%O`	Pretty-print an Object on multiple lines.
     * - `%o`	Pretty-print an Object all on a single line.
     * - `%s`	String.
     * - `%d`	Number (both integer and float).
     * - `%j`	JSON. Replaced with the string '[Circular]' if the argument contains circular references.
     * - `%%`	Single percent sign ('%'). This does not consume an argument.
     * @param category
     * @see https://www.npmjs.com/package/debug
     */
    logger(category: string): DebugLogger
}

interface SgHost {
    /**
     * Gets an ast-grep instance
     */
    astGrep(): Promise<Sg>
}

interface ShellOptions {
    cwd?: string

    stdin?: string

    /**
     * Process timeout in  milliseconds, default is 60s
     */
    timeout?: number
    /**
     * trace label
     */
    label?: string

    /**
     * Ignore exit code errors
     */
    ignoreError?: boolean

    /**
     * Additional environment variables to set for the process.
     */
    env?: Record<string, string>

    /**
     * Inject the content of 'env' exclusively
     */
    isolateEnv?: boolean
}

interface ShellOutput {
    stdout?: string
    stderr?: string
    exitCode: number
    failed?: boolean
}

interface BrowserOptions {
    /**
     * Browser engine for this page. Defaults to chromium
     *
     */
    browser?: "chromium" | "firefox" | "webkit"

    /**
     * If specified, accepted downloads are downloaded into this directory. Otherwise, temporary directory is created and is deleted when browser is closed. In either case, the downloads are deleted when the browser context they were created in is closed.
     */
    downloadsPath?: string

    /**
     * Whether to run browser in headless mode. More details for Chromium and Firefox. Defaults to true unless the devtools option is true.
     */
    headless?: boolean

    /**
     * Specify environment variables that will be visible to the browser. Defaults to process.env.
     */
    env?: Record<string, string>
}

interface BrowseGotoOptions extends TimeoutOptions {
    /**
     * Referer header value. If provided it will take preference over the referer header value set by
     * [page.setExtraHTTPHeaders(headers)](https://playwright.dev/docs/api/class-page#page-set-extra-http-headers).
     */
    referer?: string

    /**
     * When to consider operation succeeded, defaults to `load`. Events can be either:
     * - `'domcontentloaded'` - consider operation to be finished when the `DOMContentLoaded` event is fired.
     * - `'load'` - consider operation to be finished when the `load` event is fired.
     * - `'networkidle'` - **DISCOURAGED** consider operation to be finished when there are no network connections for
     *   at least `500` ms. Don't use this method for testing, rely on web assertions to assess readiness instead.
     * - `'commit'` - consider operation to be finished when network response is received and the document started
     *   loading.
     */
    waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit"
}

interface BrowseSessionOptions
    extends BrowserOptions,
        BrowseGotoOptions,
        TimeoutOptions {
    /**
     * Creates a new context for the browser session
     */
    incognito?: boolean

    /**
     * Base url to use for relative urls
     * @link https://playwright.dev/docs/api/class-browser#browser-new-context-option-base-url
     */
    baseUrl?: string

    /**
     * Toggles bypassing page's Content-Security-Policy. Defaults to false.
     * @link https://playwright.dev/docs/api/class-browser#browser-new-context-option-bypass-csp
     */
    bypassCSP?: boolean

    /**
     * Whether to ignore HTTPS errors when sending network requests. Defaults to false.
     * @link https://playwright.dev/docs/api/class-browser#browser-new-context-option-ignore-https-errors
     */
    ignoreHTTPSErrors?: boolean

    /**
     * Whether or not to enable JavaScript in the context. Defaults to true.
     * @link https://playwright.dev/docs/api/class-browser#browser-new-context-option-java-script-enabled
     */
    javaScriptEnabled?: boolean

    /**
     * Enable recording video for all pages. Implies incognito mode.
     */
    recordVideo?:
        | boolean
        | {
              width: number
              height: number
          }

    /**
     * CDP connection string
     */
    connectOverCDP?: string
}

interface TimeoutOptions {
    /**
     * Maximum time in milliseconds. Default to no timeout
     */
    timeout?: number
}

interface ScreenshotOptions extends TimeoutOptions {
    quality?: number
    scale?: "css" | "device"
    type?: "png" | "jpeg"
    style?: string
}

interface PageScreenshotOptions extends ScreenshotOptions {
    fullPage?: boolean
    omitBackground?: boolean
    clip?: {
        x: number
        y: number
        width: number
        height: number
    }
}

interface BrowserLocatorSelector {
    /**
     * Allows locating elements by their ARIA role, ARIA attributes and accessible name.
     * @param role
     * @param options
     */
    getByRole(
        role:
            | "alert"
            | "alertdialog"
            | "application"
            | "article"
            | "banner"
            | "blockquote"
            | "button"
            | "caption"
            | "cell"
            | "checkbox"
            | "code"
            | "columnheader"
            | "combobox"
            | "complementary"
            | "contentinfo"
            | "definition"
            | "deletion"
            | "dialog"
            | "directory"
            | "document"
            | "emphasis"
            | "feed"
            | "figure"
            | "form"
            | "generic"
            | "grid"
            | "gridcell"
            | "group"
            | "heading"
            | "img"
            | "insertion"
            | "link"
            | "list"
            | "listbox"
            | "listitem"
            | "log"
            | "main"
            | "marquee"
            | "math"
            | "meter"
            | "menu"
            | "menubar"
            | "menuitem"
            | "menuitemcheckbox"
            | "menuitemradio"
            | "navigation"
            | "none"
            | "note"
            | "option"
            | "paragraph"
            | "presentation"
            | "progressbar"
            | "radio"
            | "radiogroup"
            | "region"
            | "row"
            | "rowgroup"
            | "rowheader"
            | "scrollbar"
            | "search"
            | "searchbox"
            | "separator"
            | "slider"
            | "spinbutton"
            | "status"
            | "strong"
            | "subscript"
            | "superscript"
            | "switch"
            | "tab"
            | "table"
            | "tablist"
            | "tabpanel"
            | "term"
            | "textbox"
            | "time"
            | "timer"
            | "toolbar"
            | "tooltip"
            | "tree"
            | "treegrid"
            | "treeitem",
        options?: {
            checked?: boolean
            disabled?: boolean
            exact?: boolean
            expanded?: boolean
            name?: string
            selected?: boolean
        } & TimeoutOptions
    ): BrowserLocator

    /**
     * Allows locating input elements by the text of the associated <label> or aria-labelledby element, or by the aria-label attribute.
     * @param name
     * @param options
     */
    getByLabel(
        name: string,
        options?: { exact?: boolean } & TimeoutOptions
    ): BrowserLocator

    /**
     * Allows locating elements that contain given text.
     * @param text
     * @param options
     */
    getByText(
        text: string,
        options?: { exact?: boolean } & TimeoutOptions
    ): BrowserLocator

    /** Locate element by the test id. */
    getByTestId(testId: string, options?: TimeoutOptions): BrowserLocator
}

/**
 * A Locator instance
 * @link https://playwright.dev/docs/api/class-locator
 */
interface BrowserLocator extends BrowserLocatorSelector {
    /**
     * When the locator points to a list of elements, this returns an array of locators, pointing to their respective elements.
     * locator.all() does not wait for elements to match the locator, and instead immediately returns whatever is present in the page.
     */
    all(): Promise<BrowserLocator[]>
    /**
     * Click an element
     * @link https://playwright.dev/docs/api/class-locator#locator-click
     */
    click(
        options?: { button: "left" | "right" | "middle" } & TimeoutOptions
    ): Promise<void>

    /**
     * Returns when element specified by locator satisfies the state option.
     * @link https://playwright.dev/docs/api/class-locator#locator-wait-for
     */
    waitFor(
        options?: {
            state: "attached" | "detached" | "visible" | "hidden"
        } & TimeoutOptions
    ): Promise<void>

    /**
     * Set a value to the input field.
     * @param value
     * @link https://playwright.dev/docs/api/class-locator#locator-fill
     */
    fill(value: string, options?: TimeoutOptions): Promise<void>

    /**
     * Returns the element.innerText.
     * @link https://playwright.dev/docs/api/class-locator#locator-inner-text
     */
    innerText(options?: TimeoutOptions): Promise<string>

    /**
     * Returns the element.innerHTML
     * @link https://playwright.dev/docs/api/class-locator#locator-inner-html
     */
    innerHTML(options?: TimeoutOptions): Promise<string>

    /**
     * Returns the element.textContent
     * @link https://playwright.dev/docs/api/class-locator#locator-text-content
     * @param options
     */
    textContent(options?: TimeoutOptions): Promise<string>

    /**
     * Returns the value for the matching <input> or <textarea> or <select> element.
     * @link https://playwright.dev/docs/api/class-locator#locator-input-value
     */
    inputValue(options?: TimeoutOptions): Promise<string>

    /**
     * Get the attribute value
     * @param name
     * @param options
     * @link https://playwright.dev/docs/api/class-locator#locator-get-attribute
     */
    getAttribute(name: string, options?: TimeoutOptions): Promise<null | string>

    /**
     * Clears the input field.
     * @link https://playwright.dev/docs/api/class-locator#locator-clear
     */
    clear(options?: TimeoutOptions): Promise<void>

    /**
     * Take a screenshot of the element matching the locator.
     * @link https://playwright.dev/docs/api/class-locator#locator-screenshot
     */
    screenshot(options?: ScreenshotOptions): Promise<Buffer>

    /**
     * This method waits for actionability checks, then tries to scroll element into view, unless it is completely visible as defined by IntersectionObserver's ratio.
     * @link https://playwright.dev/docs/api/class-locator#locator-scroll-into-view-if-needed
     */
    scrollIntoViewIfNeeded(options?: TimeoutOptions): Promise<void>

    /**
     * This method narrows existing locator according to the options, for example filters by text. It can be chained to filter multiple times.
     * @param options
     */
    filter(
        options: {
            has?: BrowserLocator
            hasNot?: BrowserLocator
            hasNotText?: string | RegExp
            hasText?: string | RegExp
        } & TimeoutOptions
    ): BrowserLocator
}

/**
 * Playwright Response instance
 * @link https://playwright.dev/docs/api/class-response
 */
interface BrowseResponse {
    /**
     * Contains a boolean stating whether the response was successful (status in the range 200-299) or not.
     * @link https://playwright.dev/docs/api/class-response#response-ok
     */
    ok(): boolean
    /**
     * Contains the status code of the response (e.g., 200 for a success).
     * @link https://playwright.dev/docs/api/class-response#response-status
     */
    status(): number
    /**
     * Contains the status text of the response (e.g. usually an "OK" for a success).
     * @link https://playwright.dev/docs/api/class-response#response-status-text
     */
    statusText(): string

    /**
     * Contains the URL of the response.
     * @link https://playwright.dev/docs/api/class-response#response-url
     */
    url(): string
}

interface BrowserJSHandle {}

interface BrowserElementHandle {}

interface BrowserVideo {
    /**
     * Returns the video path once the page is closed.
     */
    path(): Promise<string>
}

interface BrowserLocatorOptions {
    /**
     * Narrows down the results of the method to those which contain elements matching this relative locator. For example,
     * `article` that has `text=Playwright` matches `<article><div>Playwright</div></article>`.
     *
     * Inner locator **must be relative** to the outer locator and is queried starting with the outer locator match, not
     * the document root. For example, you can find `content` that has `div` in
     * `<article><content><div>Playwright</div></content></article>`. However, looking for `content` that has `article
     * div` will fail, because the inner locator must be relative and should not use any elements outside the `content`.
     *
     * Note that outer and inner locators must belong to the same frame. Inner locator must not contain
     * [FrameLocator](https://playwright.dev/docs/api/class-framelocator)s.
     */
    has?: BrowserLocator

    /**
     * Matches elements that do not contain an element that matches an inner locator. Inner locator is queried against the
     * outer one. For example, `article` that does not have `div` matches `<article><span>Playwright</span></article>`.
     *
     * Note that outer and inner locators must belong to the same frame. Inner locator must not contain
     * [FrameLocator](https://playwright.dev/docs/api/class-framelocator)s.
     */
    hasNot?: BrowserLocator

    /**
     * Matches elements that do not contain specified text somewhere inside, possibly in a child or a descendant element.
     * When passed a [string], matching is case-insensitive and searches for a substring.
     */
    hasNotText?: string | RegExp

    /**
     * Matches elements containing specified text somewhere inside, possibly in a child or a descendant element. When
     * passed a [string], matching is case-insensitive and searches for a substring. For example, `"Playwright"` matches
     * `<article><div>Playwright</div></article>`.
     */
    hasText?: string | RegExp
}

/**
 * A playwright Page instance
 * @link https://playwright.dev/docs/api/class-page
 */
interface BrowserPage extends BrowserLocatorSelector {
    /**
     * Returns the page's title.
     * @link https://playwright.dev/docs/api/class-page#page-title
     */
    title(): Promise<string>
    /**
     * Current page url
     * @link https://playwright.dev/docs/api/class-page#page-url
     */
    url(): string

    /**
     * Returns the main resource response. In case of multiple redirects, the navigation will resolve with the first non-redirect response.
     * @link https://playwright.dev/docs/api/class-page#page-goto
     * @param url
     * @param options
     */
    goto(
        url: string,
        options?: BrowseGotoOptions
    ): Promise<null | BrowseResponse>

    /**
     * Returns the buffer of the captured screenshot
     * @link https://playwright.dev/docs/api/class-page#page-screenshot
     */
    screenshot(options?: PageScreenshotOptions): Promise<Buffer>

    /**
     * Gets the full HTML contents of the page, including the doctype.
     * @link https://playwright.dev/docs/api/class-page#page-content
     */
    content(): Promise<string>

    /**
     * The method returns an element locator that can be used to perform actions on this page / frame.
     * @param selector A selector to use when resolving DOM element.
     * @link https://playwright.dev/docs/locators
     */
    locator(selector: string, options?: BrowserLocatorOptions): BrowserLocator

    /**
     * Closes the browser page, context and other resources.
     * If video recording is enabled, the video will be saved at this time.
     */
    close(): Promise<void>

    /**
     * Returns the value of the pageFunction evaluation.
     * @param fn
     * @param args serializable object
     * @link https://playwright.dev/docs/api/class-page#page-evaluate
     */
    evaluate<T = any>(pageFunction: Function | string, arg?: any): Promise<T>

    /**
     * Returns the value of the pageFunction evaluation as a JSHandle.
     * @param fn
     * @param args serializable object
     * @link https://playwright.dev/docs/api/class-page#page-evaluate-handle
     */
    evaluateHandle<T = any>(
        selector: string,
        arg?: any
    ): Promise<BrowserJSHandle>

    /**
     * Video object associated with this page, if `recordVideo` option is enabled.
     */
    video(): BrowserVideo | null

    /**
     * Adds a `<script>` tag into the page with the desired url or content. Returns the added tag when the script's onload
     * fires or when the script content was injected into frame.
     * @param options
     */
    addScriptTag(options?: {
        /**
         * Raw JavaScript content to be injected into frame.
         */
        content?: string

        /**
         * Path to the JavaScript file to be injected into frame. If `path` is a relative path, then it is resolved relative
         * to the current working directory.
         */
        path?: string

        /**
         * Script type. Use 'module' in order to load a JavaScript ES6 module. See
         * [script](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) for more details.
         */
        type?: string

        /**
         * URL of a script to be added.
         */
        url?: string
    }): Promise<BrowserElementHandle>

    /**
     * Adds a `<link rel="stylesheet">` tag into the page with the desired url or a `<style type="text/css">` tag with the
     * content. Returns the added tag when the stylesheet's onload fires or when the CSS content was injected into frame.
     * @param options
     */
    addStyleTag(options?: {
        /**
         * Raw CSS content to be injected into frame.
         */
        content?: string

        /**
         * Path to the CSS file to be injected into frame. If `path` is a relative path, then it is resolved relative to the
         * current working directory.
         */
        path?: string

        /**
         * URL of the `<link>` tag.
         */
        url?: string
    }): Promise<BrowserElementHandle>
}

interface ShellSelectOptions {}

interface ShellSelectChoice {
    name?: string
    value: string
    description?: string
}

interface ShellInputOptions {
    required?: boolean
}

interface ShellConfirmOptions {
    default?: boolean
}

interface ShellHost {
    /**
     * Executes a shell command
     * @param command
     * @param args
     * @param options
     */
    exec(commandWithArgs: string, options?: ShellOptions): Promise<ShellOutput>
    exec(
        command: string,
        args: string[],
        options?: ShellOptions
    ): Promise<ShellOutput>
}

interface McpToolReference {
    name: string
    description?: string
    inputSchema?: JSONSchema
}

interface McpResourceReference {
    name?: string
    description?: string
    uri: string
    mimeType?: string
}

interface McpServerToolResultTextPart {
    type: "text"
    text: string
}

interface McpServerToolResultImagePart {
    type: "image"
    data: string
    mimeType: string
}

interface McpServerToolResourcePart {
    type: "resource"
    text?: string
    uri?: string
    mimeType?: string
    blob?: string
}

type McpServerToolResultPart =
    | McpServerToolResultTextPart
    | McpServerToolResultImagePart
    | McpServerToolResourcePart

interface McpServerToolResult {
    isError?: boolean
    content: McpServerToolResultPart[]
    text?: string
}

interface McpClient extends AsyncDisposable {
    /**
     * Configuration of the server
     */
    readonly config: McpServerConfig

    /**
     * Pings the server
     */
    ping(): Promise<void>
    /**
     * List all available MCP tools
     */
    listTools(): Promise<McpToolReference[]>

    /**
     * List resources available in the server
     */
    listResources(): Promise<McpResourceReference[]>

    /**
     * Reads the resource content
     */
    readResource(uri: string): Promise<WorkspaceFile[]>

    /**
     *
     * @param name Call the MCP tool
     * @param args
     */
    callTool(
        name: string,
        args: Record<string, any>
    ): Promise<McpServerToolResult>

    /**
     * Closes clients and server.
     */
    dispose(): Promise<void>
}

interface McpHost {
    /**
     * Starts a Model Context Protocol server and returns a client.
     */
    mcpServer(config: McpServerConfig): Promise<McpClient>
}

interface ResourceReference {
    uri: string // Unique identifier for the resource
    name: string // Human-readable name
    description?: string // Optional description
    mimeType?: string // Optional MIME type
}

interface ResourceHost {
    /**
     * Publishes a resource that will be exposed through the MCP server protocol.
     * @param content
     */
    publishResource(
        name: string,
        content: BufferLike,
        options?: Partial<Pick<ResourceReference, "description" | "mimeType">> &
            SecretDetectionOptions
    ): Promise<string>

    /**
     * List available resource references
     */
    resources(): Promise<ResourceReference[]>
}

interface UserInterfaceHost {
    /**
     * Starts a headless browser and navigates to the page.
     * Requires to [install playwright and dependencies](https://microsoft.github.io/genaiscript/reference/scripts/browser).
     * @link https://microsoft.github.io/genaiscript/reference/scripts/browser
     * @param url
     * @param options
     */
    browse(url?: string, options?: BrowseSessionOptions): Promise<BrowserPage>

    /**
     * Asks the user to select between options
     * @param message question to ask
     * @param options options to select from
     */
    select(
        message: string,
        choices: (string | ShellSelectChoice)[],
        options?: ShellSelectOptions
    ): Promise<string>

    /**
     * Asks the user to input a text
     * @param message message to ask
     */
    input(message: string, options?: ShellInputOptions): Promise<string>

    /**
     * Asks the user to confirm a message
     * @param message message to ask
     */
    confirm(message: string, options?: ShellConfirmOptions): Promise<boolean>
}

interface ContainerPortBinding {
    containerPort: OptionsOrString<"8000/tcp">
    hostPort: string | number
}

interface ContainerOptions {
    /**
     * Container image names.
     * @example python:alpine python:slim python
     * @see https://hub.docker.com/_/python/
     */
    image?: OptionsOrString<
        "python:alpine" | "python:slim" | "python" | "node" | "gcc"
    >

    /**
     * Enable networking in container (disabled by default)
     */
    networkEnabled?: boolean

    /**
     * Environment variables in container. A null/undefined variable is removed from the environment.
     */
    env?: Record<string, string>

    /**
     * Assign the specified name to the container. Must match [a-zA-Z0-9_-]+.
     */
    name?: string

    /**
     * Disable automatic purge of container and volume directory and potentially reuse with same name, configuration.
     */
    persistent?: boolean

    /**
     * List of exposed TCP ports
     */
    ports?: ElementOrArray<ContainerPortBinding>

    /**
     * Commands to executes after the container is created
     */
    postCreateCommands?: ElementOrArray<string>
}

interface PromiseQueue {
    /**
     * Adds a new promise to the queue
     * @param fn
     */
    add<Arguments extends unknown[], ReturnType>(
        function_: (...arguments_: Arguments) => Awaitable<ReturnType>,
        ...arguments_: Arguments
    ): Promise<ReturnType>

    /**
     * Runs all the functions in the queue with limited concurrency
     * @param fns
     */
    all<T = any>(fns: (() => Awaitable<T>)[]): Promise<T[]>

    /**
     * Applies a function to all the values in the queue with limited concurrency
     * @param values
     * @param fn
     */
    mapAll<T extends unknown, Arguments extends unknown[], ReturnType>(
        values: T[],
        fn: (value: T, ...arguments_: Arguments) => Awaitable<ReturnType>,
        ...arguments_: Arguments
    ): Promise<ReturnType[]>
}

interface LanguageModelReference {
    provider: ModelProviderType
    model: ModelType
}

interface LanguageModelInfo {
    id: ModelType
    details?: string
    url?: string
    version?: string
    /**
     * Base model name
     */
    family?: string
}

interface LanguageModelProviderInfo {
    id: ModelProviderType
    error?: string
    models: LanguageModelInfo[]
}

interface LanguageModelHost {
    /**
     * Resolve a language model alias to a provider and model based on the current configuration
     * @param modelId
     */
    resolveLanguageModel(modelId?: ModelType): Promise<LanguageModelReference>

    /**
     * Returns the status of the model provider and list of models if available
     */
    resolveLanguageModelProvider(
        provider: ModelProviderType
    ): Promise<LanguageModelProviderInfo>
}

type ContentSafetyProvider = "azure"

interface ContentSafetyHost {
    /**
     * Resolve a content safety client
     * @param id safety detection project
     */
    contentSafety(id?: ContentSafetyProvider): Promise<ContentSafety>
}

interface RetryOptions {
    retryOn?: number[] // HTTP status codes to retry on
    retries?: number // Number of retry attempts
    retryDelay?: number // Initial delay between retries
    maxDelay?: number // Maximum delay between retries
}

interface CacheOptions {
    /**
     * By default, LLM queries are not cached.
     * If true, the LLM request will be cached. Use a string to override the default cache name
     */
    cache?: boolean | string
}

type FetchOptions = RequestInit & RetryOptions

type FetchTextOptions = Omit<FetchOptions, "body" | "signal" | "window"> & {
    convert?: "markdown" | "text" | "tables"
}

interface PythonRuntimeOptions {
    cache?: string
}

interface PythonRuntime {
    /**
     * Runs python code and returns the result
     * @param code python code
     */
    run(code: string): Promise<any>

    /**
     * Imports a package using micropip
     * @param pkg name and version
     */
    import(pkg: string): Promise<void>

    /**
     * Access to python global variables
     */
    globals: PythonProxy
}

interface PythonProxy {
    /**
     * Reads a value from the python object
     * @param name
     */
    get<T>(name: string): T
    /**
     * Copy a value into the python object
     * @param name
     * @param value
     */
    set<T>(name: string, value: T): void
}

interface PromptHost
    extends ShellHost,
        LoggerHost,
        McpHost,
        ResourceHost,
        UserInterfaceHost,
        LanguageModelHost,
        SgHost,
        Z3SolverHost,
        ContentSafetyHost {
    /**
     * A fetch wrapper with proxy, retry and timeout handling.
     */
    fetch(
        input: string | URL | globalThis.Request,
        init?: FetchOptions
    ): Promise<Response>

    /**
     * A function that fetches text from a URL or a file
     * @param url
     * @param options
     */
    fetchText(
        url: string | WorkspaceFile,
        options?: FetchTextOptions
    ): Promise<{
        ok: boolean
        status: number
        text?: string
        file?: WorkspaceFile
    }>

    /**
     * Opens a in-memory key-value cache for the given cache name. Entries are dropped when the cache grows too large.
     * @param cacheName
     */
    cache<K = any, V = any>(
        cacheName: string
    ): Promise<WorkspaceFileCache<K, V>>

    /**
     * Starts a container
     * @param options container creation options
     */
    container(options?: ContainerOptions): Promise<ContainerHost>

    /**
     * Create a new promise queue to run async functions with limited concurrency
     */
    promiseQueue(concurrency: number): PromiseQueue

    /**
     * Instantiates a python evaluation environment powered by pyodide (https://pyodide.org/)
     */
    python(options?: PythonRuntimeOptions): Promise<PythonRuntime>

    /**
     * Gets a client to a Microsoft Teams channel from a share link URL;
     * uses `GENAISCRIPT_TEAMS_CHANNEL_URL` environment variable if `shareUrl` is not provided.
     * Uses Azure CLI login for authentication.
     * @param url
     */
    teamsChannel(shareUrl?: string): Promise<MessageChannelClient>
}

interface WorkspaceFileWithDescription extends WorkspaceFile {
    /**
     * File description used for videos.
     */
    description?: string
}

/**
 * A client to a messaging channel
 */
interface MessageChannelClient {
    /**
     * Posts a message with attachments to the channel
     * @param message
     * @param options
     */
    postMessage(
        message: string,
        options?: {
            /**
             * File attachments that will be added in the channel folder
             */
            files?: (string | WorkspaceFileWithDescription)[]
            /**
             * Sets to false to remove AI generated disclaimer
             */
            disclaimer?: boolean | string
        }
    ): Promise<string>
}

interface ContainerHost extends ShellHost {
    /**
     * Container unique identifier in provider
     */
    id: string

    /**
     * Name assigned to the container. For persistent containers, also contains the sha of the options
     */
    name: string

    /**
     * Disable automatic purge of container and volume directory
     */
    persistent: boolean

    /**
     * Path to the volume mounted in the host
     */
    hostPath: string

    /**
     * Writes a file as text to the container file system
     * @param path
     * @param content
     */
    writeText(path: string, content: string): Promise<void>

    /**
     * Reads a file as text from the container mounted volume
     * @param path
     */
    readText(path: string): Promise<string>

    /**
     * Copies a set of files into the container
     * @param fromHost glob matching files
     * @param toContainer directory in the container
     */
    copyTo(
        fromHost: string | string[],
        toContainer: string,
        options?: Omit<FindFilesOptions, "readText">
    ): Promise<string[]>

    /**
     * List files in a directory in the container
     * @param dir
     */
    listFiles(dir: string): Promise<string[]>

    /**
     * Stops and cleans out the container
     */
    stop(): Promise<void>

    /**
     * Pause container
     */
    pause(): Promise<void>

    /**
     * Resume execution of the container
     */
    resume(): Promise<void>

    /**
     * Force disconnect network
     */
    disconnect(): Promise<void>

    /**
     * A promise queue of concurrency 1 to run serialized functions against the container
     */
    scheduler: PromiseQueue
}

interface PromptContext extends ChatGenerationContext {
    script(options: PromptArgs): void
    system(options: PromptSystemArgs): void
    path: Path
    parsers: Parsers
    retrieval: Retrieval
    /**
     * @deprecated Use `workspace` instead
     */
    fs: WorkspaceFileSystem
    workspace: WorkspaceFileSystem
    host: PromptHost
}
