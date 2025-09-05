import { buildClaim } from '../entity/build_claim.js'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import { forceArray } from '../utils.js'
import { validateGuid } from '../validate.js'
import { isMatchingClaimFactory } from './is_matching_claim.js'
import type { Reconciliation } from '../entity/validate_reconciliation_object.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'
import type { Claim, EntityWithClaims, Guid, PropertyId, SimplifiedClaim, SimplifiedQualifiers } from 'wikibase-sdk'

export interface RemoveClaimParams {
  id?: EntityWithClaims['id']
  property?: PropertyId
  guid?: Guid | Guid[]
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

  let guids: Guid[]
  if (guid) {
    guids = forceArray(guid)
  } else {
    const existingClaims = await getEntityClaims(id, config)
    const claimData = { value, qualifiers }
    // @ts-expect-error
    const claim: Claim = buildClaim(property, properties, claimData, instance)
    const { matchingQualifiers } = reconciliation
    const matchingClaims = existingClaims[property].filter(isMatchingClaimFactory(claim, matchingQualifiers))
    if (matchingClaims.length === 0) throw newError('claim not found', params)
    guids = matchingClaims.map(({ id }) => id)
  }

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
