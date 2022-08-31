import { spawn } from "node:child_process";

export type Callbacks = {
  close?: (code: number | null) => void;
  data?: (data: any) => void;
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
