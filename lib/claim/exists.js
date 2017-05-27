const validateClaimArgs = require('./validate_claim_args')
const getEntityClaims = require('./get_entity_claims')
const { matchClaim, getGuid } = require('./claim_parsers')

module.exports = (config) => {
  const { Log, LogError } = require('../log')(config)
  return (entity, property, value) => {
    return validateClaimArgs(entity, property, value)
    .then(() => {
      return getEntityClaims(config, entity)
       .then(hasValue(entity, property, value))
    })
    .then(Log(`${entity}:${property}:${value} exists`))
    .catch(LogError(`${entity}:${property}:${value} exists`))
  }
}

const hasValue = (entity, property, value) => claims => {
  const propClaims = claims[property]
  if (!propClaims) return false
  const matchingClaims = propClaims.filter(matchClaim(value))
  // If there are matching claims, return their GUIDs
  if (matchingClaims.length > 0) return matchingClaims.map(getGuid)
  return null
}
