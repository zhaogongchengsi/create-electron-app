import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    // default
    "./packages/cli/src/index",
    // !!! A big man will teach me how to configure this
    // {
    //   input: "./packages/test/index",
    //   outDir: "./dist/test",
    // },
  ],
  declaration: true,
  clean: true,
  outDir: "dist",
  rollup: {
    emitCJS: true,
  },
});
