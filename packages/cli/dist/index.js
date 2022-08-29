#!/usr/bin/env node

import { cac } from 'cac';

function build() {
  console.log("build");
}

async function createDevServer(options) {
  console.log(`dev server ...`);
}

var name = "@cea/cli";
var version = "0.0.1";
var description = "Create a cli for electron app";
var main = "index.js";
var type = "module";
var types = "./types";
var scripts = {
	build: "rollup --config rollup.config.js -w"
};
var bin = {
	"create-electron-app": "dist/index.js",
	cea: "dist/index.js"
};
var keywords = [
];
var author = "";
var license = "ISC";
var dependencies = {
	"@rollup/plugin-commonjs": "^22.0.2",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^13.3.0",
	"@rollup/plugin-typescript": "^8.4.0",
	"@types/node": "^18.7.13",
	cac: "^6.7.14",
	esbuild: "^0.15.5",
	picocolors: "^1.0.0",
	rollup: "^2.78.1",
	"rollup-plugin-esbuild": "^4.10.1",
	"ts-node": "^10.9.1",
	typescript: "^4.8.2"
};
var pack = {
	name: name,
	version: version,
	description: description,
	main: main,
	type: type,
	types: types,
	scripts: scripts,
	bin: bin,
	keywords: keywords,
	author: author,
	license: license,
	dependencies: dependencies
};

const createCli = ({ build, createDevServer }) => {
  const cli = cac("cea");
  cli.command("[root]", "start dev server").alias("serve").alias("dev").option("--host [host]", `[string] specify hostname`).option("--port <port>", `[number] specify port`).action(async (root, options) => {
    const { port, host } = options;
    try {
      createDevServer({
        root: process.cwd(),
        configFilePath: root,
        port,
        host
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
  cli.command("preview <config>", "Preview your app").action((config, options) => {
    const currentPath = process.cwd();
    build();
    console.log(config, currentPath);
  });
  cli.help();
  cli.version(pack.version);
  cli.parse();
  return cli;
};

createCli({
  build,
  createDevServer
});

export { build, createDevServer };
