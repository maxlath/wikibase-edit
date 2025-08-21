import { simplifyClaim } from 'wikibase-sdk'
import { flatten, values } from '../utils.js'

const simplifyOptions = {
  keepIds: true,
  keepSnaktypes: true,
  keepQualifiers: true,
  keepReferences: true,
  keepRanks: true,
  keepRichValues: true,
}

export const findClaimByGuid = (claims, guid) => {
  for (const claim of flatten(values(claims))) {
    if (claim.id.toLowerCase() === guid.toLowerCase()) return claim
  }
}

export const isGuidClaim = guid => claim => claim.id === guid

export const simplifyClaimForEdit = claim => simplifyClaim(claim, simplifyOptions)
