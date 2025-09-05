import { isItemId, type QuantitySnakDataValue } from 'wikibase-sdk'
import { newError } from '../error.js'
import { isPlainObject, isSignedStringNumber, isString, isStringNumber } from '../utils.js'
import type { AbsoluteUrl } from '../types/common.js'

const itemUnitPattern = /^http.*\/entity\/(Q\d+)$/

export function parseQuantity (amount: number | string | QuantitySnakDataValue['value'], instance: AbsoluteUrl) {
  let unit, upperBound, lowerBound
  if (isPlainObject(amount)) ({ amount, unit, upperBound, lowerBound } = amount)
  if (isItemId(unit)) unit = `${forceHttp(instance)}/entity/${unit}`
  validateNumber('amount', amount)
  validateNumber('upperBound', upperBound)
  validateNumber('lowerBound', lowerBound)
  unit = unit || '1'
  return { amount: signAmount(amount), unit, upperBound, lowerBound }
}
export function parseUnit (unit: string) {
  if (unit.match(itemUnitPattern)) unit = unit.replace(itemUnitPattern, '$1')
  return unit
}

function signAmount (amount: string | number) {
  let amountNum: number
  if (isSignedStringNumber(amount)) return `${amount}`
  else if (typeof amount === 'number') amountNum = amount
  else if (isStringNumber(amount)) amountNum = parseFloat(amount)
  if (amountNum === 0) return '0'
  return amountNum > 0 ? `+${amountNum}` : `${amountNum}`
}

const forceHttp = (instance: string) => instance.replace('https:', 'http:')

function validateNumber (label: string, num: string | number) {
  if (isString(num) && !isStringNumber(num)) {
    throw newError('invalid string number', { [label]: num })
  }
}
