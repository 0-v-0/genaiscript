import { resolve } from "node:path"
import { deleteUndefinedValues } from "../../core/src/cleaners"
import { GENAI_ANY_REGEX } from "../../core/src/constants"
import { genaiscriptDebug } from "../../core/src/debug"
import { nodeTryReadPackage } from "../../core/src/nodepackage"
import { CORE_VERSION } from "../../core/src/version"
import { YAMLStringify } from "../../core/src/yaml"
import { buildProject } from "./build"
import { snakeCase } from "es-toolkit"
import { logInfo, logVerbose } from "../../core/src/util"
import { dotGenaiscriptPath } from "../../core/src/workdir"
import { writeText } from "../../core/src/fs"
import { dedent } from "../../core/src/indent"
import { runtimeHost } from "../../core/src/host"
const dbg = genaiscriptDebug("cli:action")

interface GitHubActionFieldType {
    description: string
    required: boolean
    default?: string
}

export async function actionConfigure(
    scriptId: string,
    options: {
        out?: string
        ffmpeg?: boolean
        playwright?: boolean
        packageLock?: boolean
    }
) {
    const prj = await buildProject() // Build the project to get script templates
    const script = prj.scripts.find(
        (t) =>
            t.id === scriptId ||
            (t.filename &&
                GENAI_ANY_REGEX.test(scriptId) &&
                resolve(t.filename) === resolve(scriptId))
    )
    if (!script) throw new Error(`Script with id "${scriptId}" not found.`)
    const {
        out = dotGenaiscriptPath("action", script.id),
        ffmpeg,
        playwright,
        packageLock,
    } = options || {}

    logInfo(`Generating GitHub Action for ${script.id} (${script.filename})`)
    const { inputSchema, branding } = script
    const scriptSchema = (inputSchema?.properties
        .script as JSONSchemaObject) || {
        type: "object",
        properties: {},
        required: [],
    }
    const inputs: Record<string, GitHubActionFieldType> = {
        ...Object.fromEntries(
            Object.entries(scriptSchema.properties).map(([key, value]) => {
                return [
                    snakeCase(key),
                    {
                        description:
                            (value as JSONSchemaDescribed).description || "",
                        required: scriptSchema.required?.includes(key) || false,
                        default: (value as any).default ?? undefined,
                    } satisfies GitHubActionFieldType,
                ]
            })
        ),
        github_token: {
            description:
                "GitHub token with `models: read` permission at least.",
            required: true,
        },
    }
    const outputs: Record<string, GitHubActionFieldType> = {}
    const pkg = (await nodeTryReadPackage()) || {}

    const apks = [
        "git",
        "python3",
        "py3-pip",
        ffmpeg ? "ffmpeg" : undefined,
    ].filter(Boolean)

    const writeFile = async (name: string, content: string) => {
        const filePath = resolve(out, name)
        logVerbose(`writing ${filePath}`)
        await writeText(filePath, content)
    }

    await writeFile(
        "action.yml",
        YAMLStringify(
            deleteUndefinedValues({
                name: script.id,
                author: pkg.author || undefined,
                description: script.title || "GitHub Action for " + script.id,
                inputs,
                outputs,
                branding,
                runs: {
                    using: "docker",
                    image: "Dockerfile",
                },
            })
        )
    )

    await writeFile(
        "Dockerfile",
        dedent`FROM node:22-alpine

# Install packages
RUN apk add --no-cache ${apks.join(" ")}

# Set working directory
WORKDIR /genaiscript/action

# Copy source code
COPY . .

# Install dependencies
RUN npm ${packageLock ? "ci" : "install"}

${
    playwright
        ? dedent`# Install playwright dependencies
RUN npm run install:playwright

`
        : ""
}
# GitHub Action forces the WORKDIR to GITHUB_WORKSPACE 
ENTRYPOINT ["npm", "--prefix", "/genaiscript/action", "start"]
`
    )
    await writeFile(
        "README.md",
        dedent`# ${script.id} action

A custom GitHub Action that runs the script \`${script.id}\`.

${script.description || ""}

## Inputs

${Object.entries(inputs || {})
    .map(
        ([key, value]) =>
            `- \`${key}\`: ${value.description}${
                value.required ? " (required)" : ""
            }${value.default ? ` (default: \`${value.default}\`)` : ""}`
    )
    .join("\n")}
## Outputs

${Object.entries(outputs || {})
    .map(
        ([key, value]) =>
            `- \`${key}\`: ${value.description || ""}${
                value.required ? " (required)" : ""
            }${value.default ? ` (default: \`${value.default}\`)` : ""}`
    )
    .join("\n")}
## Usage

\`\`\`yaml
uses: ${script.id}-action
with:
${Object.keys(inputs || {})
    .map((key) => `  ${key}: \${{ ... }}`)
    .join("\n")}
\`\`\`

## Example

\`\`\`yaml
name: Run ${script.id} Action
on:
    workflow_dispatch:
    push:
permissions:
    contents: read
    models: read
concurrency:
    group: ${script.id}-\${{ github.workflow }}-\${{ github.ref }}
    cancel-in-progress: true
jobs:
  run-script:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Run ${script.id} Action
        uses: ${script.id}-action@main
        with:
${Object.entries(inputs || {})
    .map(
        ([key, value]) =>
            `          ${key}: \${{ inputs.${key} || "${value.default || ""}" }}`
    )
    .join("\n")}
\`\`\`
`
    )
    await writeFile(
        ".gitignore",
        dedent`node_modules
.genaiscript
.env
.*.env
.env.*
`
    )

    await writeFile(
        "package.json",
        JSON.stringify(
            deleteUndefinedValues({
                name: script.id + "-action",
                version: CORE_VERSION,
                description:
                    script.description || "GitHub Action for " + script.id,
                dependencies: {
                    ...(pkg.dependencies || {}),
                    genaiscript: "^" + CORE_VERSION,
                },
                scripts: {
                    "install:playwright":
                        "npx playwright install && npx playwright install-deps",
                    start: `genaiscript run ${scriptId}`,
                },
            }),
            null,
            2
        )
    )

    // generate package-lock.json
    if (packageLock) {
        logVerbose("generating package-lock.json")
        await runtimeHost.exec(undefined, "node", ["install"], {
            cwd: out,
        })
    }
}
