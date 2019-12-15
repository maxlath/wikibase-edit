const login = require('./login')
const GetFinalToken = require('./get_final_token')

module.exports = config => {
  const getFinalToken = GetFinalToken(config)

  if (config.credentials.oauth) return getFinalToken

  var loginCookiesPromise
  const getLoginCookies = () => {
    if (loginCookiesPromise) return loginCookiesPromise
    loginCookiesPromise = login(config)
    return loginCookiesPromise
  }

  return () => getLoginCookies().then(getFinalToken)
}
