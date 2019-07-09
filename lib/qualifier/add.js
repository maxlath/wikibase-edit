const _ = require('../utils')
const validate = require('../validate')
const postSnak = require('../claim/post_snak')

module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)

  return (guid, property, value) => {
    const key = _.buildKey(guid, value)
    return Promise.resolve()
    .then(() => {
      validate.guid(guid)
      validate.property(property)
      validate.qualifierValue(property, datatype, value)

      return postSnak({
        post,
        action: 'wbsetqualifier',
        data: { claim: guid, property },
        value
      })
    })
    .then(Log(`add qualifier res (${key})`))
    .catch(LogError(`add qualifier err (${key})`))
  }
}
