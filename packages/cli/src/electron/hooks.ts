import { appendFile, readFile } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { CeaContext } from "../context";

const getHookFilePath = (name: string) => {
  return resolve(fileURLToPath(import.meta.url), `../../hooks/${name}`);
};

const division = (length: number = 20) => {
  return Array(length).fill("\n").join("");
};

const getTemplateCode = async (code: string = "") => {
  const templatePath = getHookFilePath("template.js");
  const template = await readFile(templatePath);
  return template.toString().replace(/\{code\}/, code);
};

export async function useHooks(file: string, ctx?: CeaContext) {
  const hook = getHookFilePath("restare.js");

  const indexCode = await readFile(hook);
  let installExtensionCode: Buffer | string = "";

  if (!ctx) return;

  if (ctx.extensions) {
    const extensions = getHookFilePath("installExtension.js");
    const installCode = await readFile(extensions);
    installExtensionCode =
      `let extensions = [${ctx.extensions
        .map((name) => "'" + name + "'")
        .join(",")}]` +
      "\n" +
      installCode.toString();
  }

  const code = await getTemplateCode(`${indexCode} ${installExtensionCode}`);

  return await appendFile(file, `${division()} ${code}`);
}
