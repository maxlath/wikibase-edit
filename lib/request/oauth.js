const OAuth = require('oauth-1.0a')
const { enc, HmacSHA1 } = require('crypto-js')
const hashFunction = (baseString, key) => enc.Base64.stringify(HmacSHA1(baseString, key))

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
