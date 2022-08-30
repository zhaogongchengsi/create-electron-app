import { isArray, isString, isObject } from "../utils";
import { describe, it, expect } from "vitest";

describe("utils", () => {
  it("isArray", () => {
    expect(isArray([])).toBe(true);
    expect(isArray({})).toBe(false);
  });

  it("isString", () => {
    expect(isString([])).toBe(false);
    expect(isString("")).toBe(true);
  });

  it("isObject", () => {
    expect(isObject([])).toBe(false);
    expect(isObject({})).toBe(true);
    expect(isObject("")).toBe(false);
  });
});
