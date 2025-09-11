import { flatten, values } from 'lodash-es'
import { getEntityIdFromGuid, type Claim, type Guid, type PropertyId, type SimplifiedQualifier, type Statement } from 'wikibase-sdk'
import { findSnak } from '../claim/find_snak.js'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import { validateGuid, validatePropertyId, validateSnakValue } from '../validate.js'
import type { WikibaseEditAPI } from '../index.js'
import type { SetQualifierResponse } from './set.js'
import type { BaseRevId } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'
import type { SimpifiedEditableQualifier } from '../types/edit_entity.js'

export interface UpdateQualifierParams {
  guid: Guid
  property: PropertyId
  oldValue: SimpifiedEditableQualifier
  newValue: SimpifiedEditableQualifier
  summary?: string
  baserevid?: BaseRevId
}

export async function updateQualifier (params: UpdateQualifierParams, config: SerializedConfig, API: WikibaseEditAPI) {
  const { guid, property, oldValue, newValue } = params

  validateGuid(guid)
  validatePropertyId(property)
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
    summary: 'summary' in params ? params.summary : config.summary,
    baserevid: params.baserevid || config.baserevid,
  }, config)
}

async function getSnakHash (guid: Guid, property: PropertyId, oldValue: SimplifiedQualifier, config) {
  const entityId = getEntityIdFromGuid(guid)
  const claims = await getEntityClaims(entityId, config)
  const claim = findClaim(claims, guid)

  if (!claim) throw newError('claim not found', 400, { guid })
  if (!claim.qualifiers) throw newError('claim qualifiers not found', 400, { guid })

  const propSnaks = claim.qualifiers[property]

  const qualifier = findSnak(property, propSnaks, oldValue)

  if (!qualifier) {
    const actualValues = propSnaks ? propSnaks.map(getSnakValue) : null
    throw newError('qualifier not found', 400, { guid, property, expectedValue: oldValue, actualValues })
  }
  return qualifier.hash
}

function findClaim <T extends (Claim | Statement)> (claims: Record<PropertyId, T[]>, guid: Guid): T | void {
  const flattenedClaims = flatten(values(claims))
  for (const claim of flattenedClaims) {
    if (claim.id === guid) return claim
  }
}

const getSnakValue = snak => snak.datavalue?.value

export type UpdateQualifierResponse = SetQualifierResponse
