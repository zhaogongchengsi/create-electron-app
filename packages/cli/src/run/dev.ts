import process from 'node:process'
import type { AddressInfo } from 'node:net'
import type { MultiStats } from '@rspack/core'
import { createMultiCompiler } from '@rspack/core'
import { debounce } from 'perfect-debounce'
import consola from 'consola'
import { resolve } from 'pathe'
import { loadConfig } from '../config'
import { createMultiCompilerOptions } from '../options'
import { loadVite } from '../load'
import { createAppRunning } from '../electron'
import { getPageOutDir } from '../vite'
import { isString, resolveFileName } from '../utils'

const DEV_MODE = 'development'
let count = 0

export async function runDev() {
  process.env.NODE_ENV = DEV_MODE
  const config = await loadConfig()
  const { root, output, main } = config

  const { createServer, resolveConfig } = loadVite(config)
  const { run, restart } = createAppRunning(config)

  const viteConfig = await resolveConfig({ root }, 'serve', DEV_MODE)
  const { page } = getPageOutDir(viteConfig)

  const server = await createServer({
    root,
    server: {
      port: 5678,
    },
  })

  const { httpServer } = await server.listen()
  const url = new URL('/', 'http://localhost')
  const address = httpServer!.address()! as AddressInfo
  url.port = `${address.port}`

  const pages = isString(page)
    ? `${url.toString()}${page}`
    : Object.fromEntries(Object.entries(page).map(([name, path]) => {
      return [name, `${url.toString()}${path}`]
    }))

  const mainFile = resolve(root, output, resolveFileName(main))
  const compilers = createMultiCompiler(createMultiCompilerOptions(config, { page: pages }))

  consola.start(`App run in : ${url.toString()}`)

  const watchHandler = debounce((err: Error | null, _: MultiStats | undefined) => {
    if (err)
      consola.error(err)

    if (count === 0)
      run([mainFile])
    else
      restart([mainFile])

    count += 1
  }, 300, { leading: true })

  compilers.watch({ ignored: /node_modules/ }, watchHandler)
}
