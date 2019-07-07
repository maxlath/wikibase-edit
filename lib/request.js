const breq = require('bluereq')
const _ = require('./utils')
const wbToken = require('wikibase-token')
const querystring = require('querystring')

module.exports = config => {
  // Generate the functions only once per-config
  if (config.API) return config.API

  const userAgent = require('./user_agent')(config)
  const verbose = config.verbose === true || config.verbose === 2
  const tokenConfig = Object.assign({}, config, { verbose })
  const getToken = wbToken(tokenConfig)
  const { log, logError, Log, LogError } = require('./log')(config)
  const { oauth } = config

  // Making sure that the 'bot' flag was explicitly set to true
  const bot = config.bot === true
  const assert = bot ? 'bot' : 'user'

  const postParams = {
    log,
    instance: config.instance,
    userAgent,
    summary: config.summary,
    oauth,
    bot
  }

  var tokenPromise, lastTokenRefresh = 0
  const refreshToken = () => {
    now = Date.now()
    if (now - lastTokenRefresh < 30 * 1000) {
      throw new Error("last token refreshed less than 30 seconds ago: won't retry")
    }
    lastTokenRefresh = now
    tokenPromise = getToken()
    return tokenPromise
  }

  config.getAuthData = () => tokenPromise || refreshToken()

  config.API = {
    get: url => {
      return config.getAuthData()
      .then(authData => {
        const headers = { 'Cookie': authData.cookie, 'User-Agent': userAgent }
        return insistentReq('get', { url, headers, oauth })
      })
      .then(_.property('body'))
      .then(throwErrorRes('get err'))
      .then(Log(`${url} res body`))
    },

    post: (action, data) => {
      data.assert = assert

      const tryIt = () => {
        return config.getAuthData()
        .then(actionPost(postParams, action, data))
        .then(Log(`${action} res`))
        .catch(LogError(`${action} err`))
      }

      return tryIt()
      .catch(err => {
        logError(`failed ${action} attempt`, err)
        // Known case of required retrial: token expired
        if (isAuthError(err)) refreshToken()
        // And retry
        return tryIt()
      })
    }
  }

  return config.API
}

const isAuthError = err => {
  const errorCode = (err.body.error && err.body.error.code) || ''
  // Known matching error codes: badtoken, notoken, assertuserfailed
  return errorCode.match(/(token|auth)/)
}

const actionPost = (postParams, action, data) => authData => {
  const { log, instance, userAgent, oauth, bot } = postParams
  const { cookie, token } = authData

  data.token = token
  data.summary = postParams.summary || '#wikidatajs/edit'

  const query = { action, format: 'json' }
  if (bot) query.bot = true

  const url = _.buildUrl(instance, query)
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

  log('post request params', params)

  return insistentReq('post', params)
  .get('body')
  .then(throwErrorRes('post err'))
}

const insistentReq = (verb, params) => {
  return breq[verb](params)
  .timeout(30000)
  .catch(err => {
    // Retry once
    if (err.name === 'TimeoutError') return breq[verb](params)
    throw err
  })
}

const throwErrorRes = label => body => {
  if (body.error) {
    const err = new Error(label + ': ' + body.error.info)
    err.body = body
    throw err
  }
  return body
}
