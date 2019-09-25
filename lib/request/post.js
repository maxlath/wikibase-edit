const _ = require('../utils')
const querystring = require('querystring')
const insistentReq = require('./insistent_req')
const throwErrorRes = require('./throw_error_res')
const { red } = require('chalk')
const knownIssues = require('./known_issues')

module.exports = (getAuthData, loggers) => {
  const { logError, Log, LogError } = loggers
  return (action, data, config) => {
    const tryIt = () => {
      return getAuthData()
      .then(actionPost(action, data, config))
      .then(Log(`POST ${action} res`))
      .catch(LogError(`POST ${action} err`))
    }

    return tryIt()
    .catch(err => {
      if (knownIssues[action] && knownIssues[action][err.name]) {
        const ticketUrl = knownIssues[action][err.name]
        console.error(red(`this is a known issue, please help documenting it at ${ticketUrl}`))
        throw err
      }
      logError(`failed ${action} attempt`, err)
      // Known case of required retrial: token expired
      if (isAuthError(err)) getAuthData({ refresh: true })
      // And retry
      return tryIt()
    })
  }
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
      'User-Agent': userAgent,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // Formatting as form-urlencoded
    body: querystring.stringify(data)
  }

  return insistentReq('post', params, config.autoRetry)
  .then(throwErrorRes(`action=${action} error`, params))
}

const isAuthError = err => {
  if (!(err && err.body && err.body.error)) return false
  const errorCode = err.body.error.code || ''
  // Known matching error codes: badtoken, notoken, assertuserfailed
  return errorCode.match(/(token|auth)/)
}
