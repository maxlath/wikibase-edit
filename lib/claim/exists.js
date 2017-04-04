const wdk = require('wikidata-sdk')
const validateClaimArgs = require('./validate_claim_args')

module.exports = (config) => {
  const { get } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)
  return (entity, property, value) => {
    return validateClaimArgs(entity, property, value)
    .then(() => {
      const url = wdk.getEntities({ ids: entity, props: 'claims' })
      return get(url).then(hasValue(entity, property, value))
    })
    .then(Log(`${entity}:${property}:${value} exists`))
    .catch(LogError(`${entity}:${property}:${value} exists`))
  }
}

const hasValue = (entity, property, value) => body => {
  const propClaims = body.entities[entity].claims[property]
  if (!propClaims) return false
  const matchingClaims = propClaims.filter(matchClaim(value))
  // If there are matching claims, return their GUIDs
  if (matchingClaims.length > 0) return matchingClaims.map(getGuid)
  return null
}

const matchClaim = value => claim => value === wdk.simplifyClaim(claim)
const getGuid = claim => claim.id
