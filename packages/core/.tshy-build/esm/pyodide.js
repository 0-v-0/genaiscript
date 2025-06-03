// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { dotGenaiscriptPath } from "./workdir.js";
import { hash } from "./crypto.js";
import { deleteUndefinedValues } from "./cleaners.js";
import { dedent } from "./indent.js";
import { PLimitPromiseQueue } from "./concurrency.js";
import { stderr } from "./stdio.js";
class PyProxy {
    runtime;
    proxy;
    constructor(runtime, proxy) {
        this.runtime = runtime;
        this.proxy = proxy;
    }
    get(name) {
        return toJs(this.proxy.get(name));
    }
    set(name, value) {
        const p = this.runtime.toPy(value);
        this.proxy.set(name, p);
    }
}
function toJs(res) {
    return typeof res?.toJs === "function" ? res.toJs() : res;
}
class PyodideRuntime {
    version;
    runtime;
    queue = new PLimitPromiseQueue(1);
    micropip;
    constructor(version, runtime) {
        this.version = version;
        this.runtime = runtime;
    }
    get globals() {
        return new PyProxy(this.runtime, this.runtime.globals);
    }
    async import(pkg) {
        await this.queue.add(async () => {
            if (!this.micropip) {
                await this.runtime.loadPackage("micropip");
                this.micropip = this.runtime.pyimport("micropip");
            }
            await this.micropip.install(pkg);
        });
    }
    async run(code) {
        return await this.queue.add(async () => {
            const d = dedent(code);
            const res = await this.runtime.runPythonAsync(d);
            const r = toJs(res);
            return r;
        });
    }
}
/**
 * Creates and initializes a Python runtime environment using Pyodide.
 *
 * @param options - Optional settings to configure the Python runtime and tracing behavior.
 *   - cache: Controls caching behavior for loaded Python packages.
 *   - trace options: Options for enabling and handling tracing during runtime operations.
 * @returns A Promise resolving to an instance of the Python runtime environment.
 *
 * The function sets up Pyodide, configures caching, handles package installations,
 * and mounts the current workspace directory. The created runtime allows execution
 * of Python code and interaction with Python globals.
 */
export async function createPythonRuntime(options) {
    const { cache } = options ?? {};
    const { loadPyodide, version } = await import("pyodide");
    const sha = await hash({ cache, version: true, pyodide: version });
    const pyodide = await loadPyodide(deleteUndefinedValues({
        packageCacheDir: dotGenaiscriptPath("cache", "python", sha),
        stdout: (msg) => stderr.write(msg),
        stderr: (msg) => stderr.write(msg),
        checkAPIVersion: true,
    }));
    await pyodide.mountNodeFS("/workspace", process.cwd());
    return new PyodideRuntime(version, pyodide);
}
