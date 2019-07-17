const _ = require('../utils')
const validate = require('../validate')

module.exports = params => {
  var { guid, hash } = params
  validate.guid(guid)

  if (_.isArray(hash)) {
    hash.forEach(validate.referenceHash)
    hash = hash.join('|')
  } else {
    validate.referenceHash(hash)
  }

  return {
    action: 'wbremovereferences',
    data: {
      statement: guid,
      references: hash
    }
  }
}
