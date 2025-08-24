import datatypesToBuilderDatatypes from '../properties/datatypes_to_builder_datatypes.js'
import { flatten, forceArray, map, values } from '../utils.js'
import * as validate from '../validate.js'
import { entityEditBuilders as builders } from './builders.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { PropertyId, SimplifiedReference, SnakDataValue, DataType, SimplifiedClaim } from 'wikibase-sdk'

export function buildSnak (property: PropertyId, datatype: DataType, value: SimplifiedClaim, instance: AbsoluteUrl) {
  value = value.value || value
  if (value?.snaktype && value.snaktype !== 'value') {
    return { snaktype: value.snaktype, property }
  }
  const builderDatatype = datatypesToBuilderDatatypes(datatype)
  return builders[builderDatatype](property, value, instance).mainsnak
}

export function buildReferenceFactory (properties: PropertiesDatatypes, instance: AbsoluteUrl) {
  return function buildReference (reference: SimplifiedReference) {
    const hash = reference.hash
    const referenceSnaks = reference.snaks || reference
    const snaksPerProperty = map(referenceSnaks, buildPropSnaksFactory(properties, instance))
    const snaks = flatten(values(snaksPerProperty))
    return { snaks, hash }
  }
}

export function buildPropSnaksFactory (properties: PropertiesDatatypes, instance: AbsoluteUrl) {
  return function buildPropSnaks (prop: PropertyId, propSnakValues: SnakDataValue | SnakDataValue[]) {
    validate.property(prop)
    return forceArray(propSnakValues).map(snakValue => {
      const datatype = properties[prop]
      validate.snakValue(prop, datatype, snakValue)
      return buildSnak(prop, datatype, snakValue, instance)
    })
  }
}
