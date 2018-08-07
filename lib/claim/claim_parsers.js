const wdk = require('wikidata-sdk')
const { hasSpecialSnaktype } = require('./special_snaktype')

module.exports = {
  matchClaim: value => claim => {
    if (typeof value === 'object') {
      if (hasSpecialSnaktype(value)) {
        if (claim.mainsnak.snaktype === value.snaktype) return true
      }
      value = value.value
    }
    return value === wdk.simplifyClaim(claim)
  },
  getGuid: claim => claim.id
}
