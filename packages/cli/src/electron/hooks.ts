import { appendFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function getHookFilePath(name: string) {
  return resolve(fileURLToPath(import.meta.url), `../../hooks/${name}`)
}

function division(length: number = 20) {
  return Array(length).fill('\n').join('')
}

const code = `
  const electron = require("electron");
  const closeId = "_cea_:app-windows-all_close";
  electron.app.on("will-quit", () => {
    process.send(closeId);
  });
`

export async function jnjectHookCode(file: string) {
  // const hook = getHookFilePath("restare.js");
  // const indexCode = await readFile(hook);
  return await appendFile(
    file,
    `${division()};(async function () { ${code} })();`,
  )
}
