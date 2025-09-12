import { isGuid, isEntityId, isPropertyId, getEntityIdFromGuid, type Guid, type PropertyClaimsId, type PropertyId, type SimplifiedClaim, type Claim, type Statement, type MediaInfoId } from 'wikibase-sdk'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import { formatClaimValue } from './format_claim_value.js'
import { findClaimByGuid } from './helpers.js'
import { propertiesDatatypesDontMatch } from './move_commons.js'
import { buildSnak } from './snak.js'
import type { EditEntityRawModeParams, EditEntityResponse } from '../entity/edit.js'
import type { WikibaseEditAPI } from '../index.js'
import type { BaseRevId } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'
import type { RawEditableEntity } from '../types/edit_entity.js'

// Disabling MediaInfo for now, has this function needs access to snaks datatypes
// which aren't provided on MediaInfo statements
export type MovableEntityId = Exclude<RawEditableEntity['id'], MediaInfoId>

export interface MoveClaimParams {
  guid?: Guid<MovableEntityId>
  propertyClaimsId?: PropertyClaimsId
  id?: MovableEntityId
  property?: PropertyId
  newValue?: SimplifiedClaim
  summary?: string
  baserevid?: BaseRevId
}

export async function moveClaims (params: MoveClaimParams, config: SerializedConfig, API: WikibaseEditAPI) {
  const { guid, propertyClaimsId, id: targetEntityId, property: targetPropertyId, newValue, baserevid } = params
  const { instance } = config

  let originEntityId: MovableEntityId
  let originPropertyId: PropertyId

  if (guid) {
    if (!isGuid(guid)) throw newError('invalid claim guid', 400, params)
    originEntityId = getEntityIdFromGuid(guid) as MovableEntityId
  } else if (propertyClaimsId) {
    ([ originEntityId, originPropertyId ] = propertyClaimsId.split('#') as [ MovableEntityId, PropertyId ])
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

  let movedClaims: Claim[]
  if (guid) {
    const claim = findClaimByGuid(claims, guid) as Claim
    originPropertyId = claim.mainsnak.property
    movedClaims = [ claim ]
  } else {
    movedClaims = claims[originPropertyId] as Claim[]
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
      instance,
    })
  }

  const currentEntityData: EditEntityRawModeParams = {
    rawMode: true,
    id: originEntityId,
    claims: movedClaims.map((claim: Claim | Statement) => ({ id: claim.id, remove: true })),
    summary: params.summary || config.summary || generateCurrentEntitySummary(guid, originEntityId, originPropertyId, targetEntityId, targetPropertyId),
  }

  movedClaims.forEach(claim => {
    delete claim.id
    if (newValue) {
      const value = formatClaimValue(propertyDatatype, newValue, instance)
      claim.mainsnak = buildSnak(targetPropertyId, propertyDatatype, value, instance) as Claim['mainsnak']
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
    const targetEntityData: EditEntityRawModeParams = {
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

export type MoveClaimResponse = EditEntityResponse[]
