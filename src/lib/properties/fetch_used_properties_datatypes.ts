import { hasTruthy } from '../utils.js'
import { fetchPropertiesDatatypes } from './fetch_properties_datatypes.js'
import { findClaimsProperties, findSnaksProperties } from './find_snaks_properties.js'
import type { SerializedConfig } from '../types/config.js'

export function fetchUsedPropertiesDatatypes (params: object, config: SerializedConfig) {
  const propertyIds = findUsedProperties(params)
  return fetchPropertiesDatatypes(config, propertyIds)
}

function findUsedProperties (params: object) {
  const ids = []
  if (!hasTruthy(params, 'rawMode')) {
    if (hasTruthy(params, 'claims')) ids.push(...findClaimsProperties(params.claims))
    if (hasTruthy(params, 'statements')) ids.push(...findClaimsProperties(params.statements))
    if (hasTruthy(params, 'snaks')) ids.push(...findSnaksProperties(params.snaks))
    if (hasTruthy(params, 'property')) ids.push(params.property)
  }
  if (hasTruthy(params, 'newProperty')) ids.push(params.newProperty)
  if (hasTruthy(params, 'oldProperty')) ids.push(params.oldProperty)
  if (hasTruthy(params, 'propertyClaimsId') && typeof params.propertyClaimsId === 'string') {
    ids.push(params.propertyClaimsId.split('#')[1])
  }
  return ids
}
