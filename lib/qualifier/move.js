const error_ = require('../error')
const { isGuid, isPropertyId } = require('wikibase-sdk')
const getEntityClaims = require('../claim/get_entity_claims')
const { findClaimByGuid } = require('../claim/helpers')

module.exports = async (params, config, API) => {
  const { guid, oldProperty, newProperty } = params

  if (!guid) throw error_.new('missing claim guid', 400, params)
  if (!isGuid(guid)) throw error_.new('invalid claim guid', 400, params)

  if (!oldProperty) throw error_.new('missing old property', 400, params)
  if (!isPropertyId(oldProperty)) throw error_.new('invalid old property', 400, params)

  if (!newProperty) throw error_.new('missing new property', 400, params)
  if (!isPropertyId(newProperty)) throw error_.new('invalid new property', 400, params)

  const currentEntityId = guid.toUpperCase().split('$')[0]
  const claims = await getEntityClaims(currentEntityId, config)
  const claim = findClaimByGuid(claims, guid)

  claim.qualifiers[newProperty] = claim.qualifiers[oldProperty].map(qualifier => {
    qualifier.property = newProperty
    return qualifier
  })

  delete claim.qualifiers[oldProperty]

  const entityData = {
    rawMode: true,
    id: currentEntityId,
    claims: [ claim ]
  }

  const res = await API.entity.edit(entityData, config)
  const updatedClaim = findClaimByGuid(res.entity.claims, guid)
  return { claim: updatedClaim }
}
