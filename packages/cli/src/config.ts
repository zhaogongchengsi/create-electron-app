import { join } from "path";

export type fileType = "ts" | "js" | "json";

export type ConfigFileInfo = {
  type: fileType;
  path: string;
};

export interface UseConfig {}

export async function findconfigFile(
  root: string,
  confPath: string
): Promise<ConfigFileInfo> {
  let fileType: fileType = "js";
  if (confPath.endsWith("ts")) {
    fileType = "ts";
  } else if (confPath.endsWith("json")) {
    fileType = "json";
  }
  const configPath = join(root, confPath);
  return {
    type: fileType,
    path: configPath,
  };
}

export async function resolveConfig(
  confinfo: ConfigFileInfo
): Promise<UseConfig> {
  return {};
}
