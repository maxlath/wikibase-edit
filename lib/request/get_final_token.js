const getJson = require('./get_json')
const { getSignatureHeaders } = require('./oauth')
const contentType = 'application/x-www-form-urlencoded'
const error_ = require('../error')

module.exports = config => async loginCookies => {
  const { instanceApiEndpoint, credentials, userAgent } = config
  const { oauth: oauthTokens } = credentials

  const url = `${instanceApiEndpoint}?action=query&meta=tokens&type=csrf&format=json`

  const params = {
    headers: {
      'user-agent': userAgent,
      'content-type': contentType
    }
  }

  if (oauthTokens) {
    const signatureHeaders = getSignatureHeaders({
      url,
      method: 'GET',
      oauthTokens
    })
    Object.assign(params.headers, signatureHeaders)
  } else {
    params.headers.cookie = loginCookies
  }

  const body = await getJson(url, params)
  return parseTokens(loginCookies, instanceApiEndpoint, body)
}

const parseTokens = async (loginCookies, instanceApiEndpoint, body) => {
  const { error, query } = body

  if (error) throw formatError(error, body, instanceApiEndpoint)

  const { csrftoken } = query.tokens

  if (csrftoken.length < 40) {
    throw error_.new('invalid csrf token', { loginCookies, body })
  }

  return {
    token: csrftoken,
    cookie: loginCookies
  }
}

const formatError = (error, body, instanceApiEndpoint) => {
  const err = error_.new(`${instanceApiEndpoint} error response: ${error.info}`, { body })
  Object.assign(err, error)

  if (error.code === 'mwoauth-invalid-authorization' && error['*'] != null) {
    const domainMatch = error['*'].match(/(https?:\/\/.*\/w\/api.php)/)
    if (domainMatch != null && domainMatch[1] !== instanceApiEndpoint) {
      const domain = domainMatch[1]
      err.message += `\n\n***This might be caused by non-matching domains***
      between the server domain:\t${domain}
      and the domain in config:\t${instanceApiEndpoint}\n`
      err.context.domain = domain
      err.context.instanceApiEndpoint = instanceApiEndpoint
    }
  }

  return err
}
