import { stringifyQuery, wait } from '../utils.js'
import checkKnownIssues from './check_known_issues.js'
import { customFetch } from './fetch.js'
import { getSignatureHeaders } from './oauth.js'
import parseResponseBody from './parse_response_body.js'

const timeout = 30000

export default async (verb, params) => {
  const method = verb || 'get'
  const { url, body, oauth: oauthTokens, headers, autoRetry = true, httpRequestAgent } = params
  const maxlag = body?.maxlag
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
      const res = await customFetch(url, { method, body: bodyStr, headers, timeout, agent: httpRequestAgent })
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
        err.context ??= {}
        err.context.request = { url, body }
        throw err
      }
    }
  }

  return tryRequest()
}

const errorIsWorthARetry = err => {
  if (errorsWorthARetry.has(err.name) || errorsWorthARetry.has(err.type) || errorsCodeWorthARetry.has(err.code || err.cause?.code)) return true
  // failed-save might be a recoverable error from the server
  // See https://github.com/maxlath/wikibase-cli/issues/150
  if (err.name === 'failed-save') {
    const { messages } = err.body.error
    return !messages.some(isNonRecoverableFailedSave)
  }
  return false
}

const isNonRecoverableFailedSave = message => message.name.startsWith('wikibase-validator') || nonRecoverableFailedSaveMessageNames.has(message.name)

const errorsWorthARetry = new Set([
  'maxlag',
  'TimeoutError',
  'request-timeout',
  'wrong response format',
])

const errorsCodeWorthARetry = new Set([
  'ECONNREFUSED',
  'UND_ERR_CONNECT_TIMEOUT',
])

const nonRecoverableFailedSaveMessageNames = new Set([
  'protectedpagetext',
  'permissionserrors',
])

const defaultRetryDelay = 5
const getRetryDelay = headers => {
  const retryAfterSeconds = headers?.['retry-after']
  if (/^\d+$/.test(retryAfterSeconds)) return parseInt(retryAfterSeconds)
  else return defaultRetryDelay
}

const retryWarn = (verb, url, err, delaySeconds, attempts, maxlag) => {
  verb = verb.toUpperCase()
  const maxlagStr = typeof maxlag === 'number' ? `${maxlag}s` : maxlag
  console.warn(`[wikibase-edit][WARNING] ${verb} ${url}
    ${err.message}
    retrying in ${delaySeconds}s (attempt: ${attempts}, maxlag: ${maxlagStr})`)
}
