import { join } from 'node:path'
import { resolve as _resolve, relative } from 'pathe'
import type { BuildOptions } from 'esbuild'
import type { ResolveConfig } from './config'
import { resolveFileName } from './utils'

export type Page = Record<string, string> | string

export interface Options {
  page: Page
}

export function createEsBuildOptions(config: ResolveConfig, { page }: Options): BuildOptions {
  const { root, output, main, preload, mode } = config

  if (!main)
    throw new Error('Electron main thread file is required')

  const isDev = mode === 'development'
  const isProd = mode === 'production'

  const mainFile = _resolve(root, output, `${resolveFileName(main)}.js`)
  const preloadFile = preload ? relative(mainFile, _resolve(root, output, resolveFileName(preload))).substring(3) : undefined

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

  return {
    entryPoints,
    sourcemap: isDev,
    format: 'iife',
    bundle: true,
    platform: 'node',
    outdir: output,
    loader: {
      '.png': 'file',
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
