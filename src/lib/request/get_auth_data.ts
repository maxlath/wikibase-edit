import { newError } from '../error.js'
import { getTokenFactory } from './get_token.js'
import type { ParsedTokenInfo } from './get_final_token.js'
import type { SerializedConfig } from '../types/config.js'

export function getAuthDataFactory (config: SerializedConfig) {
  const getToken = getTokenFactory(config)

  let tokenPromise
  let lastTokenRefresh = 0

  function refreshToken (refresh?: boolean) {
    const now = Date.now()
    if (!refresh && now - lastTokenRefresh < 5000) {
      throw newError("last token refreshed less than 10 seconds ago: won't retry", { config })
    }
    lastTokenRefresh = now
    tokenPromise = getToken()
    return tokenPromise as Promise<ParsedTokenInfo>
  }

  return function getAuthData (params?: { refresh?: boolean }): Promise<ParsedTokenInfo> {
    if (params?.refresh) return refreshToken(true)
    else return tokenPromise || refreshToken()
  }
}
