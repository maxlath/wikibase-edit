const fetchPropertiesDatatypes = require('./fetch_properties_datatypes')
const { findClaimsProperties, findSnaksProperties } = require('./find_snaks_properties')

module.exports = (params, config) => {
  if (params.rawMode) return
  const propertyIds = findUsedProperties(params)
  return fetchPropertiesDatatypes(config, propertyIds)
}

const findUsedProperties = params => {
  if (params.claims) return findClaimsProperties(params.claims)
  if (params.snaks) return findSnaksProperties(params.snaks)
  if (params.property) return [ params.property ]
  return []
}
