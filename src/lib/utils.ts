import type { PostData, PostQuery } from './request/post.js'
import type { AbsoluteUrl } from './types/common.js'
import type { ObjectEntries } from 'type-fest/source/entries.js'

const stringNumberPattern = /^(-|\+)?\d+(\.\d+)?$/
const signedStringNumberPattern = /^(-|\+)\d+(\.\d+)?$/

export type Query = Record<string, string | number>

export function stringifyQuery (query: Query | PostQuery | PostData) {
  // @ts-expect-error
  return new URLSearchParams(query).toString()
}

export type NonEmptyString = Exclude<string, ''>
export function isNonEmptyString (str: unknown): str is NonEmptyString {
  return typeof str === 'string' && str.length > 0
}

export function buildUrl (base: AbsoluteUrl, query: Query | PostQuery) {
  return `${base}?${stringifyQuery(query)}` as AbsoluteUrl
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
export function isSignedStringNumber (str: unknown): str is SignNumber {
  return typeof str === 'string' && signedStringNumberPattern.test(str)
}
export const isArray = (array: unknown) => array instanceof Array

type PlainObject = Exclude<object, null | unknown[]>
export function isPlainObject (obj: unknown): obj is PlainObject {
  if (obj instanceof Array) return false
  if (obj === null) return false
  return typeof obj === 'object'
}
export function isntEmpty (value: unknown): value is Exclude<unknown, null | undefined> {
  return value != null
}
export function mapValues (obj, fn) {
  function aggregator (index, key) {
    index[key] = fn(key, obj[key])
    return index
  }
  return Object.keys(obj).reduce(aggregator, {})
}

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Work around the TS2345 error when using Array include method
// https://stackoverflow.com/questions/55906553/typescript-unexpected-error-when-using-includes-with-a-typed-array/70532727#70532727
// Implementation inspired by https://8hob.io/posts/elegant-safe-solution-for-typing-array-includes/#elegant-and-safe-solution
export function arrayIncludes <T extends (string | number)> (array: readonly T[], value: string | number): value is T {
  const arrayT: readonly (string | number)[] = array
  return arrayT.includes(value)
}

// Same as `arrayIncludes` but for sets
export function setHas <T extends (string | number)> (set: Set<T>, value: string | number): value is T {
  const setT: Set<string | number> = set
  return setT.has(value)
}

export function objectEntries <Obj extends object> (obj: Obj) {
  return Object.entries(obj) as ObjectEntries<Obj>
}

export function objectFromEntries <K extends string, V> (entries: [ K, V ][]) {
  return Object.fromEntries(entries) as Record<K, V>
}

export function objectValues <Obj extends object> (obj: Obj) {
  return Object.values(obj) as Obj[keyof Obj][]
}

// Source: https://www.totaltypescript.com/tips/create-your-own-objectkeys-function-using-generics-and-the-keyof-operator
export function objectKeys <Obj extends object> (obj: Obj): (keyof Obj)[] {
  return Object.keys(obj) as (keyof Obj)[]
}
