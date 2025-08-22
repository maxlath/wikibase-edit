import { isItemId } from 'wikibase-sdk'
import { newError } from '../error.js'
import { isPlainObject, isSignedStringNumber, isString, isStringNumber } from '../utils.js'
import type { AbsoluteUrl } from '../types/common.js'

const itemUnitPattern = /^http.*\/entity\/(Q\d+)$/

export function parseQuantity (amount: number, instance: AbsoluteUrl) {
  let unit, upperBound, lowerBound
  if (isPlainObject(amount)) ({ amount, unit, upperBound, lowerBound } = amount)
  if (isItemId(unit)) unit = `${forceHttp(instance)}/entity/${unit}`
  validateNumber('amount', amount)
  validateNumber('upperBound', upperBound)
  validateNumber('lowerBound', lowerBound)
  unit = unit || '1'
  return { amount: signAmount(amount), unit, upperBound, lowerBound }
}
export function parseUnit (unit) {
  if (unit.match(itemUnitPattern)) unit = unit.replace(itemUnitPattern, '$1')
  return unit
}

function signAmount (amount) {
  if (isSignedStringNumber(amount)) return `${amount}`
  if (isStringNumber(amount)) amount = parseFloat(amount)
  if (amount === 0) return '0'
  return amount > 0 ? `+${amount}` : `${amount}`
}

const forceHttp = instance => instance.replace('https:', 'http:')

function validateNumber (label, num) {
  if (isString(num) && !isStringNumber(num)) {
    throw newError('invalid string number', { [label]: num })
  }
}
