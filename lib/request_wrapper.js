const fetchPropertiesDatatypes = require('./properties/fetch_properties_datatypes')
const findClaimsProperties = require('./properties/find_claims_properties')
const error_ = require('./error')
const parseInstance = require('./parse_instance')
const getInstanceWikibaseSdk = require('./get_instance_wikibase_sdk')

module.exports = (fnModulePath, initConfig) => {
  const fn = require(`./${fnModulePath}`)
  return (params, config = {}) => {
    config = validateAndEnrichConfig(initConfig, config)
    validateParams(params)

    const { post } = require('./request/request')(config)
    return fetchUsedPropertiesDatatypes(config, params)
    .then(() => {
      const { action, data } = fn(params, config.properties)
      return post(action, data)
    })
  }
}

const validateAndEnrichConfig = (initConfig, config) => {
  config = Object.assign({}, initConfig, config)

  if (config == null) throw error_.new(`missing config object`, { config, params })
  parseInstance(config)
  if (config.instance == null) throw error_.new(`invalid config object`, { config })
  config.wbk = getInstanceWikibaseSdk(config.instance)

  // Oauth config will be validated by wikibase-token
  if (!config.credentials) throw error_.new('missing credentials', { config })

  return config
}

const validateParams = params => {
  if (params == null) throw error_.new(`missing parameters object`, { config, params })
  if (!(params.id || params.guid || params.hash || params.labels)) {
    throw error_.new(`invalid params object`, { params })
  }
}

const fetchUsedPropertiesDatatypes = (config, params) => {
  var propertyIds

  if (params.claims) propertyIds = findClaimsProperties(params.claims)
  else if (params.property) propertyIds = [ params.property ]

  if (!propertyIds || propertyIds.length === 0) return Promise.resolve()

  return fetchPropertiesDatatypes(config, propertyIds)
}
