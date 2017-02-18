const got = require('got')
const _ = require('./utils')
const wdToken = require('wikidata-token')
const querystring = require('querystring')

module.exports = (config) => {
  const instance = require('./instance')(config)
  const userAgent = require('./user_agent')(config)
  const getToken = wdToken(config)
  const { log, Log, LogError } = require('./log')(config)

  return {
    get: (url) => {
      url = instance.customize(url)
      return got.get(url, { json: true })
      .then(_.property('body'))
      .then(Log(`${url} res body`))
    },
    post: (action, data) => {
      log(`${action} data`, data)
      // TODO: reuse the same token while it works
      return getToken()
      .then(actionPost(instance.base, userAgent, action, data))
      .then(Log(`${action} res`))
      .catch(LogError(`${action} err`))
    }
  }
}

const actionPost = (base, userAgent, action, data) => (authData) => {
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
