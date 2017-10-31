const _ = require('../utils')
const validate = require('../validate')

module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)

  return (guid, qualifiers) => {
    return Promise.resolve()
    .then(() => {
      validate.guid(guid)

      if (_.isArray(qualifiers)) {
        qualifiers.forEach(validate.qualifierHash)
        qualifiers = qualifiers.join('|')
      } else {
        validate.qualifierHash(qualifiers)
      }

      return post('wbremovequalifiers', { claim: guid, qualifiers })
    })
    .then(Log(`remove qualifiers res (${guid}:${qualifiers})`))
    .catch(LogError(`remove qualifiers err (${guid}:${qualifiers})`))
  }
}
