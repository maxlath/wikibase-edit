const qs = require('querystring')

module.exports = {
  isNonEmptyString: (str) => typeof str === 'string' && str.length > 0,
  property: (key) => (obj) => obj[key],
  buildUrl: (base, query) => {
    query = qs.stringify(query)
    return `${base}?${query}`
  }
}
