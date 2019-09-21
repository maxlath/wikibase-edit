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
      if (err.code === 'maxlag' || err.name === 'TimeoutError') {
        const delayMs = getRetryDelay(err.headers)
        return delay(delayMs)().then(tryRequest)
      } else {
        throw err
      }
    })
  }

  return tryRequest()
}

const requestError = function (res, errorData) {
  const { code, info } = errorData
  const err = new Error(`${info} [code: ${code}]`)
  err.code = code
  err.statusCode = res.statusCode
  err.statusMessage = res.statusMessage
  err.headers = res.headers
  err.body = res.body
  err.url = res.request.uri.href
  return err
}

const getRetryDelay = headers => {
  const retryAfterSeconds = headers['retry-after']
  if (/^\d+$/.test(retryAfterSeconds)) return parseInt(retryAfterSeconds) * 1000
  else return 2000
}
