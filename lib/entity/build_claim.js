const _ = require('../utils')
const error_ = require('../error')
const validate = require('../validate')
const findPropertyDataType = require('../properties/find_datatype')
const { entityEditBuilders: builders } = require('../claim/builders')
const buildSnak = require('../reference/snak')

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
  const { value, qualifiers, references } = claimData
  validate.claimValue(property, value)
  const claim = builders[datatype](property, value)

  if (qualifiers) {
    claim.qualifiers = _.map(qualifiers, buildPropSnaks('qualifier'))
  }

  if (references) {
    const snaksPerProperty = _.map(references, buildPropSnaks('reference'))
    const snaks = _.flatten(Object.values(snaksPerProperty))
    claim.references = [ { snaks } ]
  }

  return claim
}

const buildPropSnaks = label => (prop, propSnakValues) => {
  validate.property(prop)
  return _.forceArray(propSnakValues).map(snakValue => {
    validate[`${label}Value`](prop, snakValue)
    return buildSnak(prop, snakValue)
  })
}
