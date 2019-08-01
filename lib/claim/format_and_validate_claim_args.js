const validate = require('../validate')
const { findPropertyDataType } = require('../properties/find_datatype')
const { parseQuantity } = require('./quantity')
const { hasSpecialSnaktype } = require('./special_snaktype')

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
  if (hasSpecialSnaktype(value)) return value
  const datatype = findPropertyDataType(property)
  // Try to recover data passed in a different type than the one expected:
  // - Quantities should be of type number
  if (datatype === 'quantity') return parseQuantity(value)
  return value
}
