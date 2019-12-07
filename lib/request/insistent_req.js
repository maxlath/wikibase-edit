const fetch = require( 'cross-fetch' )
const { delay } = require('../utils')

module.exports = (verb, params, autoRetry = true) => {

  var attempts = 0
  const tryRequest = () => {
    var res;
    return fetch( params.url, Object.assign({}, params, { method: verb }) )
    .then( (r) => {
      res = r;
      return res.json();
    })
    .then(body => {
      if (body.error != null) {
        throw requestError(res, body)
      } else {
        return body
      }
    })
    .catch(err => {
      if (autoRetry === false || ++attempts > 5) throw err
      if (err.name === 'maxlag' || err.name === 'TimeoutError') {
        const delaySeconds = getRetryDelay(err.headers)
        console.warn('[wikibase-edit warn]', verb.toUpperCase(), params.url, err.message, `retrying in ${delaySeconds}s`)
        return delay(delaySeconds * 1000).then(tryRequest)
      } else {
        throw err
      }
    })
  }

  return tryRequest()
}

const requestError = function (res, body) {
  const { code, info } = body.error || {}
  const err = new Error(`${code}: ${info}`)
  err.name = code
  err.statusCode = res.statusCode
  err.statusMessage = res.statusMessage
  err.headers = res.headers
  err.body = body
  err.url = res.url
  return err
}

const getRetryDelay = headers => {
  const retryAfterSeconds = headers['retry-after']
  if (/^\d+$/.test(retryAfterSeconds)) return parseInt(retryAfterSeconds)
  else return 2
}
