const qs = require('querystring')

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
  isNumber: num => typeof num === 'number',
  isArray: array => array instanceof Array
}
