import { defineCommand } from 'citty'
import { runPreview } from '../run/preview'

export default defineCommand({
  meta: {
    name: 'preview',
  },
  run: runPreview,
})
