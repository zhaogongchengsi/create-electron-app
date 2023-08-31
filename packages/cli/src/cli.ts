#!/usr/bin/env node

import { defineCommand, runMain } from "citty";
import dev from './commands/dev'
import build from './commands/build'

const main = defineCommand({
  meta: {
    name: "cea",
    version: "0.2.8",
    description: "My Awesome CLI App",
  },
  subCommands: {
    dev,
    build
  },
});

runMain(main);