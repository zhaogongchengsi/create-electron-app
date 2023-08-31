import { dynamicImport } from '../utils'

export async function buildApp(inputDir: string, config?: Record<string, any>) {
  const { build, Platform } = await dynamicImport('electron-builder')

  return build({
    projectDir: inputDir,
    targets: Platform.current().createTarget(),
    config,
  })
}
