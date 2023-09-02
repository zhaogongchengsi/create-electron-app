import type { ChildProcess } from 'node:child_process'
import { spawn } from 'node:child_process'
import type { UltimatelyCeaConfig } from './config'
import { loadElectron } from './load'

export function createAppRunning(config: UltimatelyCeaConfig) {
  const electron = loadElectron(config)
  if (!electron) {
    throw new Error(
      'electron may not be installed, try running npm install electron --save-dev and try again',
    )
  }

  const { mode, root } = config
  let electronProcess: ChildProcess | null = null

  function run(_args: string[]) {
    electronProcess = spawn(electron, _args, {
      cwd: root,
      env: {
        NODE_ENV: mode,
      },
      stdio: 'inherit',
    })
    electronProcess.on('close', (code) => {
      // 处理子进程关闭
      electronProcess = null
    })
  }

  function restart(_args: string[]) {
    if (electronProcess) {
      electronProcess.kill('SIGTERM')
      electronProcess.on('close', () => {
        run(_args)
      })
    }
    else {
      run(_args)
    }
  }

  return {
    run,
    restart,
  }
}
