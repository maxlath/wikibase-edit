import { buildClaim } from '../entity/build_claim.js'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import { forceArray } from '../utils.js'
import { validateGuid } from '../validate.js'
import isMatchingClaim from './is_matching_claim.js'
import type { Reconciliation } from '../entity/validate_reconciliation_object.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'
import type { EntityId, Guid, PropertyId, SimplifiedClaim, SimplifiedQualifiers } from 'wikibase-sdk'

export interface RemoveClaimParams {
  id?: EntityId
  property?: PropertyId
  guid?: Guid
  value?: SimplifiedClaim
  qualifiers: SimplifiedQualifiers
  reconciliation?: Reconciliation
}

export async function removeClaim (params: RemoveClaimParams, properties: PropertiesDatatypes, instance: AbsoluteUrl, config: SerializedConfig) {
  let { guid } = params
  const { id, property, value, qualifiers, reconciliation = {} } = params
  if (!(guid || (id && property && value))) {
    throw newError('missing guid or id/property/value', params)
  }

  if (!guid) {
    const existingClaims = await getEntityClaims(id, config)
    const claimData = { value, qualifiers }
    const claim = buildClaim(property, properties, claimData, instance)
    const { matchingQualifiers } = reconciliation
    const matchingClaims = existingClaims[property].filter(isMatchingClaim(claim, matchingQualifiers))
    if (matchingClaims.length === 0) throw newError('claim not found', params)
    guid = matchingClaims.map(({ id }) => id)
  }

  const guids = forceArray(guid)
  guids.forEach(validateGuid)

  return {
    action: 'wbremoveclaims',
    data: {
      claim: guids.join('|'),
    },
  }
}

export interface RemoveClaimResponse {
  pageinfo: { lastrevid: number }
  success: 1
  claims: Guid[]
}
