const error_ = require('./error')
const parseInstance = require('./parse_instance')
const getInstanceWikibaseSdk = require('./get_instance_wikibase_sdk')
const toolSignature = '#wikibasejs/edit'

module.exports = (generalConfig, requestConfig) => {
  if (requestConfig && requestConfig.credentials && generalConfig.credentials) {
    throw error_.new('credentials should either be passed at initialization or per request')
  }

  var config
  if (requestConfig) {
    config = Object.assign({}, generalConfig, requestConfig)
  } else {
    config = generalConfig
    if (config._validatedAndEnriched) return config
  }

  parseInstance(config)
  if (config.instance == null) throw error_.new('invalid config object', { config })

  config.wbk = getInstanceWikibaseSdk(config.instance)

  if (!config.credentials) throw error_.new('missing credentials', { config })

  if (!config.credentials.oauth && (!config.credentials.username || !config.credentials.password)) {
    throw error_.new('missing credentials')
  }

  // Oauth config will be validated by wikibase-token
  if (config.credentials.oauth && (config.credentials.username || config.credentials.password)) {
    throw error_.new('credentials can not be both oauth tokens, and a username and password')
  }

  // Making sure that the 'bot' flag was explicitly set to true
  config.bot = config.bot === true

  config.summary = ((config.summary || '') + ' ' + toolSignature).trim()

  config._validatedAndEnriched = true

  return config
}
