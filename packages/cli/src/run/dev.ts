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
import { loadVite } from '../load'
import { createAppRunning } from '../electron'

const DEV_MODE = 'development'

export async function runDev() {
  process.env.NODE_ENV = DEV_MODE
  const { config } = await loadConfig()
  const _config = config as Required<CeaConfig>

  const { root, output, main, preload } = _config

  const { createServer } = loadVite(_config)

  const { run, restart } = createAppRunning(_config)

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

  const injectOptions = { app: { loadUrl, preloadUrl: preloadFile } }

  const opt = createMultiCompilerOptions(_config, injectOptions)
  const compilers = createMultiCompiler(opt)

  consola.start(`App run in : ${loadUrl}`)

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
