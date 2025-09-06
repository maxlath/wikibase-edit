import { flatten, values } from 'lodash-es'
import { normalizeDatatype } from '../properties/datatypes_to_builder_datatypes.js'
import { forceArray, mapValues } from '../utils.js'
import { validatePropertyId, validateSnakValue } from '../validate.js'
import { entityEditBuilders as builders } from './builders.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { PropertyId, SimplifiedReference, SimplifiedClaim, Datatype, SimplifiedSnak, Snak } from 'wikibase-sdk'

export function buildSnak (property: PropertyId, datatype: Datatype, value: SimplifiedClaim, instance: AbsoluteUrl) {
  const datavalueValue = (typeof value === 'object' && 'value' in value) ? value.value : value
  if (typeof value === 'object' && 'snaktype' in value && value?.snaktype && value.snaktype !== 'value') {
    return { snaktype: value.snaktype, property }
  }
  const builderDatatype = normalizeDatatype(datatype)
  return builders[builderDatatype](property, datavalueValue, instance).mainsnak as Snak
}

export function buildReferenceFactory (properties: PropertiesDatatypes, instance: AbsoluteUrl) {
  return function buildReference (reference: SimplifiedReference) {
    const hash = 'hash' in reference ? reference.hash : undefined
    const referenceSnaks = 'snaks' in reference ? reference.snaks : reference
    const snaksPerProperty = mapValues(referenceSnaks, buildPropSnaksFactory(properties, instance))
    const snaks = flatten(values(snaksPerProperty)) as Snak[]
    return { snaks, hash }
  }
}

export function buildPropSnaksFactory (properties: PropertiesDatatypes, instance: AbsoluteUrl) {
  return function buildPropSnaks (prop: PropertyId, propSnakValues: SimplifiedSnak[]) {
    validatePropertyId(prop)
    return forceArray(propSnakValues).map(snakValue => {
      const datatype = properties[prop]
      validateSnakValue(prop, datatype, snakValue)
      return buildSnak(prop, datatype, snakValue, instance)
    })
  }
}
