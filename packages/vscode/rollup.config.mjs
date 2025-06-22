import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "dist/src/extension.js",
  output: {
    dir: "dist/bundle",
    format: "esm",
    sourcemap: true,
    inlineDynamicImports: true,
  },
  external: [
    "../build/Release/cpufeatures.node",
    "https://cdn.skypack.dev/@mozilla/readability",
    "@ast-grep/napi",
    "@ast-grep/napi-darwin-arm64",
    "@ast-grep/napi-darwin-x64",
    "@ast-grep/napi-linux-arm64-gnu",
    "@ast-grep/napi-linux-arm64-musl",
    "@ast-grep/napi-linux-x64-gnu",
    "@ast-grep/napi-linux-x64-musl",
    "@napi-rs/canvas",
    "@napi-rs/canvas-darwin-arm64",
    "@napi-rs/canvas-darwin-x64",
    "@napi-rs/canvas-linux-arm64-gnu",
    "@napi-rs/canvas-linux-arm64-musl",
    "@napi-rs/canvas-linux-x64-gnu",
    "@napi-rs/canvas-linux-x64-musl",
    "chromium-bidi",
    "chromium-bidi/lib/cjs/cdp/CdpConnection",
    "chromium-bidi/lib/cjs/bidiMapper/BidiMapper",
    "cpu-features",
    "node:sqlite",
    "npm-run-path",
    "unicorn-magic",
    "vscode"
  ],
  plugins: [
    commonjs(),
    resolve({ preferBuiltins: true }),
    json(),
  ],
};
