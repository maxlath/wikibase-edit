import datatypesToBuilderDatatypes from '../properties/datatypes_to_builder_datatypes.js'
import _ from '../utils.js'
import validate from '../validate.js'
import { entityEditBuilders as builders } from './builders.js'

const buildSnak = (property, datatype, value, instance) => {
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
  const snaksPerProperty = _.map(referenceSnaks, buildPropSnaks(properties, instance))
  const snaks = _.flatten(_.values(snaksPerProperty))
  return { snaks, hash }
}

const buildPropSnaks = (properties, instance) => (prop, propSnakValues) => {
  validate.property(prop)
  return _.forceArray(propSnakValues).map(snakValue => {
    const datatype = properties[prop]
    validate.snakValue(prop, datatype, snakValue)
    return buildSnak(prop, datatype, snakValue, instance)
  })
}
