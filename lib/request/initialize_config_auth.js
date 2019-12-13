const GetAuthData = require('./get_auth_data')

module.exports = config => {
  if (!config) throw new Error('missing config')
  const credentialsKey = getCredentialsKey(config)
  const { credentials } = config

  // Generate the function only once per credentials
  if (credentials._getAuthData && credentialsKey === credentials._credentialsKey) return

  credentials._getAuthData = GetAuthData(config)
  credentials._credentialsKey = credentialsKey
}

const getCredentialsKey = config => {
  const { instance } = config
  const { oauth, username } = config.credentials
  // Namespacing keys as a oauth.consumer_key could theoretically be a username
  return username ? `${instance}:u:${username}` : `${instance}:o:${oauth.consumer_key}`
}
