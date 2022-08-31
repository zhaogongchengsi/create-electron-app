import { isArray, isString, isObject, pathExist } from "../utils";
import { describe, it, expect } from "vitest";
import { join } from "node:path";

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

describe("path", () => {
  it("pathExist (suffixed)", async () => {
    const pathA = join(process.cwd(), "package.json");
    const pathB = join(process.cwd(), "./abc.ts");
    const isExistA = await pathExist(pathA);
    const isExistB = await pathExist(pathB);
    expect(isExistA).toBe(true);
    expect(isExistB).toBe(false);
  });
});
