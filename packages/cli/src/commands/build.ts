import { defineCommand } from 'citty'
import {CeaConfig, loadConfig} from "../config";
import {createMultiCompilerOptions} from "../options";
import {createMultiCompiler} from "@rspack/core";
import consola from "consola";
import {parse, resolve} from "pathe";

export default defineCommand({
  meta: {
    name: 'build',
  },
  async run() {
    const { config } = await loadConfig()
    const _config = config as Required<CeaConfig>

    const opt = createMultiCompilerOptions(_config)
    const compilers = createMultiCompiler(opt)

    consola.start(`Start compilation`)

    compilers.run((err, stats) => {
      if (err) {
        consola.error(err)
        return
      }
      consola.success(`Compiled successfully`)
    })
  },
})
