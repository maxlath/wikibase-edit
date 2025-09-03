import { getEntityIdFromGuid, type Guid, type PropertyId, type SimplifiedQualifier } from 'wikibase-sdk'
import { findSnak } from '../claim/find_snak.js'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import { flatten, values } from '../utils.js'
import { validateGuid, validateProperty, validateSnakValue } from '../validate.js'
import type { WikibaseEditAPI } from '../index.js'
import type { SetQualifierResponse } from './set.js'
import type { SerializedConfig } from '../types/config.js'

export interface UpdateQualifierParams {
  guid: Guid
  property: PropertyId
  oldValue: SimplifiedQualifier
  newValue: SimplifiedQualifier
}

export async function updateQualifier (params: UpdateQualifierParams, config: SerializedConfig, API: WikibaseEditAPI) {
  const { guid, property, oldValue, newValue } = params

  validateGuid(guid)
  validateProperty(property)
  const datatype = config.properties[property]
  validateSnakValue(property, datatype, oldValue)
  validateSnakValue(property, datatype, newValue)

  if (oldValue === newValue) {
    throw newError('same value', 400, { oldValue, newValue })
  }

  // Get current value snak hash
  const hash = await getSnakHash(guid, property, oldValue, config)
  return API.qualifier.set({
    guid,
    hash,
    property,
    value: newValue,
    summary: params.summary || config.summary,
    baserevid: params.baserevid || config.baserevid,
  }, config)
}

const getSnakHash = async (guid, property, oldValue, config) => {
  const entityId = getEntityIdFromGuid(guid)
  const claims = await getEntityClaims(entityId, config)
  const claim = findClaim(claims, guid)

  if (!claim) throw newError('claim not found', 400, guid)
  if (!claim.qualifiers) throw newError('claim qualifiers not found', 400, guid)

  const propSnaks = claim.qualifiers[property]

  const qualifier = findSnak(property, propSnaks, oldValue)

  if (!qualifier) {
    const actualValues = propSnaks ? propSnaks.map(getSnakValue) : null
    throw newError('qualifier not found', 400, { guid, property, expectedValue: oldValue, actualValues })
  }
  return qualifier.hash
}

const findClaim = (claims, guid) => {
  claims = flatten(values(claims))
  for (const claim of claims) {
    if (claim.id === guid) return claim
  }
}

const getSnakValue = snak => snak.datavalue?.value

export type UpdateQualifierResponse = SetQualifierResponse
