import { createRequire } from 'node:module'
import type { devtool } from '../types'
import { getExtensionDirPath, searchExtension } from './extensionsPath'

const _require = createRequire(__dirname)

function getElectron() {
  const electron = _require('electron')
  if (!electron)
    throw new Error('Electron does not exist Check whether it is installed')

  return electron
}

export async function install(tool: devtool) {
  const extDirPath = getExtensionDirPath(tool.type)
  if (!extDirPath) {
    throw new Error(
      `${tool.name} > Could not find the default installation location for ${tool.type} extension`,
    )
  }
  const extPath = await searchExtension(extDirPath, tool.id)
  return await loadExtension(extPath)
}

function loadExtension(path: string) {
  const electron = getElectron()
  return new Promise((res, rej) => {
    electron.app.whenReady().then(() => {
      electron.session.defaultSession
        .loadExtension(path)
        .then(() => {
          res(true)
        })
        .catch(rej)
    })
  })
}
