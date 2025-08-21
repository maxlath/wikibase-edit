import error_ from '../error.js'
import GetToken from './get_token.js'

export default config => {
  const getToken = GetToken(config)

  let tokenPromise
  let lastTokenRefresh = 0

  const refreshToken = refresh => {
    const now = Date.now()
    if (!refresh && now - lastTokenRefresh < 5000) {
      throw error_.new("last token refreshed less than 10 seconds ago: won't retry", { config })
    }
    lastTokenRefresh = now
    tokenPromise = getToken()
    return tokenPromise
  }

  return params => {
    if (params && params.refresh) return refreshToken(true)
    else return tokenPromise || refreshToken()
  }
}
