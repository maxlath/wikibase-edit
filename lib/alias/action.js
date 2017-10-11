const validate = require('../validate')
const _ = require('../utils')

module.exports = action => config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)
  return (entity, language, aliases) => {
    // Make sure to return a resolved or a rejected promise by wrapping
    // sync code in a promise chain
    return Promise.resolve()
    .then(() => {
      validateArgs(entity, language, aliases)

      const body = {
        id: entity,
        language,
        assert: config.assert
      }

      body[action] = _.forceArray(aliases).join('|')
      return post(`wbsetaliases`, body)
      .then(Log(`add aliases res (${entity}:${language}:${aliases})`))
      .catch(LogError(`add aliases err (${entity}:${language}:${aliases})`))
    })
  }
}

const validateArgs = (entity, language, aliases) => {
  validate.entity(entity)
  validate.language(language)
  validate.aliases(aliases)
}
