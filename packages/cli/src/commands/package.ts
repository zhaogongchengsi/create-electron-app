import { defineCommand } from 'citty'
import { runPackage } from '../run/package'

export default defineCommand({
  meta: {
    name: 'package',
  },
  run: runPackage,
})
