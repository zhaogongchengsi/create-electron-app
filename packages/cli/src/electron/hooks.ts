import { appendFile, readFile } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";

const remarks = `


/*
 * !!! The following will only appear in the development environment 
 */
`;

export async function useRestart(file: string) {
  const hook = resolve(fileURLToPath(import.meta.url), "../hooks/restare.js");
  const code = await readFile(hook);
  return await appendFile(file, `${remarks} \n ${code}`);
}
