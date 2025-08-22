import { isGuid, isEntityId, isPropertyId, getEntityIdFromGuid } from 'wikibase-sdk'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import formatClaimValue from './format_claim_value.js'
import { findClaimByGuid } from './helpers.js'
import { propertiesDatatypesDontMatch } from './move_commons.js'
import { buildSnak } from './snak.js'

export async function moveClaim (params, config, API) {
  const { guid, propertyClaimsId, id: targetEntityId, property: targetPropertyId, newValue, baserevid } = params
  const { instance } = config

  let originEntityId, originPropertyId

  if (guid) {
    if (!isGuid(guid)) throw newError('invalid claim guid', 400, params)
    originEntityId = getEntityIdFromGuid(guid)
  } else if (propertyClaimsId) {
    ([ originEntityId, originPropertyId ] = propertyClaimsId.split('#'))
    if (!(isEntityId(originEntityId) && isPropertyId(originPropertyId))) {
      throw newError('invalid property claims id', 400, params)
    }
  } else {
    throw newError('missing claim guid or property claims id', 400, params)
  }

  if (!targetEntityId) throw newError('missing target entity id', 400, params)
  if (!isEntityId(targetEntityId)) throw newError('invalid target entity id', 400, params)

  if (!targetPropertyId) throw newError('missing property id', 400, params)
  const propertyDatatype = config.properties[targetPropertyId]

  const claims = await getEntityClaims(originEntityId, config)

  let movedClaims
  if (guid) {
    const claim = findClaimByGuid(claims, guid)
    if (!claim) throw newError('claim not found', 400, params)
    originPropertyId = claim.mainsnak.property
    movedClaims = [ claim ]
  } else {
    movedClaims = claims[originPropertyId]
    if (!movedClaims) throw newError('no property claims found', 400, params)
  }

  if (originEntityId === targetEntityId && originPropertyId === targetPropertyId && newValue == null) {
    throw newError("move operation wouldn't have any effect: same entity, same property", 400, params)
  }

  const { datatype: currentPropertyDatatype } = movedClaims[0].mainsnak

  if (propertyDatatype !== currentPropertyDatatype) {
    propertiesDatatypesDontMatch({
      movedSnaks: movedClaims,
      originPropertyId,
      originDatatype: currentPropertyDatatype,
      targetPropertyId,
      targetDatatype: propertyDatatype,
    })
  }

  const currentEntityData = {
    rawMode: true,
    id: originEntityId,
    claims: movedClaims.map(claim => ({ id: claim.id, remove: true })),
    summary: params.summary || config.summary || generateCurrentEntitySummary(guid, originEntityId, originPropertyId, targetEntityId, targetPropertyId),
  }

  movedClaims.forEach(claim => {
    delete claim.id
    if (newValue) {
      const value = formatClaimValue(propertyDatatype, newValue, instance)
      claim.mainsnak = buildSnak(targetPropertyId, propertyDatatype, value)
    } else {
      claim.mainsnak.property = targetPropertyId
    }
  })

  if (originEntityId === targetEntityId) {
    currentEntityData.claims.push(...movedClaims)
    currentEntityData.baserevid = baserevid
    const res = await API.entity.edit(currentEntityData, config)
    return [ res ]
  } else {
    if (baserevid) throw newError('commands editing multiple entities can not have a baserevid', 400, params)
    const targetEntityData = {
      rawMode: true,
      id: targetEntityId,
      claims: movedClaims,
      summary: params.summary || config.summary || generateTargetEntitySummary(guid, originEntityId, originPropertyId, targetEntityId, targetPropertyId),
    }
    const removeClaimsRes = await API.entity.edit(currentEntityData, config)
    const addClaimsRes = await API.entity.edit(targetEntityData, config)
    return [ removeClaimsRes, addClaimsRes ]
  }
}

const generateCurrentEntitySummary = (guid, originEntityId, originPropertyId, targetEntityId, targetPropertyId) => {
  if (guid) {
    if (originEntityId === targetEntityId) {
      return `moving a ${originPropertyId} claim to ${targetPropertyId}`
    } else {
      return `moving a ${originPropertyId} claim to ${targetEntityId}#${targetPropertyId}`
    }
  } else {
    if (originEntityId === targetEntityId) {
      return `moving ${originPropertyId} claims to ${targetPropertyId}`
    } else {
      return `moving ${originPropertyId} claims to ${targetEntityId}#${targetPropertyId}`
    }
  }
}

const generateTargetEntitySummary = (guid, originEntityId, originPropertyId, targetEntityId, targetPropertyId) => {
  if (guid) {
    return `moving a ${originEntityId}#${originPropertyId} claim from ${targetEntityId}#${targetPropertyId}`
  } else {
    return `moving ${originEntityId}#${originPropertyId} claims from ${targetEntityId}#${targetPropertyId}`
  }
}
