const _ = require('../utils')
const { isGuid } = require('wikibase-sdk')
const getEntityClaims = require('./get_entity_claims')
const error_ = require('../error')
const findSnak = require('./find_snak')
const snak = require('./snak')
const { validateAndEnrichConfig } = require('../wrappers_utils')

module.exports = (API, initConfig) => (params, config) => {
  const { id, property, oldValue, newValue } = params
  var guid

  if (isGuid(id)) {
    guid = id
    id = guid.split('$')[0]
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

  const reqConfig = validateAndEnrichConfig(initConfig, config)

  return getEntityClaims(id, reqConfig)
  .then(claims => {
    var claim

    if (guid) {
      claim = findClaimByGuid(claims, guid)
    } else {
      const datatype = reqConfig.properties[property]
      claim = findSnak(property, datatype, claims[property], oldValue)
    }

    if (!claim) {
      throw error_.new('claim not found', 400, { id, property, oldValue, newValue, guid })
    }

    return API.claim.set({
      guid: claim.id,
      property,
      value: newValue
    }, config)
  })
}

const findClaimByGuid = (claims, guid) => {
  for (let claim of _.flatten(_.values(claims))) {
    if (claim.id === guid) return claim
  }
}