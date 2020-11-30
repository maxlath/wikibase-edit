const fetch = require('./fetch')
const qs = require('querystring')
const contentType = 'application/x-www-form-urlencoded'
const error_ = require('../error')
const parseSessionCookies = require('./parse_session_cookies')
const parseResponseBody = require('./parse_response_body')

module.exports = config => {
  const headers = {
    'user-agent': config.userAgent,
    'content-type': contentType
  }

  const loginUrl = `${config.instanceApiEndpoint}?action=login&format=json`

  return login(loginUrl, config, headers)
}

const login = (loginUrl, config, headers) => {
  return getLoginToken(loginUrl, config, headers)
  .then(getSessionCookies(loginUrl, config, headers))
}

const getLoginToken = (loginUrl, config, headers) => {
  const { username: lgname, password: lgpassword } = config.credentials
  const body = qs.stringify({ lgname, lgpassword })
  return fetch(loginUrl, { method: 'post', headers, body })
  .then(parseLoginCookies)
}

const getSessionCookies = (loginUrl, config, headers) => async ({ cookies, token: lgtoken }) => {
  const { username: lgname, password: lgpassword } = config.credentials
  const body = qs.stringify({ lgname, lgpassword, lgtoken })

  const headersWithCookies = Object.assign({}, headers, { Cookie: cookies })

  const res = await fetch(loginUrl, {
    method: 'post',
    headers: headersWithCookies,
    body
  })

  const resBody = await parseResponseBody(res)
  if (resBody.login.result !== 'Success') {
    throw error_.new('failed to login: invalid username/password')
  }

  const resCookies = res.headers.get('set-cookie')

  if (!resCookies) {
    throw error_.new('login error', res.statusCode, { body: resBody })
  }

  if (!sessionCookiePattern.test(resCookies)) {
    throw error_.new('invalid login cookies', { cookies: resCookies })
  }

  return parseSessionCookies(resCookies)
}

const sessionCookiePattern = /[sS]ession=\w{32}/

const parseLoginCookies = async res => {
  const body = await res.json()
  const token = body.login.token
  const cookies = res.headers.get('set-cookie')
  return { token, cookies }
}
