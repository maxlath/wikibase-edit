const breq = require('bluereq')
const _ = require('./utils')
const wdToken = require('wikidata-token')
const querystring = require('querystring')

var authDataPromise, API

module.exports = config => {
  // Generate the functions only once
  if (API) return API
  const instance = require('./instance')(config)
  const userAgent = require('./user_agent')(config)
  const getToken = wdToken(config)
  const { log, logError, Log, LogError } = require('./log')(config)
  const { oauth } = config

  authDataPromise = authDataPromise || getToken().catch(LogError(`login err`))

  API = {
    get: url => {
      url = instance.customize(url)
      return authDataPromise
      .then(authData => {
        const headers = { 'Cookie': authData.cookie, 'User-Agent': userAgent }
        return breq.get({ url, headers, oauth })
      })
      .then(_.property('body'))
      .then(throwErrorRes('get err'))
      .then(Log(`${url} res body`))
    },
    post: (action, data) => {
      const tryIt = () => {
        return authDataPromise
        .then(actionPost(log, instance.base, userAgent, action, data, oauth))
        .then(Log(`${action} res`))
        .catch(LogError(`${action} err`))
      }

      return tryIt()
      .catch(err => {
        logError(`failed ${action} attempt`, err)
        // Known case of required retrial: token expired
        // TODO: check that it's an authentification error before retrying
        // Refresh the token
        authDataPromise = getToken()
        // And retry
        return tryIt()
      })
    }
  }

  return API
}

const actionPost = (log, base, userAgent, action, data, oauth) => authData => {
  const { cookie, token } = authData
  data.token = token

  const url = _.buildUrl(base, { action, format: 'json' })
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
  return breq.post(params)
  .get('body')
  .then(throwErrorRes('post err'))
}

const throwErrorRes = label => body => {
  if (body.error) {
    const err = new Error(label + ': ' + body.error.info)
    err.body = body
    throw err
  }
  return body
}
