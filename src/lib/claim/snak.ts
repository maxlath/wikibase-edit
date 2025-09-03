import { normalizeDatatype } from '../properties/datatypes_to_builder_datatypes.js'
import { flatten, forceArray, map, values } from '../utils.js'
import { validateProperty, validateSnakValue } from '../validate.js'
import { entityEditBuilders as builders } from './builders.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { PropertyId, SimplifiedReference, SnakDataValue, DataType, SimplifiedClaim } from 'wikibase-sdk'

export function buildSnak (property: PropertyId, datatype: DataType, value: SimplifiedClaim, instance: AbsoluteUrl) {
  const datavalueValue = (typeof value === 'object' && 'value' in value) ? value.value : value
  if (typeof value === 'object' && 'snaktype' in value && value?.snaktype && value.snaktype !== 'value') {
    return { snaktype: value.snaktype, property }
  }
  const builderDatatype = normalizeDatatype(datatype)
  return builders[builderDatatype](property, datavalueValue, instance).mainsnak
}

export function buildReferenceFactory (properties: PropertiesDatatypes, instance: AbsoluteUrl) {
  return function buildReference (reference: SimplifiedReference) {
    const hash = 'hash' in reference ? reference.hash : undefined
    const referenceSnaks = 'snaks' in reference ? reference.snaks : reference
    const snaksPerProperty = map(referenceSnaks, buildPropSnaksFactory(properties, instance))
    const snaks = flatten(values(snaksPerProperty))
    return { snaks, hash }
  }
}

export function buildPropSnaksFactory (properties: PropertiesDatatypes, instance: AbsoluteUrl) {
  return function buildPropSnaks (prop: PropertyId, propSnakValues: SnakDataValue | SnakDataValue[]) {
    validateProperty(prop)
    return forceArray(propSnakValues).map(snakValue => {
      const datatype = properties[prop]
      validateSnakValue(prop, datatype, snakValue)
      return buildSnak(prop, datatype, snakValue, instance)
    })
  }
}
