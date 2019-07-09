const fetchPropertiesDatatypes = require('./properties/fetch_properties_datatypes')
const findClaimsProperties = require('./properties/find_claims_properties')

module.exports = fnModulePath => {
  const fn = require(`./${fnModulePath}`)
  return (config, params) => {
    if (config == null) throw new Error(`missing config object`)
    if (params == null) throw new Error(`missing parameters object`)
    const { post } = require('./request')(config)
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
