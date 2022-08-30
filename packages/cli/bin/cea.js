#!/usr/bin/env node

import { createCli, build, createDevServer } from "../dist/index.js";

createCli({
  build,
  createDevServer,
});
