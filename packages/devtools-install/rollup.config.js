// @ts-nocheck
import { join, resolve } from 'node:path'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import pkg from './package.json'

const resolvePath = path => resolve(join(process.cwd(), path))

const isProduction = process.env.NODE_ENV === 'production'

export default async function () {
  const plugins = [
    nodeResolve(),
    commonjs(),
    json(),
    typescript({
      tsconfig: resolve(__dirname, './tsconfig.json'),
      sourceMap: isProduction,
    }),
  ]

  const external = [
    'electron',
    ...Object.keys(pkg.dependencies),
    ...(isProduction ? [] : Object.keys(pkg.devDependencies)),
  ]

  const input = resolvePath('./src/index.ts')

  const config = (format = 'esm') => {
    return {
      input,
      output: {
        dir: resolvePath('dist'),
        entryFileNames: format === 'esm' ? 'index.js' : 'index.cjs',
        format,
      },
      sourceMap: process.env.NODE_ENV === 'development',
      external,
      plugins,
    }
  }

  return [config('esm'), config('cjs')]
}
