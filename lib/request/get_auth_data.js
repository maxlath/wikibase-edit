const GetToken = require('./get_token')
const error_ = require('../error')

module.exports = config => {
  const getToken = GetToken(config)

  let tokenPromise
  let lastTokenRefresh = 0

  const refreshToken = refresh => {
    const now = Date.now()
    if (!refresh && now - lastTokenRefresh < 30 * 1000) {
      throw error_.new("last token refreshed less than 30 seconds ago: won't retry", { config })
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
