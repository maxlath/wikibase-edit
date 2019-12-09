const OAuth = require('oauth-1.0a')
const base64 = require('crypto-js/enc-base64')
const hmacSHA1 = require('crypto-js/hmac-sha1')
const hashFunction = (baseString, key) => base64.stringify(hmacSHA1(baseString, key))

module.exports = {
  getOAuthData: ({ consumer_key: key, consumer_secret: secret }) => {
    return OAuth({
      consumer: { key, secret },
      signature_method: 'HMAC-SHA1',
      hash_function: hashFunction
    })
  },
  getSignatureHeaders: ({ url, method, data, secret, key, oauth }) => {
    const signature = oauth.authorize({ url, method, data }, { key, secret })
    return oauth.toHeader(signature)
  }
}
