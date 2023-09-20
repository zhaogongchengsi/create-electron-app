import { join } from 'node:path'
import { relative, resolve } from 'pathe'
import type { BuildOptions, Loader } from 'esbuild'
import type { ResolvedConfig } from 'vite'
import type { ResolveConfig } from './config'
import { resolveFileName } from './utils'

export type Page = Record<string, string> | string

export interface Options {
  page: Page
}

export function createEsBuildOptions(config: ResolveConfig, vite: ResolvedConfig, { page }: Options): BuildOptions {
  const { root, output, main, preload, mode } = config

  if (!main)
    throw new Error('Electron main thread file is required')

  const { outDir } = vite.build
  const isDev = mode === 'development'
  const isProd = mode === 'production'

  /* root: abc
   * vite.build.outDor: dist see https://vitejs.dev/config/build-options.html#build-outdir
   * production mode ? abc/dist/app/xxx : abc/.app/xxx
   */

  const outdir = isProd ? resolve(root, outDir, output) : resolve(root, output)

  const mainFile = join(outdir, `${resolveFileName(main)}.js`)
  const preloadFile = preload ? relative(mainFile, join(outdir, resolveFileName(preload))).substring(3) : undefined

  const env = JSON.stringify({
    MODE: mode,
    PROD: isProd,
    DEV: isDev,
  })

  const mainPoints = {
    in: join(root, main),
    out: resolveFileName(main),
  }

  const entryPoints = preload ? [mainPoints, { in: join(root, preload), out: resolveFileName(preload) }] : [mainPoints]

  const fileLoader: { [ext: string]: Loader } = Object.fromEntries(['.png', '.jpg', 'jpeg', 'gif'].map(ext => [ext, 'file']))

  return {
    entryPoints,
    sourcemap: isDev,
    format: 'iife',
    bundle: true,
    platform: 'node',
    outdir,
    loader: {
      ...fileLoader,
      '.svg': 'text',
      '.ts': 'ts',
      '.js': 'js',
      '.tsx': 'tsx',
      '.jsx': 'jsx',
      '.json': 'json',
    },
    write: isDev,
    external: ['electron'],
    absWorkingDir: root,
    define: {
      'import.meta.env': env,
      'import.meta.app': JSON.stringify({
        page,
        preload: `${preloadFile}.js`,
      }),
    },
  }
}
