import { parse } from 'pathe'

export const isString = (t: any): boolean => typeof t === 'string'
export const isEmpty = (t: any) => t === undefined || t === null || t === '' || t === false || t === 0
export const isObject = (t: any): boolean => !isEmpty(t) && typeof t === 'object' && t !== null

export const resolveFileName = (p: string) => `${parse(p).name}`
