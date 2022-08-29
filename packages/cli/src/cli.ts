import { cac } from "cac";
// import colors from "picocolors";
import pack from "../package.json";
import type { serveOptions } from "../types";

export type cliMethod = {
  build: () => void;
  createDevServer: (serveOptions: serveOptions) => void;
};

export const createCli = ({ build, createDevServer }: cliMethod) => {
  const cli = cac("cea");

  cli
    .command("[root]", "start dev server")
    .alias("serve") // the command is called 'serve' in Vite's API
    .alias("dev") // alias to align with the script name
    .option("--host [host]", `[string] specify hostname`)
    .option("--port <port>", `[number] specify port`)
    .action(async (root: string, options: any) => {
      const { port, host } = options;
      try {
        createDevServer({
          root: process.cwd(),
          configFilePath: root,
          port,
          host,
        });
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
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
