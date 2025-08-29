import { singleClaimBuilders as builders } from '../claim/builders.js'
import { hasSpecialSnaktype } from '../claim/special_snaktype.js'
import { newError } from '../error.js'
import { normalizeDatatype } from '../properties/datatypes_to_builder_datatypes.js'
import { validateGuid, validateHash, validateProperty, validateSnakValue } from '../validate.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { Claim, Guid, Hash, PropertyId, SimplifiedQualifier } from 'wikibase-sdk'

export interface SetQualifierParams {
  guid: Guid
  property: PropertyId
  value: SimplifiedQualifier
  hash?: Hash
}

export function setQualifier (params: SetQualifierParams, properties: PropertiesDatatypes, instance: AbsoluteUrl) {
  const { guid, hash, property, value } = params

  validateGuid(guid)
  validateProperty(property)
  const datatype = properties[property]
  if (!datatype) throw newError('missing datatype', params)
  validateSnakValue(property, datatype, value)

  const data: SnakPostDataParams['data'] = {
    claim: guid,
    property,
  }

  if (hash != null) {
    validateHash(hash)
    data.snakhash = hash
  }

  // @ts-expect-error
  if (hasSpecialSnaktype(value)) {
    data.snaktype = value.snaktype
  } else {
    data.snaktype = 'value'
    const builderDatatype = normalizeDatatype(datatype) || datatype
    data.value = builders[builderDatatype](value, instance)
  }

  return { action: 'wbsetqualifier', data }
}

export interface SetQualifierResponse {
  pageinfo: { lastrevid: number }
  success: 1
  claim: Claim
}
