import process from 'node:process'
import type { AddressInfo } from 'node:net'
import type { MultiStats } from '@rspack/core'
import { createMultiCompiler } from '@rspack/core'
import { debounce } from 'perfect-debounce'
import consola from 'consola'
import { parse, resolve } from 'pathe'
import { loadConfig } from '../config'
import type { CeaConfig } from '../config'
import { createMultiCompilerOptions } from '../options'
import { loadVite } from '../vite'

const DEV_MODE = 'development'

export async function runDev() {
  process.env.NODE_ENV = DEV_MODE
  const { config } = await loadConfig()
  const _config = config as Required<CeaConfig>

  const { root, output, main, preload } = _config

  const { createServer } = await loadVite(_config)

  const server = await createServer({
    root: _config.root,
    server: {
      port: 5678,
    },
  })

  const { httpServer } = await server.listen()

  const mainFile = resolve(root, output, `${parse(main).name}.js`)
  const preloadFile = resolve(root, output, `${parse(preload).name}.js`)
  const address = httpServer!.address()! as AddressInfo
  const loadUrl = `http://localhost:${address.port}`

  const opt = createMultiCompilerOptions(_config, { app: { loadUrl, preloadUrl: preloadFile, mainUrl: mainFile } })
  const compilers = createMultiCompiler(opt)

  consola.start(`App run in : ${loadUrl}`)

  const watchHandler = debounce((err: Error | null, _: MultiStats | undefined) => {
    if (err)
      consola.error(err)

    consola.log('Start App ...')
    //
    // console.log(mainFile)
  }, 300, { leading: true })

  compilers.watch({ ignored: /node_modules/ }, watchHandler)
}
