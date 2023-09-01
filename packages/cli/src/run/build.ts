import process from 'node:process'
import type { UltimatelyCeaConfig } from '../config'
import { loadConfig } from '../config'
import { loadVite } from '../load'

const BUILD_MODE = 'production'
export async function runBuild() {
  process.env.NODE_ENV = BUILD_MODE
  const { config } = await loadConfig()
  const _config = config as UltimatelyCeaConfig

  const { build } = await loadVite(_config)

  const res = await build({
    root: _config.root,
  })

  console.log(res)
  // const opt = createMultiCompilerOptions(_config)
  // const compilers = createMultiCompiler(opt)
  //
  // consola.start('Start compilation')
  //
  // compilers.run((err, stats) => {
  //   if (err) {
  //     consola.error(err)
  //     return
  //   }
  //   consola.success('Compiled successfully')
  // })
}
