import { parseQuantity } from './quantity.js'
import { hasSpecialSnaktype } from './special_snaktype.js'

export default (datatype, value, instance) => {
  if (hasSpecialSnaktype(value)) return value
  // Try to recover data passed in a different type than the one expected:
  // - Quantities should be of type number
  if (datatype === 'Quantity') return parseQuantity(value, instance)
  return value
}
