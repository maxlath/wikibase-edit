import { isGuid, isPropertyId, isHash, getEntityIdFromGuid, type Guid, type PropertyId, type Hash, type Claim, type Qualifier, type StatementQualifier } from 'wikibase-sdk'
import { findClaimByGuid } from '../claim/helpers.js'
import { propertiesDatatypesDontMatch } from '../claim/move_commons.js'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import type { MovableEntityId } from '../claim/move.js'
import type { EditEntityRawModeParams } from '../entity/edit.js'
import type { WikibaseEditAPI } from '../index.js'
import type { BaseRevId } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'

export interface MoveQualifierParams {
  guid: Guid<MovableEntityId>
  oldProperty: PropertyId
  newProperty: PropertyId
  hash?: Hash
  summary?: string
  baserevid?: BaseRevId
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

  const currentEntityId = getEntityIdFromGuid<MovableEntityId>(guid)
  const claims = await getEntityClaims(currentEntityId, config)
  const claim = findClaimByGuid(claims, guid)

  if (!claim) throw newError('claim not found', 400, params)

  if (!claim.qualifiers[oldProperty]) {
    throw newError('no qualifiers found for this property', 400, {
      ...params,
      foundQualifiers: Object.keys(claim.qualifiers),
    })
  }

  const originDatatype = config.properties[oldProperty]
  const targetDatatype = config.properties[newProperty]

  function recoverDatatypesMismatch (movedSnaks) {
    if (originDatatype !== targetDatatype) {
      propertiesDatatypesDontMatch({
        movedSnaks,
        originDatatype,
        originPropertyId: oldProperty,
        targetDatatype,
        targetPropertyId: newProperty,
        instance: config.instance,
      })
    }
  }

  if (hash) {
    const qualifier = claim.qualifiers[oldProperty].find(findByHash(hash))
    if (!qualifier) {
      throw newError('qualifier not found', 400, {
        ...params,
        foundHashes: claim.qualifiers[oldProperty].map(qualifier => qualifier.hash),
      })
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

  const entityData: EditEntityRawModeParams = {
    rawMode: true,
    id: currentEntityId,
    [statementsKey]: [ claim ],
    summary: 'summary' in params ? params.summary : (config.summary || generateSummary(guid, oldProperty, newProperty, hash)),
    baserevid: 'baserevid' in params ? params.baserevid : config.baserevid,
  }

  const res = await API.entity._rawEdit(entityData, config)
  const updatedClaim = findClaimByGuid(res.entity[statementsKey], guid)
  return { claim: updatedClaim }
}

const findByHash = hash => qualifier => qualifier.hash === hash
const filterOutByHash = hash => qualifier => qualifier.hash !== hash

function changeProperty (newProperty: PropertyId, qualifier: Qualifier | StatementQualifier) {
  qualifier.property = newProperty
  return qualifier
}

function generateSummary (guid: Guid, oldProperty: PropertyId, newProperty: PropertyId, hash: Hash) {
  if (hash) {
    return `moving a ${oldProperty} qualifier of ${guid} to ${newProperty}`
  } else {
    return `moving ${guid} ${oldProperty} qualifiers to ${newProperty}`
  }
}

export interface MoveQualifierResponse {
  claim: Claim
}
