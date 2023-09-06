import type { ResolvedConfig } from 'vite'
import { resolve as _resolve } from 'pathe'

// This code comes from the vite source code
export function getInputOutDir(config: ResolvedConfig) {
  const options = config.build
  const libOptions = options.lib

  const resolve = (p: string) => _resolve(config.root, p)

  const input = libOptions
    ? options.rollupOptions?.input || (typeof libOptions.entry === 'string'
      ? resolve(libOptions.entry)
      : Array.isArray(libOptions.entry)
        ? libOptions.entry.map(resolve)
        : Object.fromEntries(Object.entries(libOptions.entry).map(([alias, file]) => [alias, resolve(file)])))
    : typeof options.ssr === 'string'
      ? resolve(options.ssr)
      : options.rollupOptions?.input || resolve('index.html')

  const outDir = resolve(options.outDir)
}
