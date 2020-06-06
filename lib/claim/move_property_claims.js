const error_ = require('../error')
const { isEntityId, isPropertyId } = require('wikibase-sdk')
const getEntityClaims = require('./get_entity_claims')

module.exports = async (params, config, API) => {
  const { propertyClaimsId, id, property } = params

  const [ currentEntityId, currentPropertyId ] = propertyClaimsId.split('#')

  if (!(isEntityId(currentEntityId) && isPropertyId(currentPropertyId))) {
    throw error_.new('invalid property claims id', 400, params)
  }

  if (!id) throw error_.new('missing target entity id', 400, params)
  if (!isEntityId(id)) throw error_.new('invalid target entity id', 400, params)

  if (!property) throw error_.new('missing property id', 400, params)
  const propertyDatatype = config.properties[property]

  if (currentEntityId === id && currentPropertyId === property) {
    throw error_.new("move operation wouldn't have any effect: same entity, same property", 400, params)
  }

  const claims = await getEntityClaims(currentEntityId, config)

  const propertyClaims = claims[currentPropertyId]

  if (propertyClaims == null) throw error_.new('property claims not found', 400, params)

  const { datatype: currentPropertyDatatype } = propertyClaims[0].mainsnak
  if (propertyDatatype !== currentPropertyDatatype) {
    params.propertyDatatype = propertyDatatype
    params.currentProperty = currentPropertyId
    params.currentPropertyDatatype = currentPropertyDatatype
    throw error_.new("properties datatype don't match", 400, params)
  }

  const currentEntityData = {
    rawMode: true,
    id: currentEntityId,
    claims: propertyClaims.map(claim => ({ id: claim.id, remove: true }))
  }

  propertyClaims.forEach(claim => {
    delete claim.id
    claim.mainsnak.property = property
  })

  if (currentEntityId === id) {
    currentEntityData.claims.push(...propertyClaims)
    const res = await API.entity.edit(currentEntityData, config)
    return [ res ]
  } else {
    const targetEntityData = {
      rawMode: true,
      id,
      claims: propertyClaims
    }
    const removeClaimsRes = await API.entity.edit(currentEntityData, config)
    const addClaimsRes = await API.entity.edit(targetEntityData, config)
    return [ removeClaimsRes, addClaimsRes ]
  }
}
