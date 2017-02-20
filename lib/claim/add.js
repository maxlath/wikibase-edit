const findPropertyType = require('../properties/find_type')
const { singleClaimBuilders: builders } = require('./builders')
const error_ = require('../error')

module.exports = (config) => {
  const { post } = require('../request')(config)
  const { Log, LogError } = require('../log')(config)
  const exists = require('./exists')(config)
  const addReference = require('../reference/add')(config)

  const addClaim = (entity, property, value, ref) => {
    const type = findPropertyType(property)
    const builder = builders[type]
    return post('wbcreateclaim', {
      value: builder(value),
      entity: entity,
      property: property,
      snaktype: 'value',
      assert: 'user'
    })
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
