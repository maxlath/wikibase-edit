const validateLabelArgs = require('./validate_label_args')

module.exports = (config) => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)
  return (entity, language, label) => {
    return validateLabelArgs(entity, language, label)
    .then(() => {
      return post('wbsetlabel', {
        id: entity,
        language,
        value: label,
        assert: 'user'
      })
    })
    .then(Log(`set label res (${entity}:${language}:${label})`))
    .catch(LogError(`set label err (${entity}:${language}:${label})`))
  }
}
