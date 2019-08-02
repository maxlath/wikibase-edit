const { forceArray } = require('../utils')
const validate = require('../validate')
const error_ = require('../error')

module.exports = params => {
  const { guid } = params
  if (!guid) throw error_.new('missing guid', params)

  const guids = forceArray(guid)
  guids.forEach(validate.guid)

  return {
    action: 'wbremoveclaims',
    data: {
      claim: guids.join('|')
    }
  }
}
