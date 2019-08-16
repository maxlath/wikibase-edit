const error_ = require('./error')
const parseInstance = require('./parse_instance')
const getInstanceWikibaseSdk = require('./get_instance_wikibase_sdk')

const validateAndEnrichConfig = (initConfig, config) => {
  if (config && config.credentials && initConfig.credentials) {
    throw error_.new('credentials should either be passed at initialization or per request')
  }

  if (config) {
    config = Object.assign({}, initConfig, config)
  } else {
    config = initConfig
    if (config._validatedAndEnriched) return config
  }

  parseInstance(config)
  if (config.instance == null) throw error_.new('invalid config object', { config })

  config.wbk = getInstanceWikibaseSdk(config.instance)

  // Oauth config will be validated by wikibase-token
  if (!config.credentials) throw error_.new('missing credentials', { config })

  if (config.credentials.oauth && (config.credentials.username || config.credentials.password)) {
    throw error_.new('credentials should either be oauth tokens or a username and password')
  }

  config._validatedAndEnriched = true

  return config
}

const validateParams = params => {
  if (params == null) throw error_.new('missing parameters object', { params })
  if (!(params.id || params.guid || params.hash || params.labels)) {
    throw error_.new(`invalid params object`, { params })
  }
}

module.exports = { validateAndEnrichConfig, validateParams }
