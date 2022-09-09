import { describe, it, expect } from "vitest";
import { startWatch } from "../src/watch";
import { resolve } from "path";
import { writeFile } from "fs/promises";

describe.todo("watch", () => {
  const testFile = resolve(__dirname, "./test.txt");

  const testTxt = "测试文本";

  const trigger = async () => {
    await writeFile(testFile, testTxt);
  };

  it("watch file", async () => {
    expect.assertions(1);
    const e = await startWatch(testFile);
    await trigger();
    e.on("change", (path: string) => {
      expect(path).toBe(testFile);
    });
  });
});
