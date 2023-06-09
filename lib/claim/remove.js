import buildClaim from '../entity/build_claim.js'
import error_ from '../error.js'
import { getEntityClaims } from '../get_entity.js'
import { forceArray } from '../utils.js'
import validate from '../validate.js'
import isMatchingClaim from './is_matching_claim.js'

export default async (params, properties, instance, config) => {
  let { guid } = params
  const { id, property, value, qualifiers, reconciliation = {} } = params
  if (!(guid || (id && property && value))) {
    throw error_.new('missing guid or id/property/value', params)
  }

  if (!guid) {
    const existingClaims = await getEntityClaims(id, config)
    const claimData = { value, qualifiers }
    const claim = buildClaim(property, properties, claimData, instance)
    const { matchingQualifiers } = reconciliation
    const matchingClaims = existingClaims[property].filter(isMatchingClaim(claim, matchingQualifiers))
    if (matchingClaims.length === 0) throw error_.new('claim not found', params)
    guid = matchingClaims.map(({ id }) => id)
  }

  const guids = forceArray(guid)
  guids.forEach(validate.guid)

  return {
    action: 'wbremoveclaims',
    data: {
      claim: guids.join('|'),
    },
  }
}
