import { defineCommand } from 'citty'
import { runBuild } from '../run/build'

export default defineCommand({
  meta: {
    name: 'build',
  },
  run: runBuild,
})
