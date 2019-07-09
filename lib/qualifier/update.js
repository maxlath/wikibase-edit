const validate = require('../validate')
const getEntityClaims = require('../claim/get_entity_claims')
const _ = require('../utils')
const error_ = require('../error')
const findSnak = require('../claim/find_snak')
const postSnak = require('../claim/post_snak')

module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)

  return (guid, property, oldValue, newValue) => {
    const key = _.buildKey(guid, property, oldValue, newValue)

    return Promise.resolve()
    .then(() => {
      validate.guid(guid)
      validate.property(property)
      validate.qualifierValue(property, datatype, oldValue)
      validate.qualifierValue(property, datatype, newValue)

      if (oldValue === newValue) {
        throw error_.new('same value', 400, oldValue, newValue)
      }

      // Get current value snak hash
      return getSnakHash(config, guid, property, oldValue)
      .then(snakhash => {
        return postSnak({
          post,
          action: 'wbsetqualifier',
          data: { claim: guid, property, snakhash },
          value: newValue
        })
      })
    })
    .then(Log(`update qualifier res (${key})`))
    .catch(LogError(`update qualifier err (${key}`))
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
    const qualifier = findSnak(property, claim.qualifiers[property], oldValue)
    if (!qualifier) {
      throw error_.new('qualifier not found', 400, guid, property, oldValue)
    }
    return qualifier.hash
  })
}

const findClaim = (claims, guid) => {
  claims = _.flatten(_.values(claims))
  for (let claim of claims) {
    if (claim.id === guid) return claim
  }
}
