const breq = require('bluereq')
const { delay } = require('../utils')

module.exports = (verb, params, autoRetry = true) => {
  var attempts = 0
  const tryRequest = () => {
    return breq[verb](params)
    .then(res => {
      const { body } = res
      if (body.error != null) {
        throw requestError(res, body.error)
      } else {
        return body
      }
    })
    .timeout(30000)
    .catch(err => {
      if (autoRetry === false || ++attempts > 5) throw err
      if (err.name === 'maxlag' || err.name === 'TimeoutError') {
        const delaySeconds = getRetryDelay(err.headers)
        console.warn('[wikibase-edit warn]', verb.toUpperCase(), params.url, err.message, `retrying in ${delaySeconds}s`)
        return delay(delaySeconds * 1000)().then(tryRequest)
      } else {
        throw err
      }
    })
  }

  return tryRequest()
}

const requestError = function (res, errorData) {
  const { code, info } = errorData
  const err = new Error(`${code}: ${info}`)
  err.name = code
  err.statusCode = res.statusCode
  err.statusMessage = res.statusMessage
  err.headers = res.headers
  err.body = res.body
  err.url = res.request.uri.href
  return err
}

const getRetryDelay = headers => {
  const retryAfterSeconds = headers['retry-after']
  if (/^\d+$/.test(retryAfterSeconds)) return parseInt(retryAfterSeconds)
  else return 2
}
