import { flatten, values } from 'lodash-es'
import { simplifyClaim, type Claim, type Claims, type CustomSimplifiedClaim, type Guid, type Statement, type Statements } from 'wikibase-sdk'
import { newError } from '../error.js'

const simplifyOptions = {
  keepIds: true,
  keepSnaktypes: true,
  keepQualifiers: true,
  keepReferences: true,
  keepRanks: true,
  keepRichValues: true,
}

export function findClaimByGuid (claims: Claims | Statements, guid: Guid): Claim | Statement {
  for (const claim of flatten(values(claims))) {
    if (claim.id.toLowerCase() === guid.toLowerCase()) return claim
  }
  throw newError('claim not found', 400, { claims, guid })
}

export const isGuidClaim = (guid: Guid) => (claim: Claim) => claim.id === guid

export function simplifyClaimForEdit (claim: Claim) {
  return simplifyClaim(claim, simplifyOptions) as CustomSimplifiedClaim
}
