const error_ = require('../error')
const { isGuid, isEntityId, isPropertyId } = require('wikibase-sdk')
const getEntityClaims = require('./get_entity_claims')
const { findClaimByGuid } = require('./helpers')

module.exports = async (params, config, API) => {
  const { guid, propertyClaimsId, id, property } = params

  let currentEntityId, currentPropertyId

  if (guid) {
    if (!isGuid(guid)) throw error_.new('invalid claim guid', 400, params)
    currentEntityId = guid.toUpperCase().split('$')[0]
  } else if (propertyClaimsId) {
    ([ currentEntityId, currentPropertyId ] = propertyClaimsId.split('#'))
    if (!(isEntityId(currentEntityId) && isPropertyId(currentPropertyId))) {
      throw error_.new('invalid property claims id', 400, params)
    }
  } else {
    throw error_.new('missing claim guid or property claims id', 400, params)
  }

  if (!id) throw error_.new('missing target entity id', 400, params)
  if (!isEntityId(id)) throw error_.new('invalid target entity id', 400, params)

  if (!property) throw error_.new('missing property id', 400, params)
  const propertyDatatype = config.properties[property]

  const claims = await getEntityClaims(currentEntityId, config)

  let movedClaims
  if (guid) {
    const claim = findClaimByGuid(claims, guid)
    if (!claim) throw error_.new('claim not found', 400, params)
    currentPropertyId = claim.mainsnak.property
    movedClaims = [ claim ]
  } else {
    movedClaims = claims[currentPropertyId]
    if (!movedClaims) throw error_.new('no property claims found', 400, params)
  }

  if (currentEntityId === id && currentPropertyId === property) {
    throw error_.new("move operation wouldn't have any effect: same entity, same property", 400, params)
  }

  const { datatype: currentPropertyDatatype } = movedClaims[0].mainsnak

  if (propertyDatatype !== currentPropertyDatatype) {
    params.propertyDatatype = propertyDatatype
    params.currentProperty = currentPropertyId
    params.currentPropertyDatatype = currentPropertyDatatype
    throw error_.new("properties datatype don't match", 400, params)
  }

  const currentEntityData = {
    rawMode: true,
    id: currentEntityId,
    claims: movedClaims.map(claim => ({ id: claim.id, remove: true }))
  }

  movedClaims.forEach(claim => {
    delete claim.id
    claim.mainsnak.property = property
  })

  if (currentEntityId === id) {
    currentEntityData.claims.push(...movedClaims)
    const res = await API.entity.edit(currentEntityData, config)
    return [ res ]
  } else {
    const targetEntityData = {
      rawMode: true,
      id,
      claims: movedClaims
    }
    const removeClaimsRes = await API.entity.edit(currentEntityData, config)
    const addClaimsRes = await API.entity.edit(targetEntityData, config)
    return [ removeClaimsRes, addClaimsRes ]
  }
}
