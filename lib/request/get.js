const insistentReq = require('./insistent_req')
const throwErrorRes = require('./throw_error_res')

module.exports = (getAuthData, config, loggers) => {
  const { Log, LogError } = loggers
  const { userAgent } = config
  const { oauth } = config.credentials
  return url => {
    return getAuthData()
    .then(authData => {
      const headers = { 'Cookie': authData.cookie, 'User-Agent': userAgent }
      return insistentReq('get', { url, headers, oauth })
    })
    .then(res => res.body)
    .then(throwErrorRes('get err', { url }))
    .then(Log(`GET ${url} res body`))
    .catch(LogError(`GET ${url} err`))
  }
}
