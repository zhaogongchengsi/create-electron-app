import type { MultiRspackOptions, RspackOptions } from '@rspack/core'
import { relative, resolve } from 'pathe'
import type { ResolveConfig } from './config'
import { resolveFileName } from './utils'

export const ELECTRON_MAIN = 'electron-main'
export const ELECTRON_PRELOAD = 'electron-preload'

export type Page = Record<string, string> | string

export interface Options {
  page: Page
}

export function createMultiCompilerOptions(config: ResolveConfig, { page }: Options): MultiRspackOptions {
  const { root, output, main, preload, mode } = config

  if (!main)
    throw new Error('Electron main thread file is required')

  const devtool = 'source-map'
  const isDev = mode === 'development'
  const isProd = mode === 'production'

  const preloadFile = preload ? resolve(root, output, resolveFileName(preload)) : undefined

  const env = JSON.stringify({
    MODE: mode,
    PROD: isProd,
    DEV: isDev,
  })

  const multiOptions: RspackOptions = {
    mode,
    context: root,
    devtool,
    entry: main,
    output: {
      filename: resolveFileName(main),
      path: output,
    },
    builtins: {
      emotion: {
        sourceMap: isDev,
      },
      define: {
        'import.meta.env': env,
        'import.meta.app': JSON.stringify({
          page,
          preload: preloadFile,
        }),
      },
    },
    watch: isDev,
    target: ELECTRON_MAIN,
  }

  if (!config.preload)
    return [multiOptions]

  const preloadOptions: RspackOptions = {
    mode,
    context: root,
    entry: preload!,
    devtool,
    output: {
      filename: resolveFileName(preload!),
      path: output,
    },
    builtins: {
      emotion: {
        sourceMap: isDev,
      },
      define: {
        'import.meta.env': env,
      },
    },
    watch: isDev,
    target: ELECTRON_PRELOAD,
  }

  return [multiOptions, preloadOptions]
}
