import GetAuthData from './get_auth_data.js'

export default config => {
  if (!config) throw new Error('missing config')
  if (config.anonymous) return

  const credentialsKey = getCredentialsKey(config)
  const { credentials } = config

  // Generate the function only once per credentials
  if (credentials._getAuthData && credentialsKey === credentials._credentialsKey) return

  credentials._getAuthData = GetAuthData(config)
  credentials._credentialsKey = credentialsKey
}

const getCredentialsKey = config => {
  const { instance } = config
  const { oauth, username, browserSession } = config.credentials
  if (browserSession) return instance
  // Namespacing keys as a oauth.consumer_key could theoretically be a username
  return username ? `${instance}|u|${username}` : `${instance}|o|${oauth.consumer_key}`
}
