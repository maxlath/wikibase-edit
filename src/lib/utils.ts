const stringNumberPattern = /^(-|\+)?\d+(\.\d+)?$/
const signedStringNumberPattern = /^(-|\+)\d+(\.\d+)?$/

export const stringifyQuery = query => new URLSearchParams(query).toString()

export const isNonEmptyString = str => typeof str === 'string' && str.length > 0
export function buildUrl (base, query) {
  return `${base}?${stringifyQuery(query)}`
}
// helpers to simplify polymorphisms
export function forceArray (obj) {
  if (obj == null) return []
  if (!(obj instanceof Array)) return [ obj ]
  return obj
}
export const isString = str => typeof str === 'string'
export const isNumber = num => typeof num === 'number'
export const isStringNumber = str => stringNumberPattern.test(str)
export const isSignedStringNumber = str => signedStringNumberPattern.test(str)
export const isArray = array => array instanceof Array
export function isPlainObject (obj: unknown): obj is object {
  if (obj instanceof Array) return false
  if (obj === null) return false
  return typeof obj === 'object'
}
export const isntEmpty = value => value != null
export const flatten = arrays => [].concat(...arrays)
export function map (obj, fn) {
  function aggregator (index, key) {
    index[key] = fn(key, obj[key])
    return index
  }
  return Object.keys(obj).reduce(aggregator, {})
}
export const values = obj => Object.keys(obj).map(key => obj[key])
export const uniq = array => Array.from(new Set(array))
export function difference (values, excluded) {
  return values.filter(value => !excluded.includes(value))
}
export const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
