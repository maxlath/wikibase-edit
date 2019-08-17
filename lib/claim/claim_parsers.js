const { claim: simplifyClaim } = require('wikibase-sdk').simplify
const { hasSpecialSnaktype } = require('./special_snaktype')

module.exports = {
  matchClaim: value => claim => {
    if (typeof value === 'object') {
      if (hasSpecialSnaktype(value)) {
        if (claim.mainsnak.snaktype === value.snaktype) return true
      }
      value = value.value
    }
    return value === simplifyClaim(claim)
  },
  getGuid: claim => claim.id
}
