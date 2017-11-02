const qs = require('querystring')
const { inspect } = require('util')

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
  // Prevent to run in a 'Cannot Convert Object to Primitive Value'
  // error when logging object value
  stringify: value => {
    if (typeof value === 'string') return value
    return JSON.stringify('value')
  }
}
