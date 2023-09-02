import { install } from './install'
import type { devtools } from  './type'


export function devtoolsInstall(devtoolList: devtools) {
  return Promise.all(devtoolList.map(devtool => install(devtool)))
}
