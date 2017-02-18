const qs = require('querystring')

module.exports = {
  property: (key) => (obj) => obj[key],
  buildUrl: (base, query) => {
    query = qs.stringify(query)
    return `${base}?${query}`
  }
}
