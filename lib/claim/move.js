const error_ = require('../error')
const { isGuid, isEntityId, isPropertyId, getEntityIdFromGuid, simplify } = require('wikibase-sdk')
const getEntityClaims = require('./get_entity_claims')
const { findClaimByGuid } = require('./helpers')
const { parseQuantity } = require('./quantity')
const newIssue = 'https://github.com/maxlath/wikibase-edit/issues/new'

module.exports = async (params, config, API) => {
  const { guid, propertyClaimsId, id: targetEntityId, property: targetPropertyId } = params
  const { summary } = config

  let currentEntityId, currentPropertyId

  if (guid) {
    if (!isGuid(guid)) throw error_.new('invalid claim guid', 400, params)
    currentEntityId = getEntityIdFromGuid(guid)
  } else if (propertyClaimsId) {
    ([ currentEntityId, currentPropertyId ] = propertyClaimsId.split('#'))
    if (!(isEntityId(currentEntityId) && isPropertyId(currentPropertyId))) {
      throw error_.new('invalid property claims id', 400, params)
    }
  } else {
    throw error_.new('missing claim guid or property claims id', 400, params)
  }

  if (!targetEntityId) throw error_.new('missing target entity id', 400, params)
  if (!isEntityId(targetEntityId)) throw error_.new('invalid target entity id', 400, params)

  if (!targetPropertyId) throw error_.new('missing property id', 400, params)
  const propertyDatatype = config.properties[targetPropertyId]

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

  if (currentEntityId === targetEntityId && currentPropertyId === targetPropertyId) {
    throw error_.new("move operation wouldn't have any effect: same entity, same property", 400, params)
  }

  const { datatype: currentPropertyDatatype } = movedClaims[0].mainsnak

  if (propertyDatatype !== currentPropertyDatatype) {
    const typeConverterKey = `${currentPropertyDatatype}->${propertyDatatype}`
    const convertType = claimTypeConversions[typeConverterKey]
    if (convertType) {
      movedClaims
      .filter(claimWithValue)
      .forEach(convertType)
    } else {
      const errMessage = `properties datatype don't match
      No ${typeConverterKey} type converter found
      If you think that should be possible, please open a ticket:
      ${newIssue}?template=feature_request.md&title=${encodeURIComponent(`claim.move: add a ${typeConverterKey} type converter`)}&body=%20`
      params.propertyDatatype = propertyDatatype
      params.currentProperty = currentPropertyId
      params.currentPropertyDatatype = currentPropertyDatatype
      throw error_.new(errMessage, 400, params)
    }
  }

  const currentEntityData = {
    rawMode: true,
    id: currentEntityId,
    claims: movedClaims.map(claim => ({ id: claim.id, remove: true })),
    summary: summary || generateCurrentEntitySummary(guid, currentEntityId, currentPropertyId, targetEntityId, targetPropertyId)
  }

  movedClaims.forEach(claim => {
    delete claim.id
    claim.mainsnak.property = targetPropertyId
  })

  if (currentEntityId === targetEntityId) {
    currentEntityData.claims.push(...movedClaims)
    const res = await API.entity.edit(currentEntityData, config)
    return [ res ]
  } else {
    const targetEntityData = {
      rawMode: true,
      id: targetEntityId,
      claims: movedClaims,
      summary: summary || generateTargetEntitySummary(guid, currentEntityId, currentPropertyId, targetEntityId, targetPropertyId)
    }
    const removeClaimsRes = await API.entity.edit(currentEntityData, config)
    const addClaimsRes = await API.entity.edit(targetEntityData, config)
    return [ removeClaimsRes, addClaimsRes ]
  }
}

const generateCurrentEntitySummary = (guid, currentEntityId, currentPropertyId, targetEntityId, targetPropertyId) => {
  if (guid) {
    if (currentEntityId === targetEntityId) {
      return `moving a ${currentPropertyId} claim to ${targetPropertyId}`
    } else {
      return `moving a ${currentPropertyId} claim to ${targetEntityId}#${targetPropertyId}`
    }
  } else {
    if (currentEntityId === targetEntityId) {
      return `moving ${currentPropertyId} claims to ${targetPropertyId}`
    } else {
      return `moving ${currentPropertyId} claims to ${targetEntityId}#${targetPropertyId}`
    }
  }
}

const generateTargetEntitySummary = (guid, currentEntityId, currentPropertyId, targetEntityId, targetPropertyId) => {
  if (guid) {
    return `moving a ${currentEntityId}#${currentPropertyId} claim from ${targetEntityId}#${targetPropertyId}`
  } else {
    return `moving ${currentEntityId}#${currentPropertyId} claims from ${targetEntityId}#${targetPropertyId}`
  }
}

const simplifyToString = claim => {
  const { mainsnak } = claim
  mainsnak.datavalue.value = simplify.claim(claim).toString()
  mainsnak.datatype = mainsnak.datavalue.type = 'string'
  return claim
}

const claimTypeConversions = {
  'string->external-id': claim => {
    const { mainsnak } = claim
    mainsnak.datatype = 'string'
    return claim
  },
  'string->quantity': claim => {
    const { mainsnak } = claim
    const { value } = mainsnak.datavalue
    mainsnak.datavalue.value = parseQuantity(value)
    mainsnak.datatype = mainsnak.datavalue.type = 'quantity'
    return claim
  },
  'external-id->string': simplifyToString,
  'monolingualtext->string': simplifyToString,
  'quantity->string': simplifyToString,
}

const claimWithValue = claim => claim.mainsnak.snaktype === 'value'
