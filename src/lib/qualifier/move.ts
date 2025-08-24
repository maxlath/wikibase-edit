import { isGuid, isPropertyId, isHash, getEntityIdFromGuid, type Guid, type PropertyId, type Hash, type Claim } from 'wikibase-sdk'
import { findClaimByGuid } from '../claim/helpers.js'
import { propertiesDatatypesDontMatch } from '../claim/move_commons.js'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import type { WikibaseEditAPI } from '../index.js'
import type { SerializedConfig } from '../types/config.js'

export interface MoveQualifierParams {
  guid: Guid
  oldProperty: PropertyId
  newProperty: PropertyId
  hash: Hash
}

export async function moveQualifier (params: MoveQualifierParams, config: SerializedConfig, API: WikibaseEditAPI) {
  const { guid, oldProperty, newProperty, hash } = params

  if (!guid) throw newError('missing claim guid', 400, params)
  if (!isGuid(guid)) throw newError('invalid claim guid', 400, params)

  if (!oldProperty) throw newError('missing old property', 400, params)
  if (!isPropertyId(oldProperty)) throw newError('invalid old property', 400, params)

  if (!newProperty) throw newError('missing new property', 400, params)
  if (!isPropertyId(newProperty)) throw newError('invalid new property', 400, params)

  if (hash != null && !isHash(hash)) throw newError('invalid hash', 400, params)

  const currentEntityId = getEntityIdFromGuid(guid)
  const claims = await getEntityClaims(currentEntityId, config)
  const claim = findClaimByGuid(claims, guid)

  if (!claim) throw newError('claim not found', 400, params)

  if (!claim.qualifiers[oldProperty]) {
    params.foundQualifiers = Object.keys(claim.qualifiers)
    throw newError('no qualifiers found for this property', 400, params)
  }

  const originDatatype = config.properties[oldProperty]
  const targetDatatype = config.properties[newProperty]

  const recoverDatatypesMismatch = movedSnaks => {
    if (originDatatype !== targetDatatype) {
      propertiesDatatypesDontMatch({
        movedSnaks,
        originDatatype,
        originPropertyId: oldProperty,
        targetDatatype,
        targetPropertyId: newProperty,
      })
    }
  }

  if (hash) {
    const qualifier = claim.qualifiers[oldProperty].find(findByHash(hash))
    if (!qualifier) {
      params.foundHashes = claim.qualifiers[oldProperty].map(qualifier => qualifier.hash)
      throw newError('qualifier not found', 400, params)
    }
    recoverDatatypesMismatch([ qualifier ])
    claim.qualifiers[newProperty] = claim.qualifiers[newProperty] || []
    claim.qualifiers[newProperty].push(changeProperty(newProperty, qualifier))
    claim.qualifiers[oldProperty] = claim.qualifiers[oldProperty].filter(filterOutByHash(hash))
    if (claim.qualifiers[oldProperty].length === 0) delete claim.qualifiers[oldProperty]
  } else {
    claim.qualifiers[newProperty] = claim.qualifiers[oldProperty]
      .map(changeProperty.bind(null, newProperty))
    recoverDatatypesMismatch(claim.qualifiers[newProperty])
    delete claim.qualifiers[oldProperty]
  }

  const { statementsKey } = config

  const entityData = {
    rawMode: true,
    id: currentEntityId,
    [statementsKey]: [ claim ],
    summary: params.summary || config.summary || generateSummary(guid, oldProperty, newProperty, hash),
    baserevid: params.baserevid || config.baserevid,
  }

  const res = await API.entity.edit(entityData, config)
  const updatedClaim = findClaimByGuid(res.entity[statementsKey], guid)
  return { claim: updatedClaim }
}

const findByHash = hash => qualifier => qualifier.hash === hash
const filterOutByHash = hash => qualifier => qualifier.hash !== hash

const changeProperty = (newProperty, qualifier) => {
  qualifier.property = newProperty
  return qualifier
}

const generateSummary = (guid, oldProperty, newProperty, hash) => {
  if (hash) {
    return `moving a ${oldProperty} qualifier of ${guid} to ${newProperty}`
  } else {
    return `moving ${guid} ${oldProperty} qualifiers to ${newProperty}`
  }
}

export interface MoveQualifierResponse {
  claim: Claim
}
