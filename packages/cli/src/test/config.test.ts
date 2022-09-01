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
      tempDirName: ".app",
      outDir: "dist",
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
          preload: "3",
        },
      }
    );

    expect(conf).toEqual({
      renderer: "1",
      main: {
        input: "2",
        preload: "3",
      },
      tempDirName: ".app",
      outDir: "dist",
    });
  });

  it("mergeConfig (.app, dist)", () => {
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
          preload: "3",
        },
        tempDirName: ".app2",
        outDir: "dist2",
      }
    );

    expect(conf).toEqual({
      renderer: "1",
      main: {
        input: "2",
        preload: "3",
      },
      tempDirName: ".app2",
      outDir: "dist2",
    });
  });
});
