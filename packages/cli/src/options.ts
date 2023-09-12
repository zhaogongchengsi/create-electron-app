import type { MultiRspackOptions, RspackOptions } from '@rspack/core'
import type { ResolveConfig } from './config'
import { resolveFileName } from './utils'

export const ELECTRON_MAIN = 'electron-main'
export const ELECTRON_PRELOAD = 'electron-preload'

export type Page = Record<string, string> | string

export interface Options {
  page: Page
  preload?: string
}

export function createMultiCompilerOptions(config: ResolveConfig, app: Options): MultiRspackOptions {
  const { root, output: path, main, preload, mode } = config

  if (!main)
    throw new Error('Electron main thread file is required')

  const devtool = 'source-map'
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  const watch = mode === 'development'

  const env = JSON.stringify({
    MODE: mode,
    PROD: isDev,
    DEV: isProd,
  })

  const multiOptions: RspackOptions = {
    mode,
    context: root,
    devtool,
    entry: main,
    output: {
      filename: resolveFileName(main),
      path,
    },
    builtins: {
      emotion: {
        sourceMap: isDev,
      },
      define: {
        'import.meta.env': env,
        'import.meta.app': JSON.stringify({
          pages: app.page,
          preload: app.preload,
        }),
      },
    },
    watch,
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
      path,
    },
    builtins: {
      emotion: {
        sourceMap: isDev,
      },
      define: {
        'import.meta.env': env,
      },
    },
    watch,
    target: ELECTRON_PRELOAD,
  }

  return [multiOptions, preloadOptions]
}
