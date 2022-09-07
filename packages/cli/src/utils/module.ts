import { createRequire } from "node:module";

const _REQUIRE = createRequire(import.meta.url);
const FILE = "file://";

export const _reauire = async (path: string) => {
  return _REQUIRE(path);
};

export const _import = async (path: string) => {
  return import(FILE + path);
};

export const importConfig = async (path: string) => {
  const raw = await _import(path);
  const conf = raw.default ?? raw;
  return typeof conf === "function" ? conf() : conf;
};

export const requireConfig = async (path: string) => {
  const raw = await _reauire(path);
  const conf = raw.__esModule ? raw.default : raw;
  return typeof conf === "function" ? conf() : conf;
};

export const dynamicImport = async (name: string) => {
  let module;
  try {
    module = await _reauire(name);
  } catch (err) {
    throw new Error(
      `The ${name} module was not found. Try to install ${name} by running npm install ${name}`
    );
  }

  return module;
};
