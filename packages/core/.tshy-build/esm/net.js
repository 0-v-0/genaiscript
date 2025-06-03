// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/**
 * Finds a random open port on the system.
 *
 * @returns A promise that resolves to an available port number.
 */
export function findRandomOpenPort() {
    return new Promise((resolve, reject) => {
        const server = require("net").createServer();
        server.unref();
        server.on("error", reject);
        server.listen(0, () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });
    });
}
/**
 * Checks if a specific port is in use.
 *
 * @param port The port number to check.
 * @returns A promise that resolves to true if the port is in use, or false otherwise.
 */
export function isPortInUse(port) {
    return new Promise((resolve, reject) => {
        const server = require("net").createServer();
        server.once("error", (err) => {
            if (err.code === "EADDRINUSE") {
                resolve(true);
            }
            else {
                reject(err);
            }
        });
        server.once("listening", () => {
            server.close(() => resolve(false));
        });
        server.listen(port);
    });
}
