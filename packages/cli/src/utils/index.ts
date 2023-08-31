export {
  createSystemLink,
  createNodeModule,
  createFile,
  pathExist,
  createDir,
  findFiles,
} from './fs'

export {
  importConfig,
  requireConfig,
  _reauire,
  _import,
  dynamicImport,
  lookupFile,
} from './module'

enum toStringRes {
  object = '[object Object]',
  array = '[object Array]',
}

function objectToString(obj: any) {
  return Object.prototype.toString.call(obj)
}

export function isArray(object: any): boolean {
  return objectToString(object) === toStringRes.array
}

export function isString(object: any): boolean {
  return typeof object === 'string'
}

export function isObject(obj: any): boolean {
  if (isArray(obj))
    return false

  return typeof obj === 'object'
}

export function clearPackJson(pack: any): string {
  delete pack.dependencies
  delete pack.browserslist
  delete pack.devDependencies
  delete pack.scripts
  return JSON.stringify(pack)
}

export function debounce(func: () => void, time: number = 400) {
  let _timeId: string | number | NodeJS.Timeout | undefined
  return function () {
    clearTimeout(_timeId)
    setTimeout(() => {
      func()
    }, time)
  }
}
