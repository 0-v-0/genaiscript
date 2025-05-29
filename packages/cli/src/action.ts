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
const dbg = genaiscriptDebug("cli:action")

export async function actionConfigure(
    scriptId: string,
    options: {
        out?: string
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
    const { out = dotGenaiscriptPath("action", script.id) } = options || {}

    logInfo(`Generating GitHub Action for ${script.id} (${script.filename})`)
    const { inputSchema } = script
    const scriptSchema = (inputSchema?.properties
        .script as JSONSchemaObject) || {
        type: "object",
        properties: {},
        required: [],
    }
    const inputs = {
        ...Object.fromEntries(
            Object.entries(scriptSchema.properties).map(([key, value]) => {
                return [
                    snakeCase(key),
                    {
                        description:
                            (value as JSONSchemaDescribed).description || "",
                        required: scriptSchema.required?.includes(key) || false,
                        default: (value as any).default || undefined,
                    },
                ]
            })
        ),
        github_token: {
            description: "GitHub token for accessing the repository.",
            required: false,
            default: "${{ secrets.GITHUB_TOKEN }}",
        },
    }
    const outputs = {}
    const pkg = (await nodeTryReadPackage()) || {}

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
                description: script.description || pkg.description,
                inputs,
                outputs,
                runs: {
                    using: "docker",
                    image: "Dockerfile",
                },
            })
        )
    )

    await writeFile(
        "Dockerfile",
        `FROM node:22-alpine

# Install git, python3, and pip
RUN apk add --no-cache git python3 py3-pip

# Set working directory
WORKDIR /usr/src
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

ENTRYPOINT ["npx", "--yes", "genaiscript", "run", "${scriptId}"]`
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
                    start: `npx genaiscript run ${scriptId}`,
                },
            }),
            null,
            2
        )
    )
}
