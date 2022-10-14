import { appendFile } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";

const getHookFilePath = (name: string) => {
  return resolve(fileURLToPath(import.meta.url), `../../hooks/${name}`);
};

const division = (length: number = 20) => {
  return Array(length).fill("\n").join("");
};

const code = `
  const electron = require("electron");
  const closeId = "_cea_:app-windows-all_close";
  electron.app.on("will-quit", () => {
    process.send(closeId);
  });
`;

export async function jnjectHookCode(file: string) {
  // const hook = getHookFilePath("restare.js");
  // const indexCode = await readFile(hook);
  return await appendFile(
    file,
    `${division()};(async function () { ${code} })();`
  );
}
