import { type ChildProcess, spawn } from 'node:child_process'
import { exit } from 'node:process'
import type { ResolveConfig } from './config'
import { loadElectron } from './load'

export function createAppRunning(config: ResolveConfig, ...args: string[]) {
  if (!config.electron.program) {
    const electron = loadElectron(config)
    if (!electron) {
      throw new Error(
        'electron may not be installed, try running npm install electron --save-dev and try again',
      )
    }
    config.electron.program = electron
  }

  const { mode, root, electron } = config
  let electronProcess: ChildProcess | null = null

  const createElectronProcess = () => {
    electronProcess = spawn(electron.program!, args, {
      cwd: root,
      env: {
        NODE_ENV: mode,
      },
      stdio: 'inherit',
    })

    electronProcess.on('exit', (code) => {
      if (code != null && code === 0)
        exit()

      electronProcess = null
    })
  }

  return () => {
    if (electronProcess) {
      electronProcess.kill('SIGTERM')
      electronProcess.on('close', () => {
        electronProcess = null

        createElectronProcess()
      })
    }
    else {
      createElectronProcess()
    }
  }
}
