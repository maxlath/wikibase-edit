const validate = require('../validate')
const getBuilder = require('../claim/get_builder')
const getEntityClaims = require('../claim/get_entity_claims')
const wdk = require('wikidata-sdk')
const _ = require('../utils')
const error_ = require('../error')

module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)

  return (guid, property, oldValue, newValue) => {
    return Promise.resolve()
    .then(() => {
      validate.guid(guid)
      validate.property(property)
      validate.qualifierValue(property, oldValue)
      validate.qualifierValue(property, newValue)

      if (oldValue === newValue) {
        throw error_.new('same value', 400, oldValue, newValue)
      }

      // Get current value snak hash
      return getSnakHash(config, guid, property, oldValue)
      .then(snakhash => {
        // Set it to its new value
        return post('wbsetqualifier', {
          snaktype: 'value',
          claim: guid,
          property,
          snakhash,
          value: getBuilder(property)(newValue)
        })
      })
    })
    .then(Log(`add qualifier res (${guid}:${property}:${oldValue}:${newValue})`))
    .catch(LogError(`add qualifier err (${guid}:${property}:${oldValue}:${newValue})`))
  }
}

const getSnakHash = (config, guid, property, oldValue) => {
  const entityId = guid.split('$')[0]
  return getEntityClaims(config, entityId)
  .then(claims => {
    const claim = findClaim(claims, guid)
    if (!claim) {
      throw error_.new('claim not found', 400, guid)
    }
    const qualifier = findQualifier(claim, property, oldValue)
    if (!qualifier) {
      throw error_.new('qualifier not found', 400, guid, property, oldValue)
    }
    return qualifier.hash
  })
}

const findClaim = (claims, guid) => {
  claims = _.flatten(Object.values(claims))
  for (let claim of claims) {
    if (claim.id === guid) return claim
  }
}

const findQualifier = (claim, property, value) => {
  const propQualifiers = claim.qualifiers[property]
  if (!propQualifiers) return
  for (let qualifier of propQualifiers) {
    if (wdk.simplifyClaim(qualifier) === value) return qualifier
  }
}
