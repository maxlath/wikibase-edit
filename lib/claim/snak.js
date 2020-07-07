const _ = require('../utils')
const validate = require('../validate')
const datatypesToBuilderDatatypes = require('../properties/datatypes_to_builder_datatypes')
const { entityEditBuilders: builders } = require('./builders')

const buildSnak = (property, datatype, value, instance) => {
  value = value.value || value
  if (value && value.snaktype && value.snaktype !== 'value') {
    return { snaktype: value.snaktype, property }
  }
  const builderDatatype = datatypesToBuilderDatatypes(datatype)
  return builders[builderDatatype](property, value, instance).mainsnak
}

const buildReference = (properties, instance) => reference => {
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

module.exports = { buildSnak, buildReference, buildPropSnaks }
