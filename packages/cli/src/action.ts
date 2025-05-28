import { resolve } from "node:path"
import { filterScripts, ScriptFilterOptions } from "../../core/src/ast"
import { deleteUndefinedValues } from "../../core/src/cleaners"
import { GENAI_ANY_REGEX } from "../../core/src/constants"
import { genaiscriptDebug } from "../../core/src/debug"
import { tryReadJSON } from "../../core/src/fs"
import { nodeTryReadPackage } from "../../core/src/nodepackage"
import { CORE_VERSION } from "../../core/src/version"
import { YAMLStringify } from "../../core/src/yaml"
import { buildProject } from "./build"
import { snakeCase } from "es-toolkit"
const dbg = genaiscriptDebug("cli:action")

export async function actionConfigure(scriptId: string) {
    const prj = await buildProject() // Build the project to get script templates
    const script = prj.scripts.find(
        (t) =>
            t.id === scriptId ||
            (t.filename &&
                GENAI_ANY_REGEX.test(scriptId) &&
                resolve(t.filename) === resolve(scriptId))
    )
    if (!script) throw new Error(`Script with id "${scriptId}" not found.`)

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
    const outputs = {
        text: {
            description: "The generated text.",
        },
    }
    const pkg = await nodeTryReadPackage()
    const files: Record<string, string> = {
        "action.yml": YAMLStringify(
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
        ),
        "package.json": JSON.stringify(
            deleteUndefinedValues({
                name: pkg?.name || undefined,
                version: pkg?.version || "0.0.0",
                dependencies: {
                    genaiscript: `^${CORE_VERSION}`,
                },
            })
        ),
        Dockerfile: `FROM node:22-alpine

# Set working directory
WORKDIR /usr/src
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

ENTRYPOINT ["/usr/src/entrypoint.sh"]`,
        "entrypoint.sh": `#!/bin/sh -l
set -e

# GitHub Actions forces the workdir to be /github/workspace, 
# so we need to set the working directory to the location of this script
# so that things actually work.
cd "$(dirname "$0")"

# GenAIScript expects GITHUB_TOKEN to be set in the environment
export GITHUB_TOKEN="\${INPUT_GITHUB_TOKEN}"

npx genaiscript run genaisrc/summarize.genai.mts --vars issue_num=\${INPUT_GITHUB_ISSUE} target_length=\${INPUT_TARGET_LENGTH}`,
    }

    for (const [key, value] of Object.entries(files)) {
    }
}
