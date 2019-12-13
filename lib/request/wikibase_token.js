const login = require('./login')
const getTokenGetter = require('./get_token_getter')

module.exports = config => {
  const getToken = getTokenGetter(config)

  if (config.credentials.oauth) return getToken

  var loginCookiesPromise
  const getLoginCookies = () => {
    if (loginCookiesPromise) return loginCookiesPromise
    loginCookiesPromise = login(config)
    return loginCookiesPromise
  }

  return () => getLoginCookies().then(getToken)
}
