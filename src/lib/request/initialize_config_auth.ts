import { getAuthDataFactory } from './get_auth_data.js'
import type { SerializedConfig } from '../types/config.js'

export function initializeConfigAuth (config: SerializedConfig) {
  if (!config) throw new Error('missing config')
  if (config.anonymous) return

  const credentialsKey = getCredentialsKey(config)
  const { credentials } = config

  // Generate the function only once per credentials
  if (credentials._getAuthData && credentialsKey === credentials._credentialsKey) return

  credentials._getAuthData = getAuthDataFactory(config)
  credentials._credentialsKey = credentialsKey
}

function getCredentialsKey (config: SerializedConfig) {
  const { instance, credentials } = config
  const oauth = 'oauth' in credentials ? credentials.oauth : undefined
  const username = 'username' in credentials ? credentials.username : undefined
  const browserSession = 'browserSession' in credentials ? credentials.browserSession : undefined
  if (browserSession) return instance
  // Namespacing keys as a oauth.consumer_key could theoretically be a username
  return username ? `${instance}|u|${username}` : `${instance}|o|${oauth.consumer_key}`
}
