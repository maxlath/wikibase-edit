const { buildUrl } = require('../utils')
const request = require('./request')
const throwErrorRes = require('./throw_error_res')

module.exports = (action, data, config) => {
  const { anonymous } = config
  let tryIt, getAuthData

  if (anonymous) {
    tryIt = actionPost(action, data, config)
  } else {
    getAuthData = config.credentials._getAuthData
    tryIt = () => getAuthData().then(actionPost(action, data, config))
  }

  return tryIt()
  .catch(err => {
    // Known case of required retrial: token expired
    if (!anonymous && mayBeSolvedByTokenRefresh(err)) {
      getAuthData({ refresh: true })
    }
    // And retry once
    return tryIt()
  })
}

const actionPost = (action, data, config) => authData => {
  const { instance, userAgent, bot, summary, tags, maxlag, anonymous, autoRetry } = config

  const query = { action, format: 'json' }

  if (bot) {
    query.bot = true
    data.assert = 'bot'
  } else if (!anonymous) {
    data.assert = 'user'
  }

  const params = {
    url: buildUrl(`${instance}/w/api.php`, query),
    headers: {
      'User-Agent': userAgent
    },
    autoRetry
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

  if (summary != null) data.summary = summary
  if (tags != null) data.tags = tags.join('|')
  data.maxlag = maxlag || 5

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
