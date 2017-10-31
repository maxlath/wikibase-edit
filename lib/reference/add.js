const validate = require('../validate')
const snak = require('./snak')

module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)

  return (guid, property, value) => {
    return Promise.resolve()
    .then(() => {
      validate.guid(guid)
      validate.property(property)
      validate.referenceValue(property, value)

      const snaks = { property: [ snak(property, value) ] }

      return post('wbsetreference', {
        statement: guid,
        snaks: JSON.stringify(snaks)
      })
    })
    .then(Log(`add reference res (${guid}:${value})`))
    .catch(LogError(`add reference err (${guid}:${value})`))
  }
}
