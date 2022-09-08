import { identifyMainType, mergeConfig, mergeEsBuild } from "../config";
import { describe, it, expect } from "vitest";
import { join } from "path";
import { esBuild } from "../../types";

describe("mergeConfig", () => {
  it("mergeConfig default", () => {
    const conf = mergeConfig();

    expect(conf).toEqual({
      vite: "",
      main: {
        input: "",
      },
      watch: true,
      tempDirName: ".app",
      outDir: "dist",
      appOutDir: "releases",
    });
  });

  it("mergeConfig (vite, main)", () => {
    const conf = mergeConfig(
      {
        vite: "",
        main: {
          input: "",
        },
      },
      {
        vite: "",
        main: {
          input: "1",
        },
      },
      {
        vite: "1",
        watch: false,
        main: {
          input: "2",
          preload: "3",
        },
      }
    );

    expect(conf).toEqual({
      vite: "1",
      main: {
        input: "2",
        preload: "3",
      },
      watch: false,
      tempDirName: ".app",
      outDir: "dist",
      appOutDir: "releases",
    });
  });

  it("mergeConfig (.app, dist)", () => {
    const conf = mergeConfig(
      {
        vite: "",
        main: {
          input: "",
        },
      },
      {
        vite: "",
        main: {
          input: "1",
        },
      },
      {
        vite: "1",
        main: {
          input: "2",
          preload: "3",
        },
        tempDirName: ".app2",
        outDir: "dist2",
      }
    );

    expect(conf).toEqual({
      vite: "1",
      main: {
        input: "2",
        preload: "3",
      },
      watch: true,
      tempDirName: ".app2",
      outDir: "dist2",
      appOutDir: "releases",
    });
  });
});

describe("identifyMainType", () => {
  it("Do not pass options Parse in the normal way", () => {
    const [main] = identifyMainType("./index.ts");
    const [input, preload] = identifyMainType({
      input: "./index.ts",
      preload: "./preload.ts",
    });

    const [input2] = identifyMainType({
      input: "./index.ts",
    });

    expect(main).toBe("./index.ts");
    expect(input).toBe("./index.ts");
    expect(preload).toBe("./preload.ts");
    expect(input2).toBe("./index.ts");
  });

  it("Empty parameters will report an error", () => {
    expect(() =>
      identifyMainType({
        input: "",
      })
    ).toThrowError(
      "The main field entry file does not exist, please provide at least one"
    );

    // @ts-ignore
    expect(() => identifyMainType({})).toThrowError(
      "The main field entry file does not exist, please provide at least one"
    );

    // @ts-ignore
    expect(() => identifyMainType()).toThrowError(
      "The main field entry file does not exist, please provide at least one"
    );
  });

  it("add ext", () => {
    const [input, preload] = identifyMainType(
      {
        input: "./index.ts",
        preload: "preload.ts",
      },
      {
        ext: "js",
      }
    );

    expect(input).toBe("index.js");
    expect(preload).toBe("preload.js");
  });

  it("add root", () => {
    const root = process.cwd();
    const [input, preload] = identifyMainType(
      {
        input: "./index.ts",
        preload: "preload.ts",
      },
      {
        root: root,
      }
    );

    expect(input).toBe(join(root, "index.ts"));
    expect(preload).toBe(join(root, "preload.ts"));
  });

  it("add all", () => {
    const root = process.cwd();
    const ext = "cjs";
    const [input, preload] = identifyMainType(
      {
        input: "./index.ts",
        preload: "preload.ts",
      },
      {
        root: root,
        ext,
      }
    );

    expect(input).toBe(join(root, "index" + "." + ext));
    expect(preload).toBe(join(root, "preload" + "." + ext));
  });
});

describe("mergeEsbuild", () => {
  it("Original value", () => {
    const p1 = {
      treeShaking: false,
      outfile: "abc",
      preserveSymlinks: true,
    };
    const p2 = {
      treeShaking: true,
      outfile: "abc2",
    };

    const p3 = mergeEsBuild(p1, p2);

    expect(p3).toEqual({
      treeShaking: true,
      outfile: "abc2",
      preserveSymlinks: true,
    });
  });

  it("The electronAssets option inside the bundle will not work", () => {
    const p1: esBuild = {
      define: {
        electronAssets: "1",
      },
    };
    const p2: esBuild = {
      define: {
        electronAssets: "2",
        b: "1",
        c: "1",
      },
    };

    const p3 = mergeEsBuild(p1, p2);

    expect(p3).toEqual({
      define: {
        electronAssets: "1",
        b: "1",
        c: "1",
      },
    });
  });

  it("ignore option", () => {
    const p1 = {
      watch: false,
    };
    const p2 = {
      watch: true,
    };

    const p3 = mergeEsBuild(p1, p2);

    expect(p3).toEqual({
      watch: false,
    });

    expect(p2).toEqual({
      watch: undefined,
    });
  });

  it("merge external", () => {
    const p1: esBuild = {
      external: ["electron"],
    };
    const p2: esBuild = {
      external: ["electron-builder"],
    };

    const p3 = mergeEsBuild(p1, p2);

    expect(p3).toEqual({
      external: ["electron", "electron-builder"],
    });
  });
});
