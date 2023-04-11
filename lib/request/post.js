const { buildUrl, wait } = require('../utils')
const request = require('./request')
const throwErrorRes = require('./throw_error_res')

module.exports = async (action, data, config) => {
  const { anonymous } = config
  let tryRequest, getAuthData

  if (anonymous) {
    tryRequest = actionPost(action, data, config)
  } else {
    getAuthData = config.credentials._getAuthData
    tryRequest = () => getAuthData().then(actionPost(action, data, config))
  }

  const insistentRequest = async (attempt = 0) => {
    try {
      return await tryRequest()
    } catch (err) {
      // Known case of required retrial: token expired
      if (attempt < 10 && !anonymous && mayBeSolvedByTokenRefresh(err)) {
        await getAuthData({ refresh: true })
        await wait(attempt * 1000)
        return insistentRequest(++attempt)
      } else {
        throw err
      }
    }
  }

  return insistentRequest()
}

const actionPost = (action, data, config) => authData => {
  const { instanceApiEndpoint, userAgent, bot, summary, baserevid, tags, maxlag, anonymous } = config

  const query = { action, format: 'json' }

  if (bot) {
    query.bot = true
    data.assert = 'bot'
  } else if (!anonymous) {
    data.assert = 'user'
  }

  const params = {
    url: buildUrl(instanceApiEndpoint, query),
    headers: {
      'User-Agent': userAgent
    },
    autoRetry: config.autoRetry,
    httpRequestAgent: config.httpRequestAgent,
  }

  if (anonymous) {
    // The edit token for logged-out users is a hardcoded string of +\
    // cf https://phabricator.wikimedia.org/T40417
    data.token = '+\\'
  } else {
    params.oauth = config.credentials.oauth
    params.headers.cookie = authData.cookie
    data.token = authData.token
  }

  if (summary != null) data.summary = data.summary || summary
  if (baserevid != null) data.baserevid = data.baserevid || baserevid
  if (tags != null) data.tags = data.tags || tags.join('|')
  if (maxlag !== null) data.maxlag = maxlag || 5

  params.body = data

  return request('post', params)
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
