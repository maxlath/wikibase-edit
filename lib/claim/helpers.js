const _ = require('../utils')
const { simplify } = require('wikibase-sdk')
const simplifyOptions = {
  keepIds: true,
  keepSnaktypes: true,
  keepQualifiers: true,
  keepReferences: true,
  keepRanks: true
}

module.exports = {
  findClaimByGuid: (claims, guid) => {
    for (let claim of _.flatten(_.values(claims))) {
      if (claim.id === guid) return claim
    }
  },

  isGuidClaim: guid => claim => claim.id === guid,

  simplifyClaimForEdit: claim => simplify.claim(claim, simplifyOptions)
}
