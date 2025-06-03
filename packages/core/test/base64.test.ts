// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { fromBase64, toBase64 } from "../src/base64.js";

describe("Base64", async () => {
  const testString = "Hello World!";
  const testBase64 = "SGVsbG8gV29ybGQh";

  await test("toBase64 encodes string to base64", () => {
    const result = toBase64(testString);
    assert.equal(result, testBase64);
  });

  await test("fromBase64 throws on invalid base64", () => {
    assert.throws(() => fromBase64("invalid base64!"));
  });
});
