const _ = require('../utils')
const { isGuid, simplify } = require('wikibase-sdk')
const getEntityClaims = require('./get_entity_claims')
const error_ = require('../error')
const findSnak = require('./find_snak')
const simplifyOptions = {
  keepIds: true,
  keepSnaktypes: true,
  keepQualifiers: true,
  keepReferences: true,
  keepRanks: true
}

module.exports = async (params, config, API) => {
  let { id, guid, property } = params
  const { oldValue, newValue } = params

  if (isGuid(guid)) {
    id = guid.split('$')[0]
  } else {
    const values = { oldValue, newValue }
    if (oldValue === newValue) {
      throw error_.new("old and new claim values can't be the same", 400, values)
    }
    if (typeof oldValue !== typeof newValue) {
      throw error_.new('old and new claim should have the same type', 400, values)
    }
  }

  const claims = await getEntityClaims(id, config)

  let claim
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

  // Use wbeditentity as the endpoint is more complete, but recover summary
  data.summary = data.summary || `update ${property} claim`
  const { entity, success } = await API.entity.edit(data, config)
  const updatedClaim = entity.claims[property].find(isGuidClaim(guid))
  // Mimick claim actions responses
  return { claim: updatedClaim, success }
}

const findClaimByGuid = (claims, guid) => {
  for (let claim of _.flatten(_.values(claims))) {
    if (claim.id === guid) return claim
  }
}

const isGuidClaim = guid => claim => claim.id === guid
