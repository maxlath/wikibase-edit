const GetAuthData = require('./get_auth_data')
const Get = require('./get')
const Post = require('./post')

module.exports = config => {
  if (!config) throw new Error('missing config')
  const credentialsKey = getCredentialsKey(config)
  const { credentials } = config

  // Generate the functions only once per credentials
  if (credentials._request && credentialsKey === credentials.credentialsKey) {
    return credentials._request
  }

  const getAuthData = GetAuthData(config)

  credentials._request = {
    get: Get(getAuthData, config),
    post: Post(getAuthData)
  }

  credentials.credentialsKey = credentialsKey

  return credentials._request
}

const getCredentialsKey = config => {
  const { instance } = config
  const { oauth, username } = config.credentials
  // Namespacing keys as a oauth.consumer_key could theoretically be a username
  return username ? `${instance}:u:${username}` : `${instance}:o:${oauth.consumer_key}`
}
