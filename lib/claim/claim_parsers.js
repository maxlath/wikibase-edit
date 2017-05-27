const wdk = require('wikidata-sdk')

module.exports = {
  matchClaim: value => claim => value === wdk.simplifyClaim(claim),
  getGuid: claim => claim.id
}
