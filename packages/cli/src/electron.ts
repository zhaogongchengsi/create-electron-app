import { spawn } from "node:child_process";
import { BuildAppOptions, Callbacks, Platforms } from "../types";
import { dynamicImport } from "./utils";

export async function createDevElectronApp(
  root: string,
  file: string,
  callbacks?: Callbacks
) {
  const ls = spawn(`electron`, [file], {
    cwd: root,
    shell: true,
  });

  ls.on("close", (code) => {
    if (callbacks) {
      callbacks.close && callbacks.close(code);
    }
  });

  return ls;
}

export async function buildApp({ inputDir, targets, config }: BuildAppOptions) {
  const { build } = await dynamicImport("electron-builder");

  return build({
    projectDir: inputDir,
    targets: targets,
    config,
  });
}

export const createTarget = async (platforms?: Platforms) => {
  const { Platform } = await dynamicImport("electron-builder");
  switch (platforms) {
    case "win":
      return new Platform("windows", "win", "win32");
    case "mac":
      return new Platform("mac", "mac", "darwin");
    case "lin":
      return new Platform("linux", "linux", "linux");
  }
  return Platform.current();
};
