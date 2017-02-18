const wdk = require('wikidata-sdk')
const validateClaimArgs = require('./validate_claim_args')

module.exports = (config) => {
  const { get } = require('../request')(config)
  const { log, Log, LogError } = require('../log')(config)
  return (entity, property, value) => {
    log('exists?', [entity, property, value])
    return validateClaimArgs(entity, property, value)
    .then(() => {
      const url = wdk.getEntities({ ids: entity, properties: 'claims' })
      return get(url).then(hasValue(entity, property, value))
    })
    .then(Log(`${entity}:${property}:${value} exists`))
    .catch(LogError(`${entity}:${property}:${value} exists`))
  }
}

const hasValue = (entity, property, value) => (body) => {
  const propClaims = body.entities[entity].claims[property]
  if (!propClaims) return false
  const propClaimsValues = wdk.simplifyPropertyClaims(propClaims)
  return propClaimsValues.includes(value)
}
