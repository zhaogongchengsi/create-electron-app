import {RspackOptions, createMultiCompiler} from "@rspack/core";
import {type CeaConfig} from '../config'

export async function build(config: CeaConfig) {

    const root = config.root
    const path = config.output!
    const watch = false
    const mode = "development"

    const devtool = "source-map"

    const options: RspackOptions[] = [
        {
            mode,
            context: root,
            entry: {
                import: config.main!,
            },
            output: {
                filename: 'main.js',
                path
            },
            watch,
            target: "electron-main",
            builtins: {
                emotion: {
                    sourceMap: true
                }
            },
            devtool
        },
        {
            mode,
            context: root,
            entry: config.preload!,
            output: {
                filename: 'preload.js',
                path
            },
            watch,
            target: "electron-preload",
			builtins: {
				emotion: {
					sourceMap: true
				}
			},
            devtool
        }

    ]

    return createMultiCompiler(options);
}