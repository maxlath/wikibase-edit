import { stringifyQuery, wait } from '../utils.js'
import checkKnownIssues from './check_known_issues.js'
import fetch from './fetch.js'
import { getSignatureHeaders } from './oauth.js'
import parseResponseBody from './parse_response_body.js'

const timeout = 30000

export default async (verb, params) => {
  const method = verb || 'get'
  const { url, body, oauth: oauthTokens, headers, autoRetry = true, httpRequestAgent } = params
  const maxlag = body && body.maxlag
  let attempts = 1

  let bodyStr
  if (method === 'post' && body != null) {
    bodyStr = stringifyQuery(body)
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  const tryRequest = async () => {
    if (oauthTokens) {
      const signatureHeaders = getSignatureHeaders({
        url,
        method,
        data: body,
        oauthTokens,
      })
      Object.assign(headers, signatureHeaders)
    }

    try {
      const res = await fetch(url, { method, body: bodyStr, headers, timeout, agent: httpRequestAgent })
      return await parseResponseBody(res)
    } catch (err) {
      checkKnownIssues(url, err)
      if (autoRetry === false) throw err
      if (errorIsWorthARetry(err)) {
        const delaySeconds = getRetryDelay(err.headers) * attempts
        retryWarn(verb, url, err, delaySeconds, attempts++, maxlag)
        await wait(delaySeconds * 1000)
        return tryRequest()
      } else {
        throw err
      }
    }
  }

  return tryRequest()
}

const errorIsWorthARetry = err => {
  if (errorsWorthARetry.has(err.name) || errorsWorthARetry.has(err.type)) return true
  // failed-save might be a recoverable error from the server
  // See https://github.com/maxlath/wikibase-cli/issues/150
  if (err.name === 'failed-save') {
    const { messages } = err.body.error
    return !messages.some(isValidationErrorMessage)
  }
  return false
}

const isValidationErrorMessage = message => message.name.startsWith('wikibase-validator')

const errorsWorthARetry = new Set([
  'maxlag',
  'TimeoutError',
  'request-timeout',
  'wrong response format',
])

const defaultRetryDelay = 5
const getRetryDelay = headers => {
  const retryAfterSeconds = headers && headers['retry-after']
  if (/^\d+$/.test(retryAfterSeconds)) return parseInt(retryAfterSeconds)
  else return defaultRetryDelay
}

const retryWarn = (verb, url, err, delaySeconds, attempts, maxlag) => {
  verb = verb.toUpperCase()
  console.warn(`[wikibase-edit][WARNING] ${verb} ${url}
    ${err.message}
    retrying in ${delaySeconds}s (attempt: ${attempts}, maxlag: ${maxlag}s)`)
}
