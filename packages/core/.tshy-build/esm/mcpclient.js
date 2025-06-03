// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { arrayify, logError, logVerbose } from "./util.js";
import { errorMessage } from "./error.js";
import { toSignal } from "./cancellation.js";
import { deleteUndefinedValues } from "./cleaners.js";
import { hash } from "./crypto.js";
import { fileWriteCachedJSON } from "./filecache.js";
import { dotGenaiscriptPath } from "./workdir.js";
import { YAMLStringify } from "./yaml.js";
import { resolvePromptInjectionDetector } from "./contentsafety.js";
import { genaiscriptDebug } from "./debug.js";
const dbg = genaiscriptDebug("mcp:client");
function toolResultContentToText(res) {
    const content = res.content;
    let text = arrayify(content)
        ?.map((c) => {
        switch (c.type) {
            case "text":
                return c.text || "";
            case "image":
                return c.data;
            case "resource":
                return c.resource?.uri || "";
            default:
                return c;
        }
    })
        .join("\n");
    if (res.isError) {
        dbg(`tool error: ${text}`);
        text = `Tool Error:\n${text}`;
    }
    return text;
}
function resolveMcpEnv(_env) {
    if (!_env)
        return _env;
    const res = structuredClone(_env);
    Object.entries(res)
        .filter(([k, v]) => v === "")
        .forEach(([key, value]) => {
        dbg(`filling env var: %s`, key);
        res[key] = process.env[key] || "";
    });
    return res;
}
export class McpClientManager extends EventTarget {
    _clients = [];
    constructor() {
        super();
    }
    async startMcpServer(serverConfig, options) {
        const { cancellationToken } = options || {};
        logVerbose(`mcp: starting ` + serverConfig.id);
        const signal = toSignal(cancellationToken);
        const { id, version = "1.0.0", toolsSha, detectPromptInjection, contentSafety, tools: _toolsConfig, generator, intent, env: unresolvedEnv, ...rest } = serverConfig;
        const mcpEnv = resolveMcpEnv(unresolvedEnv);
        const toolSpecs = arrayify(_toolsConfig).map(toMcpToolSpecification);
        const commonToolOptions = deleteUndefinedValues({
            contentSafety,
            detectPromptInjection,
            intent,
        });
        // genaiscript:mcp:id
        const dbgc = dbg.extend(id);
        dbgc(`starting`);
        const trace = options.trace.startTraceDetails(`🪚 mcp ${id}`);
        try {
            const { Client } = await import("@modelcontextprotocol/sdk/client/index.js");
            const { StdioClientTransport } = await import("@modelcontextprotocol/sdk/client/stdio.js");
            const progress = (msg) => (ev) => dbgc(msg + " ", `${ev.progress || ""}/${ev.total || ""}`);
            const capabilities = { tools: {} };
            dbgc(`creating transport %O`, deleteUndefinedValues({
                ...rest,
                env: mcpEnv ? Object.keys(mcpEnv) : undefined,
            }));
            let transport = new StdioClientTransport(deleteUndefinedValues({
                ...rest,
                env: mcpEnv,
                stderr: "inherit",
            }));
            let client = new Client({ name: id, version }, { capabilities });
            dbgc(`connecting stdio transport`);
            await client.connect(transport);
            const ping = async () => {
                dbgc(`ping`);
                await client.ping({ signal });
            };
            const listTools = async () => {
                dbgc(`listing tools`);
                const { tools } = await client.listTools({}, { signal, onprogress: progress("list tools") });
                return tools.map((t) => ({
                    name: t.name,
                    description: t.description,
                    inputSchema: t.inputSchema,
                }));
            };
            const listToolCallbacks = async () => {
                // list tools
                dbgc(`listing tools`);
                let { tools: toolDefinitions } = await client.listTools({}, { signal, onprogress: progress("list tools") });
                trace.fence(toolDefinitions.map(({ name, description }) => ({
                    name,
                    description,
                })), "json");
                const toolsFile = await fileWriteCachedJSON(dotGenaiscriptPath("mcp", id, "tools"), toolDefinitions);
                logVerbose(`mcp ${id}: tools: ${toolsFile}`);
                // apply filter
                if (toolSpecs.length > 0) {
                    dbg(`filtering tools`);
                    trace.fence(toolSpecs, "json");
                    toolDefinitions = toolDefinitions.filter((tool) => toolSpecs.some((s) => s.id === tool.name));
                    dbg(`filtered tools: %d`, toolDefinitions.map((t) => t.name).join(", "));
                }
                const sha = await hash(JSON.stringify(toolDefinitions));
                trace.itemValue("tools sha", sha);
                logVerbose(`mcp ${id}: tools sha: ${sha}`);
                if (toolsSha !== undefined) {
                    if (sha === toolsSha)
                        logVerbose(`mcp ${id}: tools signature validated successfully`);
                    else {
                        logError(`mcp ${id}: tools signature changed, please review the tools and update 'toolsSha' in the mcp server configuration.`);
                        throw new Error(`mcp ${id} tools signature changed`);
                    }
                }
                if (detectPromptInjection) {
                    const detector = await resolvePromptInjectionDetector(serverConfig, {
                        trace,
                        cancellationToken,
                    });
                    const result = await detector(YAMLStringify(toolDefinitions));
                    if (result.attackDetected) {
                        dbgc("%O", result);
                        throw new Error(`mcp ${id}: prompt injection detected in tools`);
                    }
                }
                const tools = toolDefinitions.map(({ name, description, inputSchema }) => {
                    const toolSpec = toolSpecs.find(({ id }) => id === name);
                    const toolOptions = {
                        ...commonToolOptions,
                        ...(toolSpec || {}),
                    };
                    return {
                        spec: {
                            name: `${id}_${name}`,
                            description,
                            parameters: inputSchema,
                        },
                        options: toolOptions,
                        generator,
                        impl: async (args) => {
                            const { context, ...restArgs } = args;
                            const res = await client.callTool({
                                name: name,
                                arguments: restArgs,
                            }, undefined, {
                                signal,
                                onprogress: progress(`tool call ${name} `),
                            });
                            const text = res?.text;
                            return text;
                        },
                    };
                });
                dbgc(`tools (imported): %O`, tools.map((t) => t.spec));
                return tools;
            };
            const readResource = async (uri) => {
                dbgc(`read resource ${uri}`);
                const res = await client.readResource({ uri });
                const contents = res.contents;
                return contents?.map((content) => deleteUndefinedValues({
                    content: content.text
                        ? String(content.text)
                        : content.blob
                            ? Buffer.from(content.blob).toString("base64")
                            : undefined,
                    encoding: content.blob ? "base64" : undefined,
                    filename: content.uri,
                    type: content.mimeType,
                }));
            };
            const listResources = async () => {
                const { resources } = await client.listResources({}, { signal, onprogress: progress("list resources") });
                return resources.map((r) => ({
                    name: r.name,
                    description: r.description,
                    uri: r.uri,
                    mimeType: r.mimeType,
                }));
            };
            const dispose = async () => {
                dbgc(`disposing`);
                const i = this._clients.indexOf(res);
                if (i >= 0)
                    this._clients.splice(i, 1);
                try {
                    await client.close();
                    client = undefined;
                }
                catch (err) {
                    dbgc(`error closing client: ${errorMessage(err)}`);
                }
                try {
                    await transport.close();
                    transport = undefined;
                }
                catch (err) {
                    dbgc(`error closing transport: ${errorMessage(err)}`);
                }
            };
            const callTool = async (toolId, args) => {
                const responseSchema = undefined;
                const callRes = await client.callTool({
                    name: toolId,
                    arguments: args,
                }, responseSchema, {
                    signal,
                    onprogress: progress(`tool call ${toolId} `),
                });
                return deleteUndefinedValues({
                    isError: callRes.isError,
                    content: callRes.content,
                    text: toolResultContentToText(callRes),
                });
            };
            const res = Object.freeze({
                config: Object.freeze({ ...serverConfig }),
                ping,
                listTools,
                listToolCallbacks,
                callTool,
                listResources,
                readResource,
                dispose,
                [Symbol.asyncDispose]: dispose,
            });
            this._clients.push(res);
            return res;
        }
        finally {
            trace.endDetails();
        }
    }
    get clients() {
        return this._clients.slice(0);
    }
    async dispose() {
        const clients = this._clients.slice(0);
        for (const client of clients) {
            await client.dispose();
        }
    }
    async [Symbol.asyncDispose]() { }
}
function toMcpToolSpecification(spec) {
    if (typeof spec === "string")
        return { id: spec };
    else
        return spec;
}
