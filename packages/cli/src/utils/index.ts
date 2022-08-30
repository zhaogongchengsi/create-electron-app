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
