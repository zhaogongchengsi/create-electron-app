import type { ResolvedConfig } from 'vite'
import { resolve as _resolve, normalize } from 'pathe'
import { isEmpty, isString } from './utils'

export function getPageOutDir(config: ResolvedConfig) {
  const options = config.build
  const root = normalize(config.root)

  const resolve = (p: string) => normalize(_resolve(root, p))

  const outDir = resolve(options.outDir)
  const input = options.rollupOptions.input

  const isHtml = (t: string) => t.endsWith('.html')
  const page: string | Record<string, string> = isEmpty(input)
    ? 'index.html'
    : isString(input)
      ? input as string
      : Object.fromEntries(Object.entries(input as object).map(([name, path]) => {
        return isHtml(path) ? [name, resolve(path).replace(root, '')] : undefined
      }).filter(Boolean) as [[string, string]])

  return {
    outDir,
    page,
  }
}
