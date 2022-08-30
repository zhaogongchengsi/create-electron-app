import { mergeConfig } from "../config";
import { describe, it, expect } from "vitest";

describe("use config", () => {
  it("mergeConfig default", () => {
    const conf = mergeConfig();
    expect(conf).toEqual({
      main: [],
      renderer: [],
    });
  });

  it("mergeConfig (renderer, main)", () => {
    const conf = mergeConfig(
      {
        renderer: ["index"],
        main: ["main"],
      },
      {
        renderer: ["index2"],
        main: ["main2"],
      },
      {
        renderer: ["index3"],
        main: ["main3"],
      }
    );
    expect(conf).toEqual({
      main: ["main3"],
      renderer: ["index3"],
    });
  });
});
