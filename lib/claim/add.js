const _ = require('../utils')
const error_ = require('../error')
const getBuilder = require('./get_builder')
const formatAndValidateClaimArgs = require('./format_and_validate_claim_args')

module.exports = config => {
  const { Log, LogError } = require('../log')(config)
  const exists = require('./exists')(config)
  const addClaim = AddClaim(config)

  return (entity, property, rawValue) => {
    return formatAndValidateClaimArgs(entity, property, rawValue)
    .then(value => {
      return exists(entity, property, value)
      .then(rejectDuplicatedValue({ entity, property, value }))
      .then(() => addClaim(entity, property, value))
      .then(Log(`add claim res (${entity}:${property}:${_.stringify(value)})`))
      .catch(LogError(`add claim err (${entity}:${property}:${_.stringify(value)})`))
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
  return (entity, property, value) => {
    const body = {
      value: getBuilder(property)(value),
      entity,
      property,
      snaktype: 'value'
    }
    return post('wbcreateclaim', body)
  }
}
