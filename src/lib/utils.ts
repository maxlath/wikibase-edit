import type { AbsoluteUrl } from './types/common'

const stringNumberPattern = /^(-|\+)?\d+(\.\d+)?$/
const signedStringNumberPattern = /^(-|\+)\d+(\.\d+)?$/

type Query = Record<string, string | number>

export function stringifyQuery (query: Query) {
  // @ts-expect-error
  return new URLSearchParams(query).toString()
}

export type NonEmptyString = Exclude<string, ''>
export function isNonEmptyString (str: unknown): str is NonEmptyString {
  return typeof str === 'string' && str.length > 0
}

export function buildUrl (base: AbsoluteUrl, query: Query) {
  return `${base}?${stringifyQuery(query)}`
}
// helpers to simplify polymorphisms
export function forceArray <T> (obj: T | T[]): T[] {
  if (obj == null) return []
  if (!(obj instanceof Array)) return [ obj ]
  return obj
}
export const isString = (str: unknown) => typeof str === 'string'
export const isNumber = (num: unknown) => typeof num === 'number'
export function isStringNumber (str: string): str is `${number}` {
  return stringNumberPattern.test(str)
}

type Sign = '-' | '+'
type SignNumber = `${Sign}${number}`
export function isSignedStringNumber (str: string): str is SignNumber {
  return signedStringNumberPattern.test(str)
}
export const isArray = (array: unknown) => array instanceof Array
export function isPlainObject (obj: unknown): obj is object {
  if (obj instanceof Array) return false
  if (obj === null) return false
  return typeof obj === 'object'
}
export function isntEmpty (value: unknown): value is Exclude<unknown, null | undefined> {
  return value != null
}
export function flatten <T> (arrays: (T | T[])[]): T[] {
  return [].concat(...arrays)
}
export function map (obj, fn) {
  function aggregator (index, key) {
    index[key] = fn(key, obj[key])
    return index
  }
  return Object.keys(obj).reduce(aggregator, {})
}

export function values <Obj> (obj: Obj) {
  return Object.values(obj) as Obj[keyof Obj][]
}

export function uniq <T> (array: T[]) {
  return Array.from(new Set(array))
}

export function difference <A, B> (values: A[], excluded: B[]): Exclude<A, B> {
  return values.filter(value => !arrayIncludes(excluded, value))
}
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Work around the TS2345 error when using Array include method
// https://stackoverflow.com/questions/55906553/typescript-unexpected-error-when-using-includes-with-a-typed-array/70532727#70532727
// Implementation inspired by https://8hob.io/posts/elegant-safe-solution-for-typing-array-includes/#elegant-and-safe-solution
export function arrayIncludes <T extends (string | number)> (array: readonly T[], value: string | number): value is T {
  const arrayT: readonly (string | number)[] = array
  return arrayT.includes(value)
}
