import GetFinalToken from './get_final_token.js'
import login from './login.js'

export default config => {
  const getFinalToken = GetFinalToken(config)

  if (config.credentials.oauth || config.credentials.browserSession) {
    return getFinalToken
  } else {
    return async () => {
      const loginCookies = await login(config)
      return getFinalToken(loginCookies)
    }
  }
}
