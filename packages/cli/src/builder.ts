import { loadElectronBuilder } from './load'
import type { UltimatelyCeaConfig } from './config'

export async function builder(config: UltimatelyCeaConfig) {
  const { root } = config
  const { build, Platform } = loadElectronBuilder(config)

  const res = await build({
    targets: Platform.WINDOWS.createTarget(),
    projectDir: root,
    config: config.build,
  })

  console.log(res)
}
