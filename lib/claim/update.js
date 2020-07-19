const { isGuid, getEntityIdFromGuid } = require('wikibase-sdk')
const getEntityClaims = require('./get_entity_claims')
const error_ = require('../error')
const findSnak = require('./find_snak')
const { findClaimByGuid, isGuidClaim, simplifyClaimForEdit } = require('./helpers')

module.exports = async (params, config, API) => {
  let { id, guid, property } = params
  const { oldValue, newValue, rank } = params

  if (isGuid(guid)) {
    id = getEntityIdFromGuid(guid)
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

  if (rank) claim.rank = rank

  const data = { id, claims: {} }
  const simplifiedClaim = simplifyClaimForEdit(claim)
  simplifiedClaim.value = newValue
  data.claims[property] = simplifiedClaim

  // Use wbeditentity as the endpoint is more complete, but recover summary
  data.summary = data.summary || `update ${property} claim`
  const { entity, success } = await API.entity.edit(data, config)
  const updatedClaim = entity.claims[property].find(isGuidClaim(guid))
  // Mimick claim actions responses
  return { claim: updatedClaim, success }
}
