const fetchPropertiesDatatypes = require('./fetch_properties_datatypes')
const findClaimsProperties = require('./find_claims_properties')

module.exports = (params, config) => {
  const propertyIds = findUsedProperties(params)
  return fetchPropertiesDatatypes(config, propertyIds)
}

const findUsedProperties = params => {
  if (params.claims) return findClaimsProperties(params.claims)
  else if (params.property) return [ params.property ]
  else return []
}
