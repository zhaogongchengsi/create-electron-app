import { join } from 'pathe'
import { getOptions } from './utils'

export default function loader() {
  const { vite } = getOptions(this)
  const { publicDir, build, command, root } = vite

  const dir = command === 'build' ? join(root, build.outDir) : publicDir

  console.log('resource', this.context, this.resource)

  return 'module.exports = \'loader\''
}
