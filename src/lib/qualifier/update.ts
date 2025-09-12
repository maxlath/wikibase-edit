import { flatten, values } from 'lodash-es'
import { getEntityIdFromGuid, type Claim, type Guid, type PropertyId, type Statement } from 'wikibase-sdk'
import { findSnak } from '../claim/find_snak.js'
import { formatUpdatedSnakValue } from '../claim/update.js'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import { validateGuid, validatePropertyId, validateSnakValue } from '../validate.js'
import type { WikibaseEditAPI } from '../index.js'
import type { SetQualifierResponse } from './set.js'
import type { BaseRevId } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'
import type { EditableSnakValue } from '../types/snaks.js'

export interface UpdateQualifierParams {
  guid: Guid
  property: PropertyId
  oldValue: EditableSnakValue
  newValue: EditableSnakValue
  summary?: string
  baserevid?: BaseRevId
}

export async function updateQualifier (params: UpdateQualifierParams, config: SerializedConfig, API: WikibaseEditAPI) {
  const { guid, property, oldValue, newValue } = params

  validateGuid(guid)
  validatePropertyId(property)
  const datatype = config.properties[property]
  validateSnakValue(property, datatype, oldValue)

  if (oldValue === newValue) {
    throw newError('same value', 400, { oldValue, newValue })
  }

  const qualifier = await getSnak(guid, property, oldValue, config)
  const { hash } = qualifier

  const formattedNewValue = formatUpdatedSnakValue(newValue, qualifier)

  validateSnakValue(property, datatype, formattedNewValue)

  return API.qualifier.set({
    guid,
    hash,
    property,
    value: formattedNewValue,
    summary: 'summary' in params ? params.summary : config.summary,
    baserevid: params.baserevid || config.baserevid,
  }, config)
}

async function getSnak (guid: Guid, property: PropertyId, oldValue: UpdateQualifierParams['oldValue'], config: SerializedConfig) {
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
  return qualifier
}

function findClaim <T extends (Claim | Statement)> (claims: Record<PropertyId, T[]>, guid: Guid): T | void {
  const flattenedClaims = flatten(values(claims))
  for (const claim of flattenedClaims) {
    if (claim.id === guid) return claim
  }
}

const getSnakValue = snak => snak.datavalue?.value

export type UpdateQualifierResponse = SetQualifierResponse
