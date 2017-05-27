const validateClaimArgs = require('./validate_claim_args')
const getEntityClaims = require('./get_entity_claims')
const error_ = require('../error')
const { matchClaim } = require('./claim_parsers')

module.exports = config => (entity, property, oldValue, newValue) => {
  const values = { oldValue, newValue }
  if (oldValue === newValue) {
    return error_.reject("old and new claim values can't be the same", 400, values)
  }
  if (typeof oldValue !== typeof newValue) {
    return error_.reject('old and new claim should have the same type', 400, values)
  }
  const { Log, LogError } = require('../log')(config)
  const setClaim = require('./set')(config)
  return validateClaimArgs(entity, property, newValue)
  .then(() => getEntityClaims(config, entity))
  .then(findClaim(entity, property, oldValue, newValue))
  .then(claim => {
    claim.mainsnak.datavalue.value = newValue
    return setClaim(claim)
  })
  .then(Log(`${entity}:${property}:${oldValue}>${newValue}`))
  .catch(LogError(`${entity}:${property}:${oldValue}>${newValue}`))
}

const findClaim = (entity, property, oldValue, newValue) => claims => {
  const context = [ entity, property, oldValue, newValue ]
  const propClaims = claims[property]
  if (!propClaims) throw error_.new('no property claims found', 400, context)
  const matchingClaims = propClaims.filter(matchClaim(oldValue))
  if (matchingClaims.length === 0) {
    throw error_.new('no existing claim found for this value', 400, context)
  } else if (matchingClaims.length > 1) {
    throw error_.new('several existing claim were found with this value', 400, context)
  } else {
    return matchingClaims[0]
  }
}
