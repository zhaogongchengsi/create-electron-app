import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    // default
    "./packages/cli/src/index",
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
});
