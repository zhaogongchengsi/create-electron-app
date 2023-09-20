import process from 'node:process'
import consola from 'consola'
import { join, relative } from 'pathe'
import { build as esbuild } from 'esbuild'
import type { ResolvedConfig } from 'vite'
import { outputFile } from 'fs-extra'
import { loadConfig } from '../config'
import { createEsBuildOptions } from '../options'
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

  // build app main
  const { errors, warnings, outputFiles } = await esbuild(createEsBuildOptions(config, viteConfig!, { page: pages }))

  errors.forEach(consola.error)
  warnings.forEach(consola.warn)

  for (const { path, text } of (outputFiles || []))
    await outputFile(path, text)

  consola.success('Compiled successfully')
}
