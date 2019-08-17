const _ = require('../utils')
const validate = require('../validate')

module.exports = params => {
  var { guid, hash } = params
  validate.guid(guid)

  if (_.isArray(hash)) {
    hash.forEach(validate.hash)
    hash = hash.join('|')
  } else {
    validate.hash(hash)
  }

  return {
    action: 'wbremovereferences',
    data: {
      statement: guid,
      references: hash
    }
  }
}
