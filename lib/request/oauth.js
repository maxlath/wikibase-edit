import base64 from 'crypto-js/enc-base64'
import hmacSHA1 from 'crypto-js/hmac-sha1'
import OAuth from 'oauth-1.0a'

const hashFunction = (baseString, key) => base64.stringify(hmacSHA1(baseString, key))

const getOAuthData = ({ consumer_key: key, consumer_secret: secret }) => {
  return OAuth({
    consumer: { key, secret },
    signature_method: 'HMAC-SHA1',
    hash_function: hashFunction,
  })
}

export const getSignatureHeaders = ({ url, method, data, oauthTokens }) => {
  const { token: key, token_secret: secret } = oauthTokens
  // Do not extract { authorize, toHeaders } functions as they need their context
  const oauth = getOAuthData(oauthTokens)
  const signature = oauth.authorize({ url, method, data }, { key, secret })
  return oauth.toHeader(signature)
}
