// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Decodes a base64 string into a Uint8Array.
 * @param base64 - The base64 encoded string.
 * @returns Uint8Array of decoded bytes.
 */
export function fromBase64(base64: string): Uint8Array {
  return new Uint8Array(Buffer.from(base64, "base64"));
}

/**
 * Encodes a string or Uint8Array into a base64 string.
 * @param input - The string or Uint8Array to encode.
 * @returns Base64 encoded string.
 */
export function toBase64(input: string | Uint8Array): string {
  let bytes: Uint8Array;
  if (typeof input === "string") {
    bytes = Buffer.from(input, "utf-8");
  } else {
    bytes = input;
  }
  return Buffer.from(bytes).toString("base64");
}
