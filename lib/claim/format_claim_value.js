const { parseQuantity } = require('./quantity')
const { hasSpecialSnaktype } = require('./special_snaktype')

module.exports = (datatype, value, instance) => {
  if (hasSpecialSnaktype(value)) return value
  // Try to recover data passed in a different type than the one expected:
  // - Quantities should be of type number
  if (datatype === 'Quantity') return parseQuantity(value, instance)
  return value
}
