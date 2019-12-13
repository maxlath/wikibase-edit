const wbToken = require('./wikibase_token')
const error_ = require('../error')

module.exports = config => {
  const getToken = wbToken(config)

  var tokenPromise
  var lastTokenRefresh = 0

  const refreshToken = () => {
    const now = Date.now()
    if (now - lastTokenRefresh < 30 * 1000) {
      throw error_.new("last token refreshed less than 30 seconds ago: won't retry", { config })
    }
    lastTokenRefresh = now
    tokenPromise = getToken()
    return tokenPromise
  }

  return params => {
    if (params && params.refresh) return refreshToken()
    else return tokenPromise || refreshToken()
  }
}
