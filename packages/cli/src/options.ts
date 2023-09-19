import type { MultiRspackOptions, RspackOptions } from '@rspack/core'
import { resolve as _resolve, relative } from 'pathe'
import type { ResolvedConfig as ViteResolvedConfig } from 'vite'
import type { ResolveConfig } from './config'
import { resolveFileName } from './utils'

export const ELECTRON_MAIN = 'electron-main'
export const ELECTRON_PRELOAD = 'electron-preload'

export type Page = Record<string, string> | string

export interface Options {
  page: Page
  vite: ViteResolvedConfig
}

export function createMultiCompilerOptions(config: ResolveConfig, { page, vite }: Options): MultiRspackOptions {
  const { root, output, main, preload, mode, alias } = config

  if (!main)
    throw new Error('Electron main thread file is required')

  const isDev = mode === 'development'
  const isProd = mode === 'production'
  const devtool = isDev ? 'source-map' : false

  const mainFile = _resolve(root, output, resolveFileName(main))
  const preloadFile = preload ? relative(mainFile, _resolve(root, output, resolveFileName(preload))).substring(3) : undefined

  const env = JSON.stringify({
    MODE: mode,
    PROD: isProd,
    DEV: isDev,
  })

  const node = {
    global: false,
    __dirname: false,
  }

  const resolve = {
    alias,
  }

  const loaderOptions = {
    vite,
    ceaConfig: config,
  }

  const rules = [
    {
      test: /\.(jpg|jpeg|png|gif|bmp)$/i,
      use: [
        {
          loader: '@zzhaon/create-electron-app/picture-loader',
          options: loaderOptions,
        },
      ],
    },
  ]

  const commonOptions: RspackOptions = {
    mode,
    context: root,
    devtool,
    node,
    resolve,
    watch: isDev,
    module: {
      rules,
    },
  }

  const multiOptions: RspackOptions = {
    ...commonOptions,
    target: ELECTRON_MAIN,
    entry: {
      main,
    },
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
  }

  if (!config.preload)
    return [multiOptions]

  const preloadOptions: RspackOptions = {
    ...commonOptions,
    target: ELECTRON_PRELOAD,
    entry: {
      preload: preload!,
    },
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
  }

  return [multiOptions, preloadOptions]
}
