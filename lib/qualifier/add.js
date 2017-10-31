const validate = require('../validate')
const getBuilder = require('../claim/get_builder')

module.exports = config => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)

  return (guid, property, value) => {
    return Promise.resolve()
    .then(() => {
      validate.guid(guid)
      validate.property(property)
      validate.qualifierValue(property, value)

      return post('wbsetqualifier', {
        snaktype: 'value',
        claim: guid,
        property,
        value: getBuilder(property)(value)
      })
    })
    .then(Log(`add qualifier res (${guid}:${value})`))
    .catch(LogError(`add qualifier err (${guid}:${value})`))
  }
}
