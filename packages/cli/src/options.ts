import {CeaConfig} from "./config";
import { parse } from 'path'
import {RspackOptions} from "@rspack/core";

enum Target {
    main= 'electron-main',
    preload = 'electron-preload'
}

function createCommonOption (config: Required<CeaConfig>) :RspackOptions {
    const { mode, root } = config
    const devtool = "source-map"

    return {
        mode,
        context: root,
        builtins: {
            emotion: {
                sourceMap: true
            }
        },
        devtool
    }
}

function createInputAndOutput (config: Required<CeaConfig>, t: Target) :RspackOptions {

    const { output: path, main, preload, mode  } = config
    const watch = mode === "development"

    let entry = main

    if (t === Target.main) {
        entry = main
    } else {
        entry = preload
    }

    const { name } = parse(entry)

    return {
        entry,
        output: {
            filename: `${name}.js`,
            path
        },
        watch,
        target: t,
    }
}

export function createMultiCompilerOptions (config: Required<CeaConfig>) :RspackOptions[] {

    if (!config.main) {
        throw new Error(`Electron main thread file is required`)
    }

    const commonOptions = createCommonOption(config)
    const mainOptions = createInputAndOutput(config, Target.main)

    const multiOptions :RspackOptions[] = [
        {
            ...commonOptions,
            ...mainOptions
        }
    ]

    if (config.preload) {
        const preloadOptions = createInputAndOutput(config, Target.preload)
        multiOptions.push({
            ...commonOptions,
            ...preloadOptions
        })
    }

    return multiOptions
}
