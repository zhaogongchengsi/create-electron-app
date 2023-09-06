import process from 'node:process'
import consola from 'consola'
import { join, parse, relative } from 'pathe'
import type { MultiRspackOptions, MultiStats } from '@rspack/core'
import { createMultiCompiler } from '@rspack/core'
import type { UltimatelyCeaConfig } from '../config'
import { loadConfig } from '../config'
import { createMultiCompilerOptions } from '../options'
import { loadVite } from '../load'

const BUILD_MODE = 'production'
export async function runBuild() {
  process.env.NODE_ENV = BUILD_MODE
  const { config } = await loadConfig()
  const _config = config as UltimatelyCeaConfig

  const { build } = loadVite(_config)

  consola.start('Start compilation')

  const { root, output, main, preload } = _config

  // todo: 获取页面
  const viteOutDir = join(root, 'dist')
  const appOutDir = join(root, output)
  const htmlFile = join(viteOutDir, 'index.html')
  const mainFile = join(appOutDir, `${parse(main).name}.js`)
  const preloadFile = join(appOutDir, `${parse(preload).name}.js`)

  const loadUrl = relative(mainFile, htmlFile).substring(3)
  const preloadUrl = relative(mainFile, preloadFile).substring(3)

  const injectOptions = { app: { loadUrl, preloadUrl } }

  const opt = createMultiCompilerOptions(_config, injectOptions)

  // vite build
  await build({ root })
  // build app main
  await compiler(opt)

  consola.success('Compiled successfully')
}

function compiler(opt: MultiRspackOptions): Promise< MultiStats | undefined> {
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
