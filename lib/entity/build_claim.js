const _ = require('../utils')
const error_ = require('../error')
const validate = require('../validate')
const findPropertyDataType = require('../properties/find_datatype')
const { entityEditBuilders: builders } = require('../claim/builders')

module.exports = (property, value) => {
  const datatype = findPropertyDataType(property)

  if (_.isString(value)) {
    validate.claimValue(property, value)
    return builders[datatype](property, value)
  }

  if (!_.isPlainObject(value)) {
    throw error_.new('invalid claim value', property, value)
  }

  return richClaimBuilder(property, datatype, value)
}

const richClaimBuilder = (property, datatype, claimData) => {
  const { value, qualifiers } = claimData
  validate.claimValue(property, value)
  const claim = builders[datatype](property, value)

  if (qualifiers) {
    claim.qualifiers = _.map(qualifiers, buildPropQualifiers)
  }

  return claim
}

const buildPropQualifiers = (prop, propQualifiers) => {
  validate.property(prop)
  return propQualifiers.map(qualifierValue => {
    validate.qualifierValue(prop, qualifierValue)
    return buildQualifierSnak(prop, qualifierValue)
  })
}

const buildQualifierSnak = (property, value) => {
  const datatype = findPropertyDataType(property)
  return builders[datatype](property, value).mainsnak
}
