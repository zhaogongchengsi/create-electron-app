import dotenv from "dotenv";
import { readFile } from "fs/promises";
import { Mode } from "../types";
import { findFiles } from "./utils";

export async function parseEnv(root: string, mode: Mode) {
  const paths = await fincEnvFile(root, mode);
  const env = {};
  const strs = await Promise.all(
    paths.map((path) => {
      return readEnvFile(path);
    })
  );

  strs.forEach((value) => {
    const e = dotenv.parse(value);
    Object.assign(env, e);
  });

  return env;
}

export async function fincEnvFile(root: string, mode: Mode): Promise<string[]> {
  const paths: string[] = [];
  const res = await Promise.all([
    findFiles(root, [".env.local"]),
    findFiles(root, [".env"]),
    findFiles(root, [`.env.${mode}`]),
    findFiles(root, [`.env.${mode}.local`]),
  ]);
  res.forEach(({ exist, path }) => {
    if (exist) {
      paths.push(path);
    }
  });
  return paths;
}

export async function readEnvFile(file: string) {
  return await readFile(file, {
    encoding: "utf-8",
  });
}
