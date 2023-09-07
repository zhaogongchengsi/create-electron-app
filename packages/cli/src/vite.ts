import type { ResolvedConfig } from 'vite'
import { resolve as _resolve, normalize } from 'pathe'

// This code comes from the vite source code
export function getPageOutDir(config: ResolvedConfig) {
  const options = config.build
  const root = normalize(config.root)

  const resolve = (p: string) => normalize(_resolve(root, p))

  const outDir = resolve(options.outDir)
  let pages: string | Record<string, string> = 'index.html'
  const input = options.rollupOptions.input

  if (typeof input === 'object') {
    pages = {}
    Object.entries(input).forEach(([name, path]) => {
      if (path.endsWith('.html'))
        Reflect.set(pages as Record<string, string>, name, resolve(path).replace(root, ''))
    })
  }

  if (typeof input === 'string' && input.endsWith('.html'))
    pages = resolve(input).replace(root, '')

  return {
    outDir,
    pages,
  }
}
