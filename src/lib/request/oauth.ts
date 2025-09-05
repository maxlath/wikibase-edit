import base64 from 'crypto-js/enc-base64.js'
import hmacSHA1 from 'crypto-js/hmac-sha1.js'
import OAuth from 'oauth-1.0a'
import type { HttpMethod } from './fetch'
import type { AbsoluteUrl } from '../types/common'
import type { OAuthCredentials } from '../types/config'

const hashFunction = (baseString: string, key: string) => base64.stringify(hmacSHA1(baseString, key))

type OAuthData = Pick<OAuthCredentials['oauth'], 'consumer_key' | 'consumer_secret'>

function getOAuthData ({ consumer_key: key, consumer_secret: secret }: OAuthData) {
  // @ts-expect-error following documentation
  return OAuth({
    consumer: { key, secret },
    signature_method: 'HMAC-SHA1',
    hash_function: hashFunction,
  })
}

interface GetSignatureHeadersParams {
  url: AbsoluteUrl
  method: HttpMethod
  oauthTokens: OAuthCredentials['oauth']
  data?: unknown
}

export function getSignatureHeaders ({ url, method, data, oauthTokens }: GetSignatureHeadersParams) {
  const { token: key, token_secret: secret } = oauthTokens
  // Do not extract { authorize, toHeaders } functions as they need their context
  const oauth = getOAuthData(oauthTokens)
  const signature = oauth.authorize({ url, method, data }, { key, secret })
  return oauth.toHeader(signature)
}
