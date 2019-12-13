const error_ = require('./error')
const parseInstance = require('./parse_instance')
const getInstanceWikibaseSdk = require('./get_instance_wikibase_sdk')
const toolSignature = '#wikibasejs/edit'
const { name, version, homepage } = require('../package.json')

module.exports = (generalConfig, requestConfig) => {
  if (requestConfig && requestConfig.credentials && generalConfig.credentials) {
    throw error_.new('credentials should either be passed at initialization or per request')
  }

  generalConfig.userAgent = generalConfig.userAgent || `${name}/v${version} (${homepage})`

  var config
  if (requestConfig) {
    config = Object.assign({}, generalConfig, requestConfig)
  } else {
    config = generalConfig
    if (config._validatedAndEnriched) return config
  }

  parseInstance(config)
  if (config.instance == null) throw error_.new('invalid config object', { config })

  // Define it as non-enumerable to ease debug by logging the config
  Object.defineProperty(config, 'wbk', {
    value: getInstanceWikibaseSdk(config.instance),
    enumerable: false
  })

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

  const { summary } = config
  if (summary) {
    if (typeof summary !== 'string') {
      throw error_.new('invalid config summary', { summary, type: typeof summary })
    }
  } else {
    // TODO: sign edits as tags https://www.mediawiki.org/wiki/Manual:Tags
    config.summary = toolSignature
  }

  config._validatedAndEnriched = true

  return config
}
