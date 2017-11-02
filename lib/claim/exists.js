const _ = require('../utils')
const formatAndValidateClaimArgs = require('./format_and_validate_claim_args')
const getEntityClaims = require('./get_entity_claims')
const { matchClaim, getGuid } = require('./claim_parsers')

module.exports = config => {
  const { Log, LogError } = require('../log')(config)
  return (entity, property, rawValue) => {
    const key = _.buildKey(entity, property, rawValue)
    return formatAndValidateClaimArgs(entity, property, rawValue)
    .then(value => {
      return getEntityClaims(config, entity)
      .then(hasValue(entity, property, value))
      .then(Log(`${key} exists`))
      .catch(LogError(`${key} exists`))
    })
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
