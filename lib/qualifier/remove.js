const _ = require('../utils')
const validate = require('../validate')

module.exports = params => {
  let { guid, hash } = params
  validate.guid(guid)

  if (_.isArray(hash)) {
    hash.forEach(validate.hash)
    hash = hash.join('|')
  } else {
    validate.hash(hash)
  }

  return {
    action: 'wbremovequalifiers',
    data: {
      claim: guid,
      qualifiers: hash
    }
  }
}
