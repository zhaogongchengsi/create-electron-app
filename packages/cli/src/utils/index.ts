import { access } from "fs/promises";
import { constants } from "fs";

export const pathExist = async (path: string) => {
  try {
    await access(path, constants.R_OK | constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
};

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

export const defaultConfig = {
  outDir: "dist",
  tempDirName: ".app",
};
