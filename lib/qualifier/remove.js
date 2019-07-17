const _ = require('../utils')
const validate = require('../validate')

module.exports = params => {
  var { guid, hash } = params
  validate.guid(guid)

  if (_.isArray(hash)) {
    hash.forEach(validate.qualifierHash)
    hash = hash.join('|')
  } else {
    validate.qualifierHash(hash)
  }

  return {
    action: 'wbremovequalifiers',
    data: {
      claim: guid,
      qualifiers: hash
    }
  }
}
