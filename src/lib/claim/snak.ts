import datatypesToBuilderDatatypes from '../properties/datatypes_to_builder_datatypes.js'
import { flatten, forceArray, map, values } from '../utils.js'
import * as validate from '../validate.js'
import { entityEditBuilders as builders } from './builders.js'

export const buildSnak = (property, datatype, value, instance) => {
  value = value.value || value
  if (value && value.snaktype && value.snaktype !== 'value') {
    return { snaktype: value.snaktype, property }
  }
  const builderDatatype = datatypesToBuilderDatatypes(datatype)
  return builders[builderDatatype](property, value, instance).mainsnak
}

export const buildReference = (properties, instance) => reference => {
  const hash = reference.hash
  const referenceSnaks = reference.snaks || reference
  const snaksPerProperty = map(referenceSnaks, buildPropSnaks(properties, instance))
  const snaks = flatten(values(snaksPerProperty))
  return { snaks, hash }
}

export const buildPropSnaks = (properties, instance) => (prop, propSnakValues) => {
  validate.property(prop)
  return forceArray(propSnakValues).map(snakValue => {
    const datatype = properties[prop]
    validate.snakValue(prop, datatype, snakValue)
    return buildSnak(prop, datatype, snakValue, instance)
  })
}
