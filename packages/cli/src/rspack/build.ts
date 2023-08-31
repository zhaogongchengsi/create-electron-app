import { RspackOptions, rspack } from "@rspack/core";
import { type CeaConfig } from '../config'

export async function build(config: CeaConfig) {

	
	const options :RspackOptions = {
		
	}

	return rspack(options);

}