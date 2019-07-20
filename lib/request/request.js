const _ = require('../utils')
const parseInstance = require('../parse_instance')
const GetAuthData = require('./get_auth_data')
const Get = require('./get')
const Post = require('./post')

module.exports = config => {
  // Generate the functions only once per credentials
  if (config.credentials._request) return config.credentials._request

  const verbose = config.verbose === true || config.verbose === 2
  const { instance } = config
  const tokenConfig = Object.assign({ instance, verbose }, config.credentials)
  const getAuthData = GetAuthData(tokenConfig)

  const postParams = {
    instance: config.instance,
    userAgent: config.userAgent,
    summary: config.summary,
    oauth: config.credentials.oauth,
    // Making sure that the 'bot' flag was explicitly set to true
    bot: config.bot === true
  }

  const loggers = require('../log')(config)

  config.credentials._request = {
    get: Get(getAuthData, loggers),
    post: Post(getAuthData, postParams, loggers)
  }

  return config.credentials._request
}
