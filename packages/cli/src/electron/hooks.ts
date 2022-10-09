import { appendFile, readFile } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";

const getHookFilePath = (name: string) => {
  return resolve(fileURLToPath(import.meta.url), `../../hooks/${name}`);
};

const division = (length: number = 20) => {
  return Array(length).fill("\n").join("");
};

export async function useHooks(file: string) {
  const hook = getHookFilePath("restare.js");

  const indexCode = await readFile(hook);

  return await appendFile(
    file,
    `${division()};(async function () { ${indexCode} })();`
  );
}
