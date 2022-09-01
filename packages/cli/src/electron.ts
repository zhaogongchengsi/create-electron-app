import { spawn } from "node:child_process";
import { Arch, build, Configuration, Platform } from "electron-builder";

export type Callbacks = {
  close?: (code: number | null) => void;
  data?: (data: any) => void;
};

export type Platforms = "win" | "mac" | "lin" | "all";
export type targets = Map<Platform, Map<Arch, Array<string>>>;
export type BuildAppOptions = {
  inputDir: string;
  config: string | Configuration | null;
  targets: targets;
};

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
  return build({
    projectDir: inputDir,
    targets: targets,
    config,
  });
}

export const createTarget = (platforms?: Platforms): Platform => {
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
