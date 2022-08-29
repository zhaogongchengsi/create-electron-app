import { cac } from "cac";
// import colors from "picocolors";
import pack from "../package.json";

export type cliMethod = {
  build: () => void;
  createDevServer: () => void;
};

export const createCli = ({ build }: cliMethod) => {
  const cli = cac("cea");

  cli
    .command("[root]", "start dev server")
    .alias("serve") // the command is called 'serve' in Vite's API
    .alias("dev") // alias to align with the script name
    .option("--host [host]", `[string] specify hostname`)
    .option("--port <port>", `[number] specify port`)
    .action(async (root: string, options: any) => {
      console.log(root);
      console.log(options);
    });

  cli.command("build <config>", "Build your app").action((entry, options) => {
    const currentPath = process.cwd();
    build();
    console.log(entry, currentPath);
  });

  cli
    .command("preview <config>", "Preview your app")
    .action((config, options) => {
      const currentPath = process.cwd();
      build();
      console.log(config, currentPath);
    });

  cli.help();
  cli.version(pack.version);
  cli.parse();

  return cli;
};
