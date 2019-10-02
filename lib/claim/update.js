const _ = require('../utils')
const { isGuid, simplify } = require('wikibase-sdk')
const getEntityClaims = require('./get_entity_claims')
const error_ = require('../error')
const findSnak = require('./find_snak')
const validateAndEnrichConfig = require('../validate_and_enrich_config')
const simplifyOptions = {
  keepIds: true,
  keepSnaktypes: true,
  keepQualifiers: true,
  keepReferences: true,
  keepRanks: true
}

module.exports = (API, generalConfig) => (params, reqConfig) => {
  var { id, guid, property, oldValue, newValue } = params

  if (isGuid(guid)) {
    id = guid.split('$')[0]
  } else {
    const values = { oldValue, newValue }
    if (oldValue === newValue) {
      return error_.reject("old and new claim values can't be the same", 400, values)
    }
    if (typeof oldValue !== typeof newValue) {
      return error_.reject('old and new claim should have the same type', 400, values)
    }
  }

  const config = validateAndEnrichConfig(generalConfig, reqConfig)

  return getEntityClaims(id, config)
  .then(claims => {
    var claim

    if (guid) {
      claim = findClaimByGuid(claims, guid)
      property = claim.mainsnak.property
    } else {
      const datatype = config.properties[property]
      claim = findSnak(property, datatype, claims[property], oldValue)
    }

    if (!claim) {
      throw error_.new('claim not found', 400, { id, property, oldValue, newValue, guid })
    }

    guid = claim.id

    claim.value = newValue

    const data = { id, claims: {} }
    const simplifiedClaim = simplify.claim(claim, simplifyOptions)
    simplifiedClaim.value = newValue
    data.claims[property] = simplifiedClaim

    // Use wbeditentity as the endpoint is more complete
    return API.entity.edit(data, config)
    .then(res => {
      const { entity, success } = res
      const updatedClaim = entity.claims[property].find(isGuidClaim(guid))
      // Mimick claim actions responses
      return { claim: updatedClaim, success }
    })
  })
}

const findClaimByGuid = (claims, guid) => {
  for (let claim of _.flatten(_.values(claims))) {
    if (claim.id === guid) return claim
  }
}

const isGuidClaim = guid => claim => claim.id === guid
