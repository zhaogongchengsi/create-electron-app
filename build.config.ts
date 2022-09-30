import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  // If entries is not provided, will be automatically inferred from package.json
  entries: [
    // default
    "./packages/cli/src/index",
    // {
    //   builder: "mkdist",
    //   input: "./packages/test/index",
    //   outDir: "./dist/test",
    // },
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
});