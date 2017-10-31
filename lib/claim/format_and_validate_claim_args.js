const _ = require('../utils')
const validate = require('../validate')
const findPropertyDataType = require('../properties/find_datatype')
const stringNumberPattern = /^\d+(\.\d+)?$/

module.exports = (entity, property, value) => {
  try {
    validate.entity(entity)
    validate.property(property)
    // Format before testing validity to avoid throwing on type errors
    // that could be recovered
    value = formatClaimValue(property, value)
    validate.claimValue(property, value)
    return Promise.resolve(value)
  } catch (err) {
    return Promise.reject(err)
  }
}

const formatClaimValue = (property, value) => {
  const datatype = findPropertyDataType(property)

  // Try to recover data passed in a different type than the one expected:
  // - Quantities should be of type number
  if (datatype !== 'quantity') return value

  // Handle array values when the quantity as an associated unit
  const num = _.isArray(value) ? value[0] : value
  if (!_.isString(num)) return value

  // Throw if it is an invalid string number
  if (!stringNumberPattern.test(num)) throw new Error(`invalid string number: ${num}`)

  if (_.isArray(value)) {
    return [ parseFloat(num), value[1] ]
  } else {
    return parseFloat(num)
  }
}
