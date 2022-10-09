import { cac } from "cac";
import pack from "../package.json";
import type { ServeOptions, buildOptions } from "../types";

export type cliMethod = {
  build: (options: buildOptions) => void;
  createDevServer: (serveOptions: ServeOptions) => void;
};

export const createCli = ({ build, createDevServer }: cliMethod) => {
  const cli = cac("cea");

  cli
    .command("[configPath]", "start dev server")
    .alias("serve") // the command is called 'serve' in Vite's API
    .alias("dev") // alias to align with the script name
    .option("--host [host]", `[string] specify hostname`)
    .option("--port <port>", `[number] specify port`)
    .action(async (configPath: string, options: any) => {
      const { port, host } = options;
      try {
        createDevServer({
          root: process.cwd(),
          configFilePath: configPath,
          port,
          host,
        });
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    });

  cli.command("build [root]", "Build your app").action((config, options) => {
    try {
      build({
        root: process.cwd(),
        configFilePath: config,
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

  cli
    .command("preview <config>", "Preview your app")
    .action((config, options) => {
      // const currentPath = process.cwd();
      console.log(`Under development`);
    });

  cli.help();
  cli.version(pack.version);
  cli.parse();

  return cli;
};
