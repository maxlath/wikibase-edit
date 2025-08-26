import { buildSnak, buildReferenceFactory } from '../claim/snak.js'
import { validateGuid, validateHash, validateProperty, validateSnakValue } from '../validate.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { Guid, Hash, PropertyId, Reference, SimplifiedReference, SimplifiedSnaks } from 'wikibase-sdk'

export interface SetReferenceParams {
  guid: Guid
  hash?: Hash
  snaks?: SimplifiedSnaks
  /** @deprecated use the `snaks` object instead, to be able to set a single reference with several snaks  */
  property: PropertyId
  /** @deprecated use the `snaks` object instead, to be able to set a single reference with several snaks  */
  value?: SimplifiedReference
}

export function setReference (params: SetReferenceParams, properties: PropertiesDatatypes, instance: AbsoluteUrl) {
  const { guid, property, value, hash } = params
  let { snaks } = params
  if (snaks) {
    snaks = buildReferenceFactory(properties, instance)(snaks).snaks
  } else {
    // Legacy interface
    validateGuid(guid)
    validateProperty(property)
    const datatype = properties[property]
    validateSnakValue(property, datatype, value)
    snaks = {}
    snaks[property] = [ buildSnak(property, datatype, value, instance) ]
  }

  const data = {
    statement: guid,
    snaks: JSON.stringify(snaks),
  }

  if (hash) {
    validateHash(hash)
    data.reference = hash
  }

  return { action: 'wbsetreference', data }
}

export interface SetReferenceResponse {
  pageinfo: { lastrevid: number }
  success: 1
  reference: Reference
}
