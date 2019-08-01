const { findPropertyDataType } = require('../properties/find_datatype')
const stringNumberPattern = /^\d+(\.\d+)?$/

module.exports = (property, value) => {
  const datatype = findPropertyDataType(property)

  // Try to recover data passed in a different type than the one expected:
  // - Quantities should be of type number
  if (datatype === 'quantity' && typeof value === 'string') {
    // Throw if it is an invalid string number
    if (stringNumberPattern.test(value)) {
      value = parseFloat(value)
    } else {
      throw new Error(`invalid string number: ${value}`)
    }
  }

  return value
}
