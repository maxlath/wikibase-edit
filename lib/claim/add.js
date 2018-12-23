const _ = require('../utils')
const error_ = require('../error')
const formatAndValidateClaimArgs = require('./format_and_validate_claim_args')
const postSnak = require('./post_snak')

module.exports = config => {
  const { Log, LogError } = require('../log')(config)
  const exists = require('./exists')(config)
  const addClaim = AddClaim(config)

  return function (entity, property, rawValue, options = {}) {
    if (arguments.length === 1 && _.isPlainObject(entity)) {
      options = entity
      entity = options.id
      property = options.property
      rawValue = options.value
    }
    return formatAndValidateClaimArgs(entity, property, rawValue)
    .then(value => {
      const key = _.buildKey(entity, property, value)
      return customAddClaim(exists, addClaim, entity, property, value, options)
      .then(Log(`add claim res (${key})`))
      .catch(LogError(`add claim err (${key})`))
    })
  }
}

const customAddClaim = (exists, addClaim, entity, property, value, options) => {
  const { allowDuplicates } = options
  if (allowDuplicates) return addClaim(entity, property, value)
  return exists(entity, property, value)
  .then(rejectDuplicatedValue({ entity, property, value }))
  .then(() => addClaim(entity, property, value))
}

const rejectDuplicatedValue = context => valueAlreadyExists => {
  if (valueAlreadyExists) {
    throw error_.new('claim already exist', 400, context)
  }
}

const AddClaim = config => {
  const { post } = require('../request')(config)
  return (entity, property, value) => {
    return postSnak({
      post,
      action: 'wbcreateclaim',
      data: { entity, property },
      value
    })
  }
}
