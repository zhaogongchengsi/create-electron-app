import process from 'node:process'
import consola from 'consola'
import { join, relative } from 'pathe'
import type { MultiRspackOptions, MultiStats } from '@rspack/core'
import { createMultiCompiler } from '@rspack/core'
import type { ResolvedConfig } from 'vite'
import { loadConfig } from '../config'
import { createMultiCompilerOptions } from '../options'
import { loadVite } from '../load'
import { getPageOutDir } from '../vite'
import { isString, resolveFileName } from '../utils'
import { VitePluginGetConfig } from '../plugins/vite-getconfig'

const BUILD_MODE = 'production'

export async function runBuild() {
  process.env.NODE_ENV = BUILD_MODE
  const config = await loadConfig()
  const { root, main, output } = config
  const { build } = loadVite()

  consola.start('Start compilation')
  // vite build
  let viteConfig: ResolvedConfig
  await build({ root, plugins: [VitePluginGetConfig(config => (viteConfig = config))] })

  const { outDir, page } = getPageOutDir(viteConfig!)

  const mainFile = join(outDir, output, resolveFileName(main))

  const pages = isString(page)
    ? relative(mainFile, join(outDir, page as string)).substring(3)
    : Object.fromEntries(Object.entries(page).map(([name, path]) => {
      return [name, relative(mainFile, join(outDir, path)).substring(3)]
    }))

  const opt = createMultiCompilerOptions({ ...config, output: join(outDir, output) }, { page: pages, vite: viteConfig! })

  // build app main
  await compiler(opt)

  consola.success('Compiled successfully')
}

function compiler(opt: MultiRspackOptions): Promise<MultiStats | undefined> {
  const compilers = createMultiCompiler(opt)
  return new Promise((resolve, reject) => {
    compilers.run((err, stats) => {
      if (err)
        reject(err)
      else
        resolve(stats)
    })
  })
}
