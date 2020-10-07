const _ = require('../utils')
const { simplify } = require('wikibase-sdk')
const simplifyOptions = {
  keepIds: true,
  keepSnaktypes: true,
  keepQualifiers: true,
  keepReferences: true,
  keepRanks: true,
  keepRichValues: true
}

module.exports = {
  findClaimByGuid: (claims, guid) => {
    for (const claim of _.flatten(_.values(claims))) {
      if (claim.id.toLowerCase() === guid.toLowerCase()) return claim
    }
  },

  isGuidClaim: guid => claim => claim.id === guid,

  simplifyClaimForEdit: claim => simplify.claim(claim, simplifyOptions)
}
