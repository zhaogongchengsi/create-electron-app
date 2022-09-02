export {
  createSystemLink,
  createNodeModule,
  createFile,
  pathExist,
  createDir,
  findFiles,
} from "./fs";

export { importConfig, requireConfig, _reauire, _import } from "./module";

enum toStringRes {
  object = "[object Object]",
  array = "[object Array]",
}

const objectToString = (obj: any) => {
  return Object.prototype.toString.call(obj);
};

export const isArray = (object: any): boolean => {
  return objectToString(object) === toStringRes.array;
};

export const isString = (object: any): boolean => {
  return typeof object === "string";
};

export const isObject = (obj: any): boolean => {
  if (isArray(obj)) {
    return false;
  }
  return typeof obj === "object";
};

export function clearPackJson(pack: any): string {
  delete pack.dependencies;
  delete pack.browserslist;
  delete pack.devDependencies;
  delete pack.scripts;
  return JSON.stringify(pack);
}
