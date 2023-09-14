import { defineCommand } from 'citty'
import { runDev } from '../run/dev'

export default defineCommand({
  meta: {
    name: 'dev',
  },
  args: {
    port: {
      type: 'string',
      description: 'Set vite port',
      alias: 'p',
    },
    debug: {
      type: 'string',
      description: 'Enable debug mode',
      alias: 'd',
    },
  },
  run: runDev,
})
