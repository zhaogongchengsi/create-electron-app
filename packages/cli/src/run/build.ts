import process from 'node:process'
import consola from 'consola'
import { join, parse, relative, resolve } from 'pathe'
import type { MultiRspackOptions, MultiStats } from '@rspack/core'
import { createMultiCompiler } from '@rspack/core'
import type { UltimatelyCeaConfig } from '../config'
import { loadConfig } from '../config'
import type { App } from '../options'
import { createMultiCompilerOptions } from '../options'
import { loadVite } from '../load'
import { getPageOutDir } from '../vite'
import { isString } from '../utils'

const BUILD_MODE = 'production'

export async function runBuild() {
  process.env.NODE_ENV = BUILD_MODE
  const { config } = await loadConfig()
  const _config = config as UltimatelyCeaConfig

  const { build, resolveConfig } = loadVite(_config)

  const viteConfig = await resolveConfig({ root: _config.root }, 'build', BUILD_MODE)
  const { outDir, page } = getPageOutDir(viteConfig)

  consola.start('Start compilation')

  const { root, main, preload, output } = _config

  // todo: 获取页面
  const mainFile = join(outDir, output, `${parse(main).name}.js`)
  const preloadFile = join(outDir, output, `${parse(preload).name}.js`)
  const preloadUrl = relative(mainFile, preloadFile).substring(3)

  const pages = isString(page)
    ? relative(mainFile, resolve(outDir, page as string)).substring(3)
    : Object.fromEntries(Object.entries(page).map(([name, path]) => {
      return [name, relative(mainFile, resolve(outDir, path))]
    }))

  const app: App = { page: pages, preloadUrl, baseUrl: undefined }

  const opt = createMultiCompilerOptions({ ..._config, output: join(outDir, _config.output) }, { app })

  // vite build
  await build({ root })
  // build app main
  await compiler(opt)

  consola.success('Compiled successfully')
}

function compiler(opt: MultiRspackOptions): Promise<MultiStats | undefined> {
  const compilers = createMultiCompiler(opt)
  return new Promise((resolve, reject) => {
    compilers.run(async (err, stats) => {
      if (err)
        reject(err)
      else
        resolve(stats)
    })
  })
}
