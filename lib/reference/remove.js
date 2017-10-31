const _ = require('../utils')
const validate = require('../validate')

module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)

  return (guid, references) => {
    return Promise.resolve()
    .then(() => {
      validate.guid(guid)

      if (_.isArray(references)) {
        references.forEach(validate.referenceHash)
        references = references.join('|')
      } else {
        validate.referenceHash(references)
      }

      return post('wbremovereferences', { statement: guid, references })
    })
    .then(Log(`remove references res (${guid}:${references})`))
    .catch(LogError(`remove references err (${guid}:${references})`))
  }
}
