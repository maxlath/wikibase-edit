const fetch = require('cross-fetch')
const { delay } = require('../utils')
const querystring = require('querystring')
const { getOAuthData, getSignatureHeaders } = require('./oauth')

module.exports = (verb, params, autoRetry = true) => {
  const method = verb || 'get'
  const { url, oauth: oauthTokens, headers } = params
  let { body } = params

  var oauthData
  if (oauthTokens) {
    oauthData = getOAuthData(oauthTokens)
  }

  var attempts = 0

  const tryRequest = async () => {
    if (oauthData) {
      const signatureHeaders = getSignatureHeaders({
        url,
        method,
        data: body,
        secret: oauthTokens.token_secret,
        key: oauthTokens.token,
        oauth: oauthData
      })
      Object.assign(headers, signatureHeaders)
    }

    if (method === 'post' && body != null) {
      body = querystring.stringify(body)
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    // TODO: recover request timeout
    return fetch(url, { method, body, headers })
    .then(parseBody)
    .catch(err => {
      if (autoRetry === false || ++attempts > 5) throw err
      if (err.name === 'maxlag' || err.name === 'TimeoutError') {
        const delaySeconds = getRetryDelay(err.headers)
        console.warn('[wikibase-edit warn]', verb.toUpperCase(), url, err.message, `retrying in ${delaySeconds}s`)
        return delay(delaySeconds * 1000).then(tryRequest)
      } else {
        throw err
      }
    })
  }

  return tryRequest()
}

const parseBody = res => {
  return res.json()
  .then(resBody => {
    if (resBody.error != null) throw requestError(res, resBody)
    else return resBody
  })
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

const defaultRetryDelay = 2
const getRetryDelay = headers => {
  const retryAfterSeconds = headers['retry-after']
  if (/^\d+$/.test(retryAfterSeconds)) return parseInt(retryAfterSeconds)
  else return defaultRetryDelay
}
