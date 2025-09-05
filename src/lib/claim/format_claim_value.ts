import { parseQuantity } from './quantity.js'
import { hasSpecialSnaktype } from './special_snaktype.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { Datatype, QuantitySnakDataValue, SimplifiedClaim } from 'wikibase-sdk'

export function formatClaimValue (datatype: Datatype, value: SimplifiedClaim, instance: AbsoluteUrl) {
  if (hasSpecialSnaktype(value)) return value
  // Try to recover data passed in a different type than the one expected:
  // - Quantities should be of type number
  if (datatype === 'quantity') {
    return parseQuantity(value as (number | string | QuantitySnakDataValue['value']), instance)
  }
  return value
}
