import { simplifyClaim, type Claims, type Guid, type Statements } from 'wikibase-sdk'
import { newError } from '../error.js'
import { flatten, values } from '../utils.js'

const simplifyOptions = {
  keepIds: true,
  keepSnaktypes: true,
  keepQualifiers: true,
  keepReferences: true,
  keepRanks: true,
  keepRichValues: true,
}

export function findClaimByGuid (claims: Claims | Statements, guid: Guid) {
  for (const claim of flatten(values(claims))) {
    if (claim.id.toLowerCase() === guid.toLowerCase()) return claim
  }
  throw newError('claim not found', 400, { claims, guid })
}

export const isGuidClaim = guid => claim => claim.id === guid

export const simplifyClaimForEdit = claim => simplifyClaim(claim, simplifyOptions)
