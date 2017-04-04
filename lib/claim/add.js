const findPropertyDataType = require('../properties/find_datatype')
const properties = require('../properties/properties')
const { singleClaimBuilders: builders } = require('./builders')
const error_ = require('../error')

module.exports = (config) => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)
  const exists = require('./exists')(config)
  const addReference = require('../reference/add')(config)

  const addClaim = (entity, property, value, ref) => {
    const propType = properties[property].type.toLowerCase()
    const datatype = findPropertyDataType(property)
    // Use a builder specific to the proptype or a more generalist builder
    const builder = builders[propType] || builders[datatype]
    const body = {
      value: builder(value),
      entity,
      property,
      snaktype: 'value',
      assert: 'user'
    }
    return post('wbcreateclaim', body)
    .then(body => {
      if (ref && body.claim && body.claim.id) {
        return addReference(body.claim.id, ref)
      } else {
        return body
      }
    })
  }

  return (entity, property, value, ref) => {
    // Arguments are validated by 'exists'
    return exists(entity, property, value)
    .then((valueAlreadyExists) => {
      if (valueAlreadyExists) {
        throw error_.new('claim already exist', 400, { entity, property, value })
      }
      return addClaim(entity, property, value, ref)
    })
    .then(Log(`add claim res (${entity}:${property}:${value})`))
    .catch(LogError(`add claim err (${entity}:${property}:${value})`))
  }
}
