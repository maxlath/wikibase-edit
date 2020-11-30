const request = require('./request')

module.exports = (url, params = {}) => {
  // Ignore cases were a map function passed an index as second argument
  // ex: Promise.all(urls.map(getJson))
  if (typeof params !== 'object') params = {}

  params.url = url
  return request('get', params)
}
