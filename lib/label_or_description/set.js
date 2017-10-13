const validateArgs = require('./validate_args')

module.exports = name => config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)
  return (entity, language, value) => {
    return validateArgs(entity, language, name, value)
    .then(() => post(`wbset${name}`, { id: entity, language, value }))
    .then(Log(`set ${name} res (${entity}:${language}:${value})`))
    .catch(LogError(`set ${name} err (${entity}:${language}:${value})`))
  }
}
