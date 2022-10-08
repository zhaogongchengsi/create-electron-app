import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  // If entries is not provided, will be automatically inferred from package.json
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
