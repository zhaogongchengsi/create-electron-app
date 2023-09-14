import { loadElectronBuilder } from './load'
import type { ResolveConfig } from './config'

export async function builder(config: ResolveConfig) {
  const { root } = config
  const { build, Platform } = loadElectronBuilder(config)

  return await build({
    targets: Platform.current().createTarget(),
    projectDir: root,
    config: config.build,
  })
}
