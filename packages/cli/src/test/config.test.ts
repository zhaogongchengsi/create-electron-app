import { mergeConfig } from "../config";
import { describe, it, expect } from "vitest";

describe("use config", () => {
  it("mergeConfig default", () => {
    const conf = mergeConfig();
    expect(conf).toEqual({
      renderer: "",
      main: {
        input: "",
      },
    });
  });

  it("mergeConfig (renderer, main)", () => {
    const conf = mergeConfig(
      {
        renderer: "",
        main: {
          input: "",
        },
      },
      {
        renderer: "",
        main: {
          input: "1",
        },
      },
      {
        renderer: "1",
        main: {
          input: "2",
        },
      }
    );
    expect(conf).toEqual({
      renderer: "1",
      main: {
        input: "2",
      },
    });
  });
});
