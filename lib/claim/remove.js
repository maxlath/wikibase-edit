const { forceArray } = require('../utils')
const wdk = require('wikidata-sdk')
const error_ = require('../error')

module.exports = config => {
  const { post } = require('../request')(config)
  return guids => {
    if (!guids) throw error_.new('missing guids', 400)
    guids = forceArray(guids)
    guids.forEach(guid => {
      if (!wdk.isGuid(guid)) throw error_.new('missing guids', 400, { guid })
    })
    return post('wbremoveclaims', { claim: guids.join('|') })
  }
}
