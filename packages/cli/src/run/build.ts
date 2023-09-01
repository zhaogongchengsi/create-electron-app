import type { UltimatelyCeaConfig } from '../config'
import { loadConfig } from '../config'
import { loadVite } from '../vite'

export async function runBuild() {
  const { config } = await loadConfig()
  const _config = config as UltimatelyCeaConfig

  const vite = await loadVite(_config)

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
