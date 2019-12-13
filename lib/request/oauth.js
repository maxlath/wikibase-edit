const OAuth = require('oauth-1.0a')
const base64 = require('crypto-js/enc-base64')
const hmacSHA1 = require('crypto-js/hmac-sha1')
const hashFunction = (baseString, key) => base64.stringify(hmacSHA1(baseString, key))

const getOAuthData = ({ consumer_key: key, consumer_secret: secret }) => {
  return OAuth({
    consumer: { key, secret },
    signature_method: 'HMAC-SHA1',
    hash_function: hashFunction
  })
}

module.exports = {
  getSignatureHeaders: ({ url, method, data, oauthTokens }) => {
    const { token: key, token_secret: secret } = oauthTokens
    // Do not extract { authorize, toHeaders } functions as they need their context
    const oauth = getOAuthData(oauthTokens)
    const signature = oauth.authorize({ url, method, data }, { key, secret })
    return oauth.toHeader(signature)
  }
}
