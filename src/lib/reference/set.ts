import { buildSnak, buildReferenceFactory } from '../claim/snak.js'
import { validateGuid, validateHash, validatePropertyId, validateSnakValue } from '../validate.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { SimplifiedEditableReference, SimplifiedEditableSnaks } from '../types/edit_entity.js'
import type { Guid, Hash, PropertyId, Reference, Snak, Snaks } from 'wikibase-sdk'

export interface SetReferenceParams {
  guid: Guid
  hash?: Hash
  snaks?: SimplifiedEditableSnaks
  /** @deprecated use the `snaks` object instead, to be able to set a single reference with several snaks  */
  property: PropertyId
  /** @deprecated use the `snaks` object instead, to be able to set a single reference with several snaks  */
  value?: SimplifiedEditableReference
}

export function setReference (params: SetReferenceParams, properties: PropertiesDatatypes, instance: AbsoluteUrl) {
  const { guid, property, value, hash } = params
  const inputSnaks = params.snaks
  let snaks: Snaks | Snak[]
  if (inputSnaks) {
    snaks = buildReferenceFactory(properties, instance)(inputSnaks).snaks
  } else {
    // Legacy interface
    validateGuid(guid)
    validatePropertyId(property)
    const datatype = properties[property]
    // @ts-expect-error
    validateSnakValue(property, datatype, value)
    snaks = {}
    // @ts-expect-error
    snaks[property] = [ buildSnak(property, datatype, value, instance) ]
  }

  if (hash) validateHash(hash)

  const data = {
    statement: guid,
    snaks: JSON.stringify(snaks),
    reference: hash,
  }

  return { action: 'wbsetreference', data }
}

export interface SetReferenceResponse {
  pageinfo: { lastrevid: number }
  success: 1
  reference: Reference
}
