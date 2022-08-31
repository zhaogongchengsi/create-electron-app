import { spawn } from "node:child_process";

export async function createDevElectronApp(root: string, file: string) {
  const ls = spawn(`electron`, [file], {
    cwd: root,
    shell: true,
  });

  ls.on("close", (code) => {
    process.exit(1);
  });

  return ls;
}
