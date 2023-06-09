import { simplifyClaim } from 'wikibase-sdk'
import { hasSpecialSnaktype } from './special_snaktype.js'

export const matchClaim = value => claim => {
  if (typeof value === 'object') {
    if (hasSpecialSnaktype(value)) {
      if (claim.mainsnak.snaktype === value.snaktype) return true
    }
    value = value.value
  }
  return value === simplifyClaim(claim)
}

export const getGuid = claim => claim.id
