const fetch = require('./fetch')
const { delay } = require('../utils')
const querystring = require('querystring')
const { getSignatureHeaders } = require('./oauth')
const checkKnownIssues = require('./check_known_issues')
const timeout = 30000

module.exports = (verb, params, autoRetry = true) => {
  const method = verb || 'get'
  const { url, oauth: oauthTokens, headers } = params
  let { body } = params
  let attempts = 1

  const tryRequest = async () => {
    if (oauthTokens) {
      const signatureHeaders = getSignatureHeaders({
        url,
        method,
        data: body,
        oauthTokens
      })
      Object.assign(headers, signatureHeaders)
    }

    if (method === 'post' && body != null) {
      body = querystring.stringify(body)
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    return fetch(url, { method, body, headers, timeout })
    .then(parseBody)
    .catch(err => {
      checkKnownIssues(err)
      if (autoRetry === false) throw err
      if (errorsWorthARetry.includes(err.name)) {
        const delaySeconds = getRetryDelay(err.headers) * attempts
        console.warn('[wikibase-edit warn]', verb.toUpperCase(), url, err.message, `retrying in ${delaySeconds}s (attempt: ${attempts++})`)
        return delay(delaySeconds * 1000).then(tryRequest)
      } else {
        throw err
      }
    })
  }

  return tryRequest()
}

const errorsWorthARetry = [
  'maxlag',
  'TimeoutError'
]

const parseBody = async res => {
  const raw = await res.text()
  let data
  try {
    data = JSON.parse(raw)
  } catch (err) {
    const customErr = new Error('Could not parse response: ' + raw)
    customErr.name = 'wrong response format'
    throw customErr
  }
  if (data.error != null) throw requestError(res, data)
  else return data
}

const requestError = (res, body) => {
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

const defaultRetryDelay = 5
const getRetryDelay = headers => {
  const retryAfterSeconds = headers && headers['retry-after']
  if (/^\d+$/.test(retryAfterSeconds)) return parseInt(retryAfterSeconds)
  else return defaultRetryDelay
}
