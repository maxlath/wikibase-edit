const { forceArray } = require('../utils')
const { isGuid } = require('wikibase-sdk')
const error_ = require('../error')

module.exports = params => {
  const { guid } = params
  if (!guid) throw error_.new('missing guid', 400, params)
  guids = forceArray(guid)
  guids.forEach(guid => {
    if (!isGuid(guid)) throw error_.new('invalid guid', 400, { guid })
  })
  return {
    action: 'wbremoveclaims',
    data: {
      claim: guids.join('|')
    }
  }
}
