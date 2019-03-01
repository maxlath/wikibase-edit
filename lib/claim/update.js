const _ = require('../utils')
const wdk = require('wikidata-sdk')
const getEntityClaims = require('./get_entity_claims')
const error_ = require('../error')
const findSnak = require('./find_snak')
const snak = require('./snak')

module.exports = config => (entity, property, oldValue, newValue) => {
  var guid

  if (wdk.isGuid(entity)) {
    guid = entity
    entity = guid.split('$')[0]
    newValue = property
  } else {
    const values = { oldValue, newValue }
    if (oldValue === newValue) {
      return error_.reject("old and new claim values can't be the same", 400, values)
    }
    if (typeof oldValue !== typeof newValue) {
      return error_.reject('old and new claim should have the same type', 400, values)
    }
  }

  const { Log, LogError } = require('../log')(config)
  const setClaim = require('./set')(config)
  const key = _.buildKey(entity, property, oldValue, newValue)

  return getEntityClaims(config, entity)
  .then(claims => {
    var claim

    if (guid) {
      claim = findClaimByGuid(claims, guid)
    } else {
      claim = findSnak(property, claims[property], oldValue)
    }

    if (!claim) {
      throw error_.new('claim not found', 400, { entity, property, oldValue, newValue, guid })
    }

    property = claim.mainsnak.property

    claim.mainsnak = snak(property, newValue)
    return setClaim(claim)
  })
  .then(Log(`claim update (${key})`))
  .catch(LogError(`claim update (${key})`))
}

const findClaimByGuid = (claims, guid) => {
  for (let claim of _.flatten(_.values(claims))) {
    if (claim.id === guid) return claim
  }
}
