import type { MultiStats } from '@rspack/core'
import { createMultiCompiler } from '@rspack/core'
import { debounce } from 'perfect-debounce'
import consola from 'consola'
import { loadConfig } from '../config'
import type { CeaConfig } from '../config'
import { createMultiCompilerOptions } from '../options'
import { loadVite } from '../vite'

export async function runDev() {
  const { config } = await loadConfig()
  const _config = config as Required<CeaConfig>

  const { root, output, main } = _config

  const { createServer } = await loadVite(_config)

  const server = await createServer({
    root: _config.root,
    server: {
      port: 5678,
    },
  })

  await server.listen()

  const opt = createMultiCompilerOptions(_config)
  const compilers = createMultiCompiler(opt)

  server.printUrls()

  const watchHandler = debounce((err: Error | null, _: MultiStats | undefined) => {
    if (err)
      consola.error(err)

    // const mainFile = resolve(root, output, `${parse(main).name}.js`)
    //
    // console.log(mainFile)
  }, 300, { leading: true })

  compilers.watch({ ignored: /node_modules/ }, watchHandler)
}
