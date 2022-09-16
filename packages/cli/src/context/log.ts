import { log } from ".";
import pc from "picocolors";

export default class LogLevel implements log {
  warn(msg: string) {
    console.log(pc.yellow(msg));
  }
  info(msg: string) {
    console.log(pc.green(msg));
  }
  error(err: Error) {
    console.error(pc.red(err.message), "\n", pc.red(err.stack));
  }
  silent(msg: string) {
    console.log(pc.dim(msg));
  }
}
