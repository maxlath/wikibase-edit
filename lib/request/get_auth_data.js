const wbToken = require('wikibase-token')

module.exports = tokenConfig => {
  const getToken = wbToken(tokenConfig)

  var tokenPromise, lastTokenRefresh = 0

  const refreshToken = () => {
    now = Date.now()
    if (now - lastTokenRefresh < 30 * 1000) {
      throw new Error("last token refreshed less than 30 seconds ago: won't retry")
    }
    lastTokenRefresh = now
    tokenPromise = getToken()
    return tokenPromise
  }

  return () => tokenPromise || refreshToken()
}
