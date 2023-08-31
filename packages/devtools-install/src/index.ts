import type { devtools } from '../types'
import { install } from './install'

export function devtoolsInstall(devtoolList: devtools) {
  return Promise.all(devtoolList.map(devtool => install(devtool)))
}
