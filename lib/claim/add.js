const error_ = require('../error')
const getBuilder = require('./get_builder')
const formatAndValidateClaimArgs = require('./format_and_validate_claim_args')

module.exports = config => {
  const { Log, LogError } = require('../log')(config)
  const exists = require('./exists')(config)
  const addClaim = AddClaim(config)

  return (entity, property, rawValue, ref) => {
    return formatAndValidateClaimArgs(entity, property, rawValue)
    .then(value => {
      return exists(entity, property, value)
      .then(rejectDuplicatedValue({ entity, property, value }))
      .then(() => addClaim(entity, property, value, ref))
      .then(Log(`add claim res (${entity}:${property}:${value})`))
      .catch(LogError(`add claim err (${entity}:${property}:${value})`))
    })
  }
}

const rejectDuplicatedValue = context => valueAlreadyExists => {
  if (valueAlreadyExists) {
    throw error_.new('claim already exist', 400, context)
  }
}

const AddClaim = config => {
  const { post } = require('../request')(config)
  const addReference = require('../reference/add')(config)
  return (entity, property, value, ref) => {
    const body = {
      value: getBuilder(property)(value),
      entity,
      property,
      snaktype: 'value',
      assert: config.assert
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
}
