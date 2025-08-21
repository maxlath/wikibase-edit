import request from './request.js'

export default (url, params = {}) => {
  // Ignore cases were a map function passed an index as second argument
  // ex: Promise.all(urls.map(getJson))
  if (typeof params !== 'object') params = {}

  params.url = url
  return request('get', params)
}
