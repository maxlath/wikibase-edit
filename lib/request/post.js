const _ = require('../utils')
const insistentReq = require('./insistent_req')
const throwErrorRes = require('./throw_error_res')

module.exports = (action, data, config) => {
  const { _getAuthData } = config.credentials
  const tryIt = () => {
    return _getAuthData()
    .then(actionPost(action, data, config))
  }

  return tryIt()
  .catch(err => {
    // Known case of required retrial: token expired
    if (mayBeSolvedByTokenRefresh(err)) {
      _getAuthData({ refresh: true })
    }
    // And retry
    return tryIt()
  })
}

const actionPost = (action, data, config) => authData => {
  const { instance, userAgent, bot, summary, maxlag } = config
  const { oauth } = config.credentials
  const { cookie, token } = authData

  data.token = token
  data.summary = summary
  if (maxlag != null) data.maxlag = maxlag

  const query = { action, format: 'json' }
  if (bot) query.bot = true
  data.assert = bot ? 'bot' : 'user'

  const url = _.buildUrl(`${instance}/w/api.php`, query)
  const params = {
    url,
    oauth,
    headers: {
      'Cookie': cookie,
      'User-Agent': userAgent
    },
    body: data
  }

  return insistentReq('post', params, config.autoRetry)
  .then(throwErrorRes(`action=${action} error`, params))
}

const mayBeSolvedByTokenRefresh = err => {
  if (!(err && err.body && err.body.error)) return false
  const errorCode = err.body.error.code || ''
  return tokenErrors.includes(errorCode)
}

// Errors that might be resolved by a refreshed token
const tokenErrors = [
  'badtoken',
  'notoken',
  'assertuserfailed'
]
