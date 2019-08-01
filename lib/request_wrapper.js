const error_ = require('./error')
const parseInstance = require('./parse_instance')
const getInstanceWikibaseSdk = require('./get_instance_wikibase_sdk')
const fetchUsedPropertiesDatatypes = require('./properties/fetch_used_properties_datatypes')

module.exports = (fnModulePath, initConfig) => {
  const fn = require(`./${fnModulePath}`)
  return (params, config = {}) => {
    config = validateAndEnrichConfig(initConfig, config)
    validateParams(params)

    const { post } = require('./request/request')(config)
    return fetchUsedPropertiesDatatypes(params, config)
    .then(() => {
      if (!config.properties) throw error_.new('properties not found', config)
      const { action, data } = fn(params, config.properties)
      return post(action, data)
    })
  }
}

const validateAndEnrichConfig = (initConfig, config) => {
  if (initConfig.credentials && config.credentials) {
    throw error_.new('credentials should either be passed at initialization or per request')
  }

  config = Object.assign({}, initConfig, config)

  if (config == null) throw error_.new('missing config object', { config, params })
  parseInstance(config)
  if (config.instance == null) throw error_.new('invalid config object', { config })
  config.wbk = getInstanceWikibaseSdk(config.instance)

  // Oauth config will be validated by wikibase-token
  if (!config.credentials) throw error_.new('missing credentials', { config })

  if (config.credentials.oauth && (config.credentials || config.password)) {
    throw error_.new('credentials should either be oauth tokens or a username and password')
  }

  return config
}

const validateParams = params => {
  if (params == null) throw error_.new('missing parameters object', { params })
  if (!(params.id || params.guid || params.hash || params.labels)) {
    throw error_.new(`invalid params object`, { params })
  }
}
