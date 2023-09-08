import { parse } from 'node:path'
import type { Plugins, RspackOptions } from '@rspack/core'
import type { UltimatelyCeaConfig } from './config'
import { plugins as commonPlugins } from './plugins'

export enum Target {
  main = 'electron-main',
  preload = 'electron-preload',
}

// todo: pages
export type Page = Record<string, string> | string

export interface App {
  page: Page
  baseUrl?: string
  preloadUrl?: string
}
export interface InjectOptions {
  app?: App
  plugins?: Plugins
}

function createCommonOption(config: UltimatelyCeaConfig, injectOptions: InjectOptions = {}): RspackOptions {
  const { mode, root, appData } = config
  const devtool = 'source-map'
  const { app, plugins: jp } = injectOptions

  const plugins = [...commonPlugins, ...(jp || [])]

  const isDev = mode === 'development'
  const isProd = mode === 'production'

  return {
    mode,
    context: root,
    builtins: {
      emotion: {
        sourceMap: isDev,
      },
      define: {
        'import.meta.env': JSON.stringify({
          MODE: mode,
          PROD: isDev,
          DEV: isProd,
        }),
        'import.meta.app': JSON.stringify({
          ...app,
          data: appData,
        }),
      },
    },
    plugins,
    devtool,
  }
}

function createInputAndOutput(config: UltimatelyCeaConfig, t: Target): RspackOptions {
  const { output: path, main, preload, mode } = config
  const watch = mode === 'development'
  // const watch = true

  let entry = main

  if (t === Target.main)
    entry = main
  else
    entry = preload

  const { name } = parse(entry)

  return {
    entry,
    output: {
      filename: `${name}.js`,
      path,
    },
    watch,
    target: t,
  }
}

export function createMultiCompilerOptions(config: UltimatelyCeaConfig, injectOptions: InjectOptions = {}): RspackOptions[] {
  if (!config.main)
    throw new Error('Electron main thread file is required')

  const commonOptions = createCommonOption(config, injectOptions)
  const mainOptions = createInputAndOutput(config, Target.main)

  const multiOptions: RspackOptions[] = [
    {
      ...commonOptions,
      ...mainOptions,
    },
  ]

  if (config.preload) {
    const preloadOptions = createInputAndOutput(config, Target.preload)
    multiOptions.push({
      ...commonOptions,
      ...preloadOptions,
    })
  }

  return multiOptions
}
