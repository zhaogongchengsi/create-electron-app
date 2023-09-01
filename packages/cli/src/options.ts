import { parse } from 'node:path'
import type { RspackOptions } from '@rspack/core'
import type { CeaConfig } from './config'
import { plugins } from './plugins'

export enum Target {
  main = 'electron-main',
  preload = 'electron-preload',
}

function createCommonOption(config: Required<CeaConfig>): RspackOptions {
  const { mode, root } = config
  const devtool = 'source-map'

  return {
    mode,
    context: root,
    builtins: {
      emotion: {
        sourceMap: true,
      },
      define: {
        'import.meta.env': JSON.stringify({ a: 1, b: 2 }),
        'abc': JSON.stringify('const log = () => console.log(\'abc\')'),
      },
    },
    plugins,
    devtool,
  }
}

function createInputAndOutput(config: Required<CeaConfig>, t: Target): RspackOptions {
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

export function createMultiCompilerOptions(config: Required<CeaConfig>): RspackOptions[] {
  if (!config.main)
    throw new Error('Electron main thread file is required')

  const commonOptions = createCommonOption(config)
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
