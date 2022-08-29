import { cac } from "cac";
// import colors from "picocolors";
import pack from "../package.json";

export type cliMethod = {
  build: () => void;
};

export const createCli = ({ build }: cliMethod) => {
  const cli = cac("cea");

  cli.command("build <entry>", "Build your app").action((entry, options) => {
    const currentPath = process.cwd();
    build();
    console.log(entry, currentPath);
  });

  cli.help();
  cli.version(pack.version);
  cli.parse();

  return cli;
};
