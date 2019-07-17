const fetchPropertiesDatatypes = require('./properties/fetch_properties_datatypes')
const findClaimsProperties = require('./properties/find_claims_properties')
const error_ = require('./error')

module.exports = fnModulePath => {
  const fn = require(`./${fnModulePath}`)
  return (config, params) => {
    if (config == null) throw error_.new(`missing config object`, { config, params })
    if (params == null) throw error_.new(`missing parameters object`, { config, params })
    const { post } = require('./request/request')(config)
    return fetchUsedPropertiesDatatypes(config, params)
    .then(() => {
      const { action, data } = fn(params, config.properties)
      return post(action, data)
    })
  }
}

const fetchUsedPropertiesDatatypes = (config, params) => {
  var propertyIds

  if (params.claims) propertyIds = findClaimsProperties(params.claims)
  else if (params.property) propertyIds = [ params.property ]

  if (!propertyIds || propertyIds.length === 0) return Promise.resolve()

  return fetchPropertiesDatatypes(config, propertyIds)
}
