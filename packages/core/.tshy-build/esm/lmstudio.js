// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { MODEL_PROVIDER_LMSTUDIO, SUCCESS_ERROR_CODE } from "./constants.js";
import { OpenAIChatCompletion, OpenAIEmbedder, OpenAIListModels } from "./openai.js";
import { execa } from "execa";
import { logVerbose } from "./util.js";
const pullModel = async (cfg, _options) => {
    const model = cfg.model;
    logVerbose(`lms get ${model} --yes`);
    const res = await execa({ stdout: ["inherit"] }) `lms get ${model} --yes`;
    return {
        ok: res.exitCode === SUCCESS_ERROR_CODE,
    };
};
// Define the Ollama model with its completion handler and model listing function
export const LMStudioModel = Object.freeze({
    id: MODEL_PROVIDER_LMSTUDIO,
    completer: OpenAIChatCompletion,
    listModels: OpenAIListModels,
    pullModel,
    embedder: OpenAIEmbedder,
});
