import { entityEditBuilders as builders } from '../claim/builders.js'
import { buildReference, buildPropSnaks } from '../claim/snak.js'
import { hasSpecialSnaktype } from '../claim/special_snaktype.js'
import error_ from '../error.js'
import datatypesToBuilderDatatypes from '../properties/datatypes_to_builder_datatypes.js'
import _ from '../utils.js'
import validate from '../validate.js'

export default (property, properties, claimData, instance) => {
  const datatype = properties[property]

  const builderDatatype = datatypesToBuilderDatatypes(datatype)
  const builder = builders[builderDatatype]

  const params = { properties, datatype, property, claimData, builder, instance }

  if (_.isString(claimData) || _.isNumber(claimData)) {
    return simpleClaimBuilder(params)
  } else {
    if (!_.isPlainObject(claimData)) throw error_.new('invalid claim data', { property, claimData })
    return fullClaimBuilder(params)
  }
}

const simpleClaimBuilder = params => {
  const { property, datatype, claimData: value, builder, instance } = params
  validate.snakValue(property, datatype, value)
  return builder(property, value, instance)
}

const fullClaimBuilder = params => {
  const { properties, datatype, property, claimData, builder, instance } = params
  validateClaimParameters(claimData)
  let { id, value, snaktype, rank, qualifiers, references, remove, reconciliation } = claimData

  if (remove === true) {
    if (!(id || reconciliation)) throw error_.new("can't remove a claim without an id or reconciliation settings", claimData)
    if (id) return { id, remove: true }
  }

  let claim
  if (value && value.snaktype) {
    claimData.snaktype = snaktype = value.snaktype
  }
  if (hasSpecialSnaktype(claimData)) {
    claim = builders.specialSnaktype(property, snaktype)
  } else {
    // In case of a rich value (monolingual text, quantity, globe coordinate, or time)
    if (value == null && (claimData.text || claimData.amount || claimData.latitude || claimData.time)) {
      value = claimData
    }
    validate.snakValue(property, datatype, value)
    claim = builder(property, value, instance)
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
    claim.qualifiers = _.map(qualifiers, buildPropSnaks(properties, instance))
  }

  if (references) {
    claim.references = _.forceArray(references).map(buildReference(properties, instance))
  }

  if (reconciliation) claim.reconciliation = reconciliation
  if (remove) claim.remove = remove

  return claim
}

const validClaimParameters = [
  'id',
  'type',
  'value',
  'snaktype',
  'rank',
  'qualifiers',
  'references',
  'remove',
  'reconciliation',
  'text',
  'language',
  'amount',
  'lowerBound',
  'upperBound',
  'unit',
  'latitude',
  'longitude',
  'precision',
  'globe',
  'altitude',
  'time',
  'timezone',
  'before',
  'after',
  'precision',
  'calendarmodel',
]

const validClaimParametersSet = new Set(validClaimParameters)

const validateClaimParameters = claimData => {
  for (const key in claimData) {
    if (!validClaimParametersSet.has(key)) {
      throw error_.new(`invalid claim parameter: ${key}`, { claimData, validClaimParameters })
    }
  }
}
