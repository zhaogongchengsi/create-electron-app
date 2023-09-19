import process from 'node:process'
import type { AddressInfo } from 'node:net'
import type { MultiStats } from '@rspack/core'
import { createMultiCompiler } from '@rspack/core'
import { debounce } from 'perfect-debounce'
import consola from 'consola'
import { colors } from 'consola/utils'
import { resolve } from 'pathe'
import type { ResolvedConfig } from 'vite'
import { loadConfig } from '../config'
import { createMultiCompilerOptions } from '../options'
import { loadVite } from '../load'
import { createAppRunning } from '../electron'
import { getPageOutDir } from '../vite'
import { isString, resolveFileName } from '../utils'
import { VitePluginGetConfig } from '../plugins/vite-getconfig'

const DEV_MODE = 'development'

export async function runDev({ args }: any) {
  process.env.NODE_ENV = DEV_MODE
  const config = await loadConfig()
  const { root, output, main, electron } = config

  const { createServer } = loadVite()

  let viteConfig: ResolvedConfig
  const server = await createServer({
    root,
    server: {
      port: args.port || 5678,
    },
    plugins: [VitePluginGetConfig(config => (viteConfig = config))],
  })

  const { page } = getPageOutDir(viteConfig!)

  const { httpServer } = await server.listen()
  const address = httpServer!.address()! as AddressInfo
  const url = `http://localhost:${address.port}`

  const pages = isString(page)
    ? `${url}/${page}`
    : Object.fromEntries(Object.entries(page).map(([name, path]) => {
      return [name, `${url.toString()}${path}`]
    }))

  const mainFile = resolve(root, output, resolveFileName(main))
  const compilers = createMultiCompiler(createMultiCompilerOptions(config, { page: pages, vite: viteConfig! }))
  const run = createAppRunning(config, mainFile, ...(electron.parameter || [])!)
  consola.box(`App run in : ${colors.greenBright(url.toString())}`)

  const watchHandler = debounce((err: Error | null, _: MultiStats | undefined) => {
    if (err)
      consola.error(err)

    run()
  }, 300, { leading: true })

  compilers.watch({ ignored: /node_modules/ }, watchHandler)
}
