import process from 'node:process'
import type { AddressInfo } from 'node:net'
import type { MultiStats } from '@rspack/core'
import { createMultiCompiler } from '@rspack/core'
import { debounce } from 'perfect-debounce'
import consola from 'consola'
import { parse, resolve } from 'pathe'
import { loadConfig } from '../config'
import type { App } from '../options'
import { createMultiCompilerOptions } from '../options'
import { loadVite } from '../load'
import { createAppRunning } from '../electron'
import { getPageOutDir } from '../vite'

const DEV_MODE = 'development'

export async function runDev() {
  process.env.NODE_ENV = DEV_MODE
  const config = await loadConfig()

  const { root, output, main, preload } = config

  const { createServer } = loadVite(config)

  const { run, restart } = createAppRunning(config)
  const { resolveConfig } = loadVite(config)

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
  const mainFile = resolve(root, output, `${parse(main).name}.js`)
  const preloadFile = resolve(root, output, `${parse(preload).name}.js`)
  const address = httpServer!.address()! as AddressInfo
  url.port = `${address.port}`


  const createPages = (baseUrl: string, ) => {}

  const app: App = { preload: preloadFile, page }

  const compilers = createMultiCompiler(createMultiCompilerOptions(config, {}))

  consola.start(`App run in : ${url.toString()}`)

  let count = 0
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
