
import { defineCommand } from "citty";
import {CeaConfig, loadConfig} from '../config'
import { createMultiCompilerOptions } from '../options'
import { createMultiCompiler } from "@rspack/core";
import consola from 'consola'

export default defineCommand({
	meta: {
		name: "dev",
	},
	async run() { 

		const { config } = await loadConfig()
		const opt = createMultiCompilerOptions(config as Required<CeaConfig>)
		const compilers = createMultiCompiler(opt)

		compilers.run((error, state) => {
			if (error) {
				consola.error(error)
				return
			}

			consola.success(`成功`)
		})
	}
});
