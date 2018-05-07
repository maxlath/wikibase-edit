const breq = require('bluereq')
const _ = require('./utils')
const wdToken = require('wikidata-token')
const querystring = require('querystring')

module.exports = config => {
  // Generate the functions only once per-config
  if (config.API) return config.API

  const instance = require('./instance')(config)
  const userAgent = require('./user_agent')(config)
  const verbose = config.verbose === true || config.verbose === 2
  const tokenConfig = Object.assign({}, config, { verbose })
  const getToken = wdToken(tokenConfig)
  const { log, logError, Log, LogError } = require('./log')(config)
  const { oauth } = config

  // Making sure that the 'bot' flag was explicitly set to true
  const bot = config.bot === true
  const assert = bot ? 'bot' : 'user'

  const postParams = {
    log,
    base: instance.base,
    userAgent,
    summary: config.summary,
    oauth,
    bot
  }

  // Re-use tokens associated to the same config
  config.authDataPromise = config.authDataPromise || getToken().catch(LogError(`login err`))

  config.API = {
    get: url => {
      url = instance.customize(url)
      return config.authDataPromise
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
        return config.authDataPromise
        .then(actionPost(postParams, action, data))
        .then(Log(`${action} res`))
        .catch(LogError(`${action} err`))
      }

      return tryIt()
      .catch(err => {
        logError(`failed ${action} attempt`, err)
        // Known case of required retrial: token expired
        // TODO: check that it's an authentification error before retrying
        // Refresh the token
        config.authDataPromise = getToken()
        // And retry
        return tryIt()
      })
    }
  }

  return config.API
}

const actionPost = (postParams, action, data) => authData => {
  const { log, base, userAgent, oauth, bot } = postParams
  const { cookie, token } = authData

  data.token = token
  data.summary = postParams.summary || '#wikidatajs/wikidata-edit'

  const query = { action, format: 'json' }
  if (bot) query.bot = true

  const url = _.buildUrl(base, query)
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
