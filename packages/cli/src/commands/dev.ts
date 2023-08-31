
import { defineCommand } from "citty";
import { loadConfig } from '../config'

export default defineCommand({
	meta: {
		name: "dev",
	},
	async run() { 

		const conf = await loadConfig()

		console.log('dev', conf)
	}
});
