import { getEntityIdFromGuid } from 'wikibase-sdk'
import findSnak from '../claim/find_snak.js'
import { newError } from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import { flatten, values } from '../utils.js'
import * as validate from '../validate.js'

export async function updateQualifier (params, config, API) {
  const { guid, property, oldValue, newValue } = params

  validate.guid(guid)
  validate.property(property)
  const datatype = config.properties[property]
  validate.snakValue(property, datatype, oldValue)
  validate.snakValue(property, datatype, newValue)

  if (oldValue === newValue) {
    throw newError('same value', 400, oldValue, newValue)
  }

  // Get current value snak hash
  const hash = await getSnakHash(guid, property, oldValue, config)
  return API.qualifier.set({
    guid,
    hash,
    property,
    value: newValue,
    summary: params.summary || config.summary,
    baserevid: params.baserevid || config.baserevid,
  }, config)
}

const getSnakHash = async (guid, property, oldValue, config) => {
  const entityId = getEntityIdFromGuid(guid)
  const claims = await getEntityClaims(entityId, config)
  const claim = findClaim(claims, guid)

  if (!claim) throw newError('claim not found', 400, guid)
  if (!claim.qualifiers) throw newError('claim qualifiers not found', 400, guid)

  const propSnaks = claim.qualifiers[property]

  const qualifier = findSnak(property, propSnaks, oldValue)

  if (!qualifier) {
    const actualValues = propSnaks ? propSnaks.map(getSnakValue) : null
    throw newError('qualifier not found', 400, { guid, property, expectedValue: oldValue, actualValues })
  }
  return qualifier.hash
}

const findClaim = (claims, guid) => {
  claims = flatten(values(claims))
  for (const claim of claims) {
    if (claim.id === guid) return claim
  }
}

const getSnakValue = snak => snak.datavalue?.value
