import { defineCommand } from 'citty'
import { runDev } from '../run/dev'

export default defineCommand({
  meta: {
    name: 'dev',
  },
  run: runDev,
})
