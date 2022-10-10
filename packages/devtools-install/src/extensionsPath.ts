import os from "os";
import { devtoolType } from "../types";
import { join } from "path";
import { readdir } from "fs/promises";

const systemPath = os.homedir();

const LOCAL_PATH = "AppData/Local";

const CHROME_EXTENIO_PATH = "Google/Chrome/User Data/Default/Extensions";
const EDGE_EXTENIO_PATH = "Microsoft/Edge/User Data/Default/Extensions";

/**
 *
 * @param name chrome: C:\Users\[username]\AppData\Local\Google\Chrome\User Data\Default\Extensions
 *
 *      edge: C:\Users\[username]\AppData\Local\Microsoft\Edge\User Data\Default\Extensions
 * @returns
 */
export function getExtensionDirPath(name: devtoolType = "edge") {
  const Local = join(systemPath, LOCAL_PATH);
  if (name === "chrome") {
    return join(Local, CHROME_EXTENIO_PATH);
  } else if (name === "edge") {
    return join(Local, EDGE_EXTENIO_PATH);
  }

  return undefined;
}

export async function searchExtension(path: string, id: string) {
  const extPath = join(path, id);
  const files = await readdir(extPath);
  if (files.length < 1) {
    throw new Error(
      `The \n ${id} \n extension does not exist. Check whether it is an ID error`
    );
  }
  return join(extPath, files[0]);
}
