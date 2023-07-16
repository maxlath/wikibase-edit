import { isGuid, isPropertyId, isHash, getEntityIdFromGuid } from 'wikibase-sdk'
import { findClaimByGuid } from '../claim/helpers.js'
import { propertiesDatatypesDontMatch } from '../claim/move_commons.js'
import error_ from '../error.js'
import { getEntityClaims } from '../get_entity.js'

export default async (params, config, API) => {
  const { guid, oldProperty, newProperty, hash } = params

  if (!guid) throw error_.new('missing claim guid', 400, params)
  if (!isGuid(guid)) throw error_.new('invalid claim guid', 400, params)

  if (!oldProperty) throw error_.new('missing old property', 400, params)
  if (!isPropertyId(oldProperty)) throw error_.new('invalid old property', 400, params)

  if (!newProperty) throw error_.new('missing new property', 400, params)
  if (!isPropertyId(newProperty)) throw error_.new('invalid new property', 400, params)

  if (hash != null && !isHash(hash)) throw error_.new('invalid hash', 400, params)

  const currentEntityId = getEntityIdFromGuid(guid)
  const claims = await getEntityClaims(currentEntityId, config)
  const claim = findClaimByGuid(claims, guid)

  if (!claim) throw error_.new('claim not found', 400, params)

  if (!claim.qualifiers[oldProperty]) {
    params.foundQualifiers = Object.keys(claim.qualifiers)
    throw error_.new('no qualifiers found for this property', 400, params)
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
      throw error_.new('qualifier not found', 400, params)
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
