const qs = require('querystring')
const { inspect } = require('util')
const stringNumberPattern = /^(-|\+)?\d+(\.\d+)?$/
const signedStringNumberPattern = /^(-|\+)\d+(\.\d+)?$/

module.exports = {
  isNonEmptyString: str => typeof str === 'string' && str.length > 0,
  property: key => obj => obj[key],
  buildUrl: (base, query) => {
    query = qs.stringify(query)
    return `${base}?${query}`
  },
  // helpers to simplify polymorphisms
  forceArray: obj => {
    if (obj == null) return []
    if (!(obj instanceof Array)) return [ obj ]
    return obj
  },
  isString: str => typeof str === 'string',
  isNumber: num => typeof num === 'number',
  isStringNumber: str => stringNumberPattern.test(str),
  isSignedStringNumber: str => signedStringNumberPattern.test(str),
  isArray: array => array instanceof Array,
  isPlainObject: obj => {
    if (obj instanceof Array) return false
    if (obj === null) return false
    return typeof obj === 'object'
  },
  flatten: arrays => [].concat.apply([], arrays),
  // Deep logging without the need to have access the config object
  // Useful in development
  inspect: (label, obj) => console.log(label, inspect(obj, false, null)),
  map: (obj, fn) => {
    const aggregator = (index, key) => {
      index[key] = fn(key, obj[key])
      return index
    }
    return Object.keys(obj).reduce(aggregator, {})
  },
  buildKey: (...args) => args.map(stringify).join(':'),
  values: obj => Object.keys(obj).map(key => obj[key])
}

// Prevent to run in a 'Cannot Convert Object to Primitive Value'
// error when logging object value
const stringify = value => {
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}
