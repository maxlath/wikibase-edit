const error_ = require('../error')
const { isGuid, isEntityId } = require('wikibase-sdk')
const getEntityClaims = require('./get_entity_claims')
const { findClaimByGuid, simplifyClaimForEdit } = require('./helpers')

module.exports = async (params, config, API) => {
  console.log('params', params)
  const { guid, id, property } = params

  if (!guid) throw error_.new('missing claim guid', 400, params)
  if (!isGuid(guid)) throw error_.new('invalid claim guid', 400, params)

  if (!id) throw error_.new('missing target entity id', 400, params)
  if (!isEntityId(id)) throw error_.new('invalid target entity id', 400, params)

  if (!property) throw error_.new('missing property id', 400, params)

  const currentId = guid.toUpperCase().split('$')[0]

  const claims = await getEntityClaims(currentId, config)
  const claim = findClaimByGuid(claims, guid)

  if (!claim) throw error_.new('claim not found', 400, params)

  if (currentId === id) {
    const { property: currentProperty } = claim.mainsnak
    if (currentProperty === property) {
      throw error_.new("move operation wouldn't have any effect: same entity, same property", 400, params)
    }
    const newClaim = simplifyClaimForEdit(claim)
    const updatedClaims = {
      [currentProperty]: { id: guid, remove: true },
      [property]: newClaim
    }
    const data = { id, claims: updatedClaims }
    const res = await API.entity.edit(data, config)
    return [ res ]
  }
}
