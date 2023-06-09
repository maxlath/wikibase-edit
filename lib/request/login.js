import qs from 'querystring'
import error_ from '../error.js'
import fetch from './fetch.js'
import parseResponseBody from './parse_response_body.js'
import parseSessionCookies from './parse_session_cookies.js'

const contentType = 'application/x-www-form-urlencoded'

export default config => {
  const headers = {
    'user-agent': config.userAgent,
    'content-type': contentType,
  }

  const loginUrl = `${config.instanceApiEndpoint}?action=login&format=json`

  return login(loginUrl, config, headers)
}

const login = async (loginUrl, config, headers) => {
  const loginCookies = await getLoginToken(loginUrl, config, headers)
  return getSessionCookies(loginUrl, config, headers, loginCookies)
}

const getLoginToken = async (loginUrl, config, headers) => {
  const { username: lgname, password: lgpassword } = config.credentials
  const body = qs.stringify({ lgname, lgpassword })
  const res = await fetch(loginUrl, { method: 'post', headers, body })
  return parseLoginCookies(res)
}

const getSessionCookies = async (loginUrl, config, headers, loginCookies) => {
  const { cookies, token: lgtoken } = loginCookies
  const { username: lgname, password: lgpassword } = config.credentials
  const body = qs.stringify({ lgname, lgpassword, lgtoken })

  const headersWithCookies = Object.assign({}, headers, { Cookie: cookies })

  const res = await fetch(loginUrl, {
    method: 'post',
    headers: headersWithCookies,
    body,
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
