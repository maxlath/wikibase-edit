const _ = require('../utils')
const error_ = require('../error')
const validate = require('../validate')
const findPropertyDataType = require('../properties/find_datatype')
const { entityEditBuilders: builders } = require('../claim/builders')
const buildSnak = require('../claim/snak')
const { hasSpecialSnaktype } = require('../claim/special_snaktype')

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
  var { id, value, snaktype, rank, qualifiers, references, remove } = claimData

  if (remove === true) {
    if (!id) throw error_.new("can't remove a claim without an id", claimData)
    return { id, remove: true }
  }

  var claim
  if (hasSpecialSnaktype(claimData)) {
    claim = builders.specialSnaktype(property, snaktype)
  } else {
    // In case of a rich value (monolingual text, quantity, or globe coordinate)
    if (value == null && (claimData.text || claimData.amount || claimData.latitude)) {
      value = claimData
    }
    validate.claimValue(property, value)
    claim = builders[datatype](property, value)
  }

  if (id) {
    validate.guid(id)
    claim.id = id
  }

  if (rank) {
    validate.rank(rank)
    claim.rank = rank
  }

  if (qualifiers) {
    claim.qualifiers = _.map(qualifiers, buildPropSnaks('qualifier'))
  }

  if (references) {
    // References snaks can be slippited into records, that is
    // sub-groups of references snaks pointing to a same claim
    claim.references = _.forceArray(references).map(buildReference)
  }

  return claim
}

const buildReference = reference => {
  const hash = reference.hash
  const referenceSnaks = reference.snaks || reference
  const snaksPerProperty = _.map(referenceSnaks, buildPropSnaks('reference'))
  const snaks = _.flatten(_.values(snaksPerProperty))
  return { snaks, hash }
}

const buildPropSnaks = label => (prop, propSnakValues) => {
  validate.property(prop)
  return _.forceArray(propSnakValues).map(snakValue => {
    validate[`${label}Value`](prop, snakValue)
    return buildSnak(prop, snakValue)
  })
}
