import { getFinalTokenFactory, type ParsedTokenInfo } from './get_final_token.js'
import login from './login.js'
import type { SerializedConfig } from '../types/config.js'

export function getTokenFactory (config: SerializedConfig): () => Promise<ParsedTokenInfo> {
  const getFinalToken = getFinalTokenFactory(config)
  const { credentials } = config
  if (('oauth' in credentials && credentials.oauth) || ('browserSession' in credentials && credentials.browserSession)) {
    // @ts-expect-error
    return getFinalToken
  } else {
    return async () => {
      const loginCookies = await login(config)
      return getFinalToken(loginCookies)
    }
  }
}
