import { simplify } from 'wikibase-sdk'
import _ from '../utils.js'

const simplifyOptions = {
  keepIds: true,
  keepSnaktypes: true,
  keepQualifiers: true,
  keepReferences: true,
  keepRanks: true,
  keepRichValues: true,
}

export const findClaimByGuid = (claims, guid) => {
  for (const claim of _.flatten(_.values(claims))) {
    if (claim.id.toLowerCase() === guid.toLowerCase()) return claim
  }
}

export const isGuidClaim = guid => claim => claim.id === guid

export const simplifyClaimForEdit = claim => simplify.claim(claim, simplifyOptions)
