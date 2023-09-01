import process from 'node:process'
import consola from 'consola'
import { join, parse, relative } from 'pathe'
import { createMultiCompiler } from '@rspack/core'
import type { UltimatelyCeaConfig } from '../config'
import { loadConfig } from '../config'
import { loadVite } from '../load'
import { createMultiCompilerOptions } from '../options'

const BUILD_MODE = 'production'
export async function runBuild() {
  process.env.NODE_ENV = BUILD_MODE
  const { config } = await loadConfig()
  const _config = config as UltimatelyCeaConfig

  const { build } = loadVite(_config)

  consola.start('Start compilation')

  // 如果 使用多页面模式将更改 build.rollupOptions.input
  // see https://cn.vitejs.dev/guide/build.html#multi-page-app
  // const viteConfig = await resolveConfig({ root: _config.root }, 'build', BUILD_MODE)

  const { root, output, main, preload } = _config

  const viteOutdir = join(root, 'dist')
  const appOutdir = join(root, output)
  const htmlFile = join(viteOutdir, 'index.html')
  const mainFile = join(appOutdir, `${parse(main).name}.js`)
  const preloadFile = join(appOutdir, `${parse(preload).name}.js`)

  const loadUrl = relative(mainFile, htmlFile).substring(3)
  const preloadUrl = relative(mainFile, preloadFile).substring(3)

  const injectOptions = { app: { loadUrl, preloadUrl } }

  await build({
    root,
  })

  const opt = createMultiCompilerOptions(_config, injectOptions)
  const compilers = createMultiCompiler(opt)

  compilers.run((err, stats) => {
    if (err) {
      consola.error(err)
      return
    }
    consola.success('Compiled successfully')
  })
}
