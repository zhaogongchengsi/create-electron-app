import pc from "picocolors";

export const log = {
  success(str: string) {
    console.log(pc.green(str));
  },
};
