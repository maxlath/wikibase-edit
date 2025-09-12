import { fetchPropertiesDatatypes } from './fetch_properties_datatypes.js'
import { findClaimsProperties, findSnaksProperties } from './find_snaks_properties.js'

export default (params, config) => {
  const propertyIds = findUsedProperties(params)
  return fetchPropertiesDatatypes(config, propertyIds)
}

const findUsedProperties = params => {
  const ids = []
  if (!params.rawMode) {
    if (params.claims) ids.push(...findClaimsProperties(params.claims))
    if (params.statements) ids.push(...findClaimsProperties(params.statements))
    if (params.snaks) ids.push(...findSnaksProperties(params.snaks))
    if (params.property) ids.push(params.property)
  }
  if (params.newProperty) ids.push(params.newProperty)
  if (params.oldProperty) ids.push(params.oldProperty)
  if (params.propertyClaimsId) ids.push(params.propertyClaimsId.split('#')[1])
  return ids
}
