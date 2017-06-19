module.exports = (config) => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)
  return (entity, language, value) => {
      return post(`wbsetaliases`, {
        id: entity,
        language,
        add: value,
        assert: 'user'
      })
    .then(Log(`add aliases res (${entity}:${language}:${value})`))
    .catch(LogError(`add aliases err (${entity}:${language}:${value})`))
  }
}
