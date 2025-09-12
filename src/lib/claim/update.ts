import { isGuid, getEntityIdFromGuid, type Guid, type PropertyId, type Rank, type Claim, type Snak } from 'wikibase-sdk'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import { findSnak } from './find_snak.js'
import { findClaimByGuid, isGuidClaim, simplifyClaimForEdit } from './helpers.js'
import { hasSpecialSnaktype } from './special_snaktype.js'
import type { EditEntitySimplifiedModeParams } from '../entity/edit.js'
import type { WikibaseEditAPI } from '../index.js'
import type { BaseRevId } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'
import type { RawEditableEntity, SimplifiedEditableSnak } from '../types/edit_entity.js'
import type { EditableMonolingualTextSnakValue, EditableSnakValue } from '../types/snaks.js'

export interface UpdateClaimParams {
  id?: RawEditableEntity['id']
  guid?: Guid<RawEditableEntity['id']>
  property?: PropertyId
  oldValue?: SimplifiedEditableSnak
  newValue?: SimplifiedEditableSnak
  rank?: Rank
  summary?: string
  baserevid?: BaseRevId
}

export async function updateClaim (params: UpdateClaimParams, config: SerializedConfig, API: WikibaseEditAPI) {
  let { id, guid, property } = params
  const { oldValue, newValue, rank } = params
  const { statementsKey } = config

  if (!(rank != null || newValue != null)) {
    throw newError('expected a rank or a newValue', 400, params)
  }

  if (isGuid(guid)) {
    id = getEntityIdFromGuid(guid) as RawEditableEntity['id']
  } else {
    const values = { oldValue, newValue }
    if (oldValue === newValue) {
      throw newError("old and new claim values can't be the same", 400, values)
    }
    if (typeof oldValue !== typeof newValue) {
      throw newError('old and new claim should have the same type', 400, values)
    }
  }

  const claims = await getEntityClaims(id, config)

  let claim
  if (guid) {
    claim = findClaimByGuid(claims, guid)
    property = claim?.mainsnak.property
  } else {
    claim = findSnak(property, claims[property] as Claim[], oldValue)
  }

  if (!claim) {
    throw newError('claim not found', 400, params)
  }

  const simplifiedClaim = simplifyClaimForEdit(claim)

  guid = claim.id

  if (rank) simplifiedClaim.rank = rank

  if (newValue != null) {
    if (hasSpecialSnaktype(newValue)) {
      simplifiedClaim.snaktype = newValue.snaktype
      delete simplifiedClaim.value
    } else {
      simplifiedClaim.value = formatUpdatedClaimValue(newValue, claim.mainsnak)
    }
  }

  const data: EditEntitySimplifiedModeParams = {
    id,
    [statementsKey]: {
      [property]: simplifiedClaim,
    },
    // Using wbeditentity, as the endpoint is more complete, so we need to recover the summary
    summary: params.summary || config.summary || `update ${property} claim`,
    baserevid: params.baserevid || config.baserevid,
  }

  const { entity, success } = await API.entity.edit(data, config)

  const updatedClaim = entity[statementsKey][property].find(isGuidClaim(guid))
  // Mimick claim actions responses
  return { claim: updatedClaim, success }
}

function formatUpdatedClaimValue (newValue: SimplifiedEditableSnak, updatedSnak: Snak) {
  if (!('datavalue' in updatedSnak)) {
    throw newError('expected snak to have datavalue', 500, { snak: updatedSnak })
  }
  const { type } = updatedSnak.datavalue
  if (type === 'monolingualtext' && typeof newValue === 'string') {
    const { language } = updatedSnak.datavalue.value
    return { text: newValue, language } as EditableMonolingualTextSnakValue
  } else {
    return newValue as EditableSnakValue
  }
}

export interface UpdateClaimResponse {
  claim: Claim
  success: 1
}
