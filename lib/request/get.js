const insistentReq = require('./insistent_req')
const throwErrorRes = require('./throw_error_res')

module.exports = (getAuthData, config) => {
  const { userAgent } = config
  const { oauth } = config.credentials
  return url => {
    return getAuthData()
    .then(authData => {
      const headers = { 'Cookie': authData.cookie, 'User-Agent': userAgent }
      return insistentReq('get', { url, headers, oauth })
    })
    .then(throwErrorRes('get err', { url }))
  }
}
