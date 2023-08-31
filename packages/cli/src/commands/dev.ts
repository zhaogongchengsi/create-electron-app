import { defineCommand } from 'citty'
import { createMultiCompiler } from '@rspack/core'
import consola from 'consola'
import { parse, resolve } from 'pathe'
import { loadConfig } from '../config'
import type { CeaConfig } from '../config'
import { createMultiCompilerOptions } from '../options'

export default defineCommand({
  meta: {
    name: 'dev',
  },
  async run() {
    const { config } = await loadConfig()
    const _config = config as Required<CeaConfig>

    const opt = createMultiCompilerOptions(_config)
    const compilers = createMultiCompiler(opt)
    const { root, output, main } = _config

    compilers.watch({ ignored: /node_modules/ }, (err, stats) => {
      if (err) {
        consola.error(err)
        return
      }

      const mainFile = resolve(root, output, `${parse(main).name}.js`)

      console.log(mainFile)

      // const main = stats!.stats.find(st => st.compilation.options.target === Target.main)
    })
  },
})
