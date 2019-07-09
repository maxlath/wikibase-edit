const _ = require('../utils')
const parseInstance = require('../parse_instance')
const GetAuthData = require('./get_auth_data')
const Get = require('./get')
const Post = require('./post')

module.exports = config => {
  // Generate the functions only once per-config
  if (config.request) return config.request

  const verbose = config.verbose === true || config.verbose === 2
  const tokenConfig = Object.assign({}, config, { verbose })
  const getAuthData = GetAuthData(tokenConfig)

  const postParams = {
    instance: parseInstance(config),
    userAgent: require('./user_agent')(config),
    summary: config.summary,
    oauth: config.oauth,
    // Making sure that the 'bot' flag was explicitly set to true
    bot: config.bot === true
  }

  const loggers = require('../log')(config)

  config.request = {
    get: Get(getAuthData, loggers),
    post: Post(getAuthData, postParams, loggers)
  }

  return config.request
}
