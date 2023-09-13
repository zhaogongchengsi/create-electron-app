import { loadElectronBuilder } from './load'
import type { ResolveConfig } from './config'

export async function builder(config: ResolveConfig) {
  const { root } = config
  const { build, Platform } = loadElectronBuilder(config)

  const res = await build({
    targets: Platform.WINDOWS.createTarget(),
    projectDir: root,
    config: config.build,
  })
}
