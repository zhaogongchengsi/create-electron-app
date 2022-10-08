#!/usr/bin/env node

import { createCli, build, createDevServer } from "../dist/index.mjs";

createCli({
  build,
  createDevServer,
});
