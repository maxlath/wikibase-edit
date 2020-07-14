const login = require('./login')
const GetFinalToken = require('./get_final_token')

module.exports = config => {
  const getFinalToken = GetFinalToken(config)

  if (config.credentials.oauth) return getFinalToken
  else return () => login(config).then(getFinalToken)
}
