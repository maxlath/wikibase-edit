const { forceArray } = require('../utils')
const { isGuid } = require('wikibase-sdk')
const error_ = require('../error')

module.exports = params => {
  const { guid } = params
  if (!guid) throw error_.new('missing guid', params)
  guids = forceArray(guid)
  guids.forEach(guid => {
    if (!isGuid(guid)) throw error_.new('invalid guid', { guid })
  })
  return {
    action: 'wbremoveclaims',
    data: {
      claim: guids.join('|')
    }
  }
}
