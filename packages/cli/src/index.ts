import { build } from "./build";
import { createDevServer } from "./dev";

import { createCli } from "./cli";

createCli({
  build,
  createDevServer,
});

export { build, createDevServer };
