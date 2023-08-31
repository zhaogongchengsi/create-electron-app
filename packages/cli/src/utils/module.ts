import { existsSync, readFileSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const _REQUIRE = createRequire(import.meta.url)

export async function _reauire(path: string) {
  return _REQUIRE(path)
}

export async function _import(path: string) {
  return import(pathToFileURL(path).href)
}

export async function importConfig(path: string) {
  const raw = await _import(path)
  const conf = raw.default ?? raw
  return typeof conf === 'function' ? conf() : conf
}

export async function requireConfig(path: string) {
  const raw = await _reauire(path)
  const conf = raw.__esModule ? raw.default : raw
  return typeof conf === 'function' ? conf() : conf
}

export async function dynamicImport(name: string) {
  let module
  try {
    module = await _reauire(name)
  }
  catch (err) {
    throw new Error(
      `The ${name} module was not found. Try to install ${name} by running npm install ${name}`,
    )
  }

  return module
}

export function lookupFile(
  dir: string,
  formats: string[],
  options?: any,
): string | undefined {
  for (const format of formats) {
    const fullPath = join(dir, format)
    if (existsSync(fullPath) && statSync(fullPath).isFile()) {
      const result = options?.pathOnly
        ? fullPath
        : readFileSync(fullPath, 'utf-8')
      if (!options?.predicate || options.predicate(result))
        return result
    }
  }
  const parentDir = dirname(dir)
  if (
    parentDir !== dir
    && (!options?.rootDir || parentDir.startsWith(options?.rootDir))
  )
    return lookupFile(parentDir, formats, options)
}
