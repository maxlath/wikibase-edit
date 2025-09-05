import { newError } from '../error.js'
import { stringifyQuery } from '../utils.js'
import { getJson } from './get_json.js'
import { getSignatureHeaders } from './oauth.js'
import type { HttpHeaders } from './fetch.js'
import type { APIResponseError } from './request.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'

const contentType = 'application/x-www-form-urlencoded'

interface TokenParams {
  headers: HttpHeaders
}

export function getFinalTokenFactory (config: SerializedConfig) {
  return async function getFinalToken (loginCookies: string) {
    const { instanceApiEndpoint, credentials, userAgent } = config
    const oauthTokens = 'oauth' in credentials ? credentials.oauth : undefined

    const query = { action: 'query', meta: 'tokens', type: 'csrf', format: 'json' }
    const url: AbsoluteUrl = `${instanceApiEndpoint}?${stringifyQuery(query)}`

    const params: TokenParams = {
      headers: {
        'user-agent': userAgent,
        'content-type': contentType,
      },
    }

    if (oauthTokens) {
      const signatureHeaders = getSignatureHeaders({
        url,
        method: 'GET',
        oauthTokens,
      })
      Object.assign(params.headers, signatureHeaders)
    } else {
      params.headers.cookie = loginCookies
    }

    const body = await getJson(url, params)
    return parseTokens(loginCookies, instanceApiEndpoint, body)
  }
}

interface TokenResponse {
  error?: APIResponseError
  query?: {
    tokens: {
      csrftoken: string
    }
  }
}

export interface ParsedTokenInfo {
  token: string
  cookie: string
}

async function parseTokens (loginCookies: string, instanceApiEndpoint: AbsoluteUrl, body: TokenResponse) {
  const { error, query } = body

  if (error) throw formatError(error, body, instanceApiEndpoint)

  if (!query?.tokens) {
    throw newError('could not get tokens', { body })
  }

  const { csrftoken } = query.tokens

  if (csrftoken.length < 40) {
    throw newError('invalid csrf token', { loginCookies, body })
  }

  return {
    token: csrftoken,
    cookie: loginCookies,
  }
}

function formatError (error: APIResponseError, body, instanceApiEndpoint) {
  const err = newError(`${instanceApiEndpoint} error response: ${error.info}`, { body })
  Object.assign(err, error)

  if (error.code === 'mwoauth-invalid-authorization' && error['*'] != null) {
    const domainMatch = error['*'].match(/(https?:\/\/.*\/w\/api.php)/)
    if (domainMatch != null && domainMatch[1] !== instanceApiEndpoint) {
      const domain = domainMatch[1]
      err.message += `\n\n***This might be caused by non-matching domains***
      between the server domain:\t${domain}
      and the domain in config:\t${instanceApiEndpoint}\n`
      // @ts-expect-error
      err.context.domain = domain
      // @ts-expect-error
      err.context.instanceApiEndpoint = instanceApiEndpoint
    }
  }

  return err
}
