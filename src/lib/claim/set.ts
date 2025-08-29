import { validateGuid, validateProperty, validateSnakValue } from '../validate.js'
import { formatClaimValue } from './format_claim_value.js'
import { buildSnak } from './snak.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { Claim, Guid, PropertyId, SimplifiedClaim } from 'wikibase-sdk'

export interface SetClaimParams {
  guid: Guid
  property: PropertyId
  value: SimplifiedClaim
}

export function setClaim (params: SetClaimParams, properties: PropertiesDatatypes, instance: AbsoluteUrl) {
  const { guid, property, value: rawValue } = params
  const datatype = properties[property]

  validateGuid(guid)
  validateProperty(property)

  // Format before testing validity to avoid throwing on type errors
  // that could be recovered
  const value = formatClaimValue(datatype, rawValue, instance)

  validateSnakValue(property, datatype, value)

  const claim = {
    id: guid,
    type: 'statement',
    mainsnak: buildSnak(property, datatype, value),
  }

  return { action: 'wbsetclaim', data: { claim: JSON.stringify(claim) } }
}

export interface SetClaimResponse {
  pageinfo: { lastrevid: number }
  success: 1
  claim: Claim
}
