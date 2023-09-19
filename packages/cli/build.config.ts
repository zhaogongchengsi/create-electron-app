import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/cli',
    'src/loaders/file-loader',
  ],
  declaration: true,
  clean: true,
  outDir: 'dist',
  rollup: {
    emitCJS: true,
  },
})
