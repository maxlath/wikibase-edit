const got = require('got')
const _ = require('./utils')
const wdToken = require('wikidata-token')
const querystring = require('querystring')

var authDataPromise, API

module.exports = (config) => {
  // Generate the functions only once
  if (API) return API
  const instance = require('./instance')(config)
  const userAgent = require('./user_agent')(config)
  const getToken = wdToken(config)
  const { log, logError, Log, LogError } = require('./log')(config)

  authDataPromise = authDataPromise || getToken().catch(LogError(`login err`))

  API = {
    get: (url) => {
      url = instance.customize(url)
      return authDataPromise
      .then(authData => {
        const headers = { 'Cookie': authData.cookie, 'User-Agent': userAgent }
        return got.get(url, { headers, json: true })
      })
      .then(_.property('body'))
      .then(Log(`${url} res body`))
    },
    post: (action, data) => {
      const tryIt = () => {
        return authDataPromise
        .then(actionPost(log, instance.base, userAgent, action, data))
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

const actionPost = (log, base, userAgent, action, data) => (authData) => {
  const { cookie, token } = authData
  data.token = token

  const url = _.buildUrl(base, { action, format: 'json' })
  const params = {
    headers: {
      'Cookie': cookie,
      'User-Agent': userAgent,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // Formatting as form-urlencoded
    body: querystring.stringify(data)
  }

  log('post request url', url)
  log('post request params', params)
  return got.post(url, params)
  .then(res => {
    const body = JSON.parse(res.body)
    if (body.error) {
      const err = new Error('post err')
      Object.assign(err, body)
      throw err
    } else {
      return body
    }
  })
}
