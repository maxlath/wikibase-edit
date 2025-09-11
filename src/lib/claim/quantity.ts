import { isItemId } from 'wikibase-sdk'
import error_ from '../error.js'
import { isPlainObject, isSignedStringNumber, isString, isStringNumber } from '../utils.js'

const itemUnitPattern = /^http.*\/entity\/(Q\d+)$/

export const parseQuantity = (amount, instance) => {
  let unit, upperBound, lowerBound
  if (isPlainObject(amount)) ({ amount, unit, upperBound, lowerBound } = amount)
  if (isItemId(unit)) unit = `${forceHttp(instance)}/entity/${unit}`
  validateNumber('amount', amount)
  validateNumber('upperBound', upperBound)
  validateNumber('lowerBound', lowerBound)
  unit = unit || '1'
  return { amount: signAmount(amount), unit, upperBound, lowerBound }
}
export const parseUnit = unit => {
  if (unit.match(itemUnitPattern)) unit = unit.replace(itemUnitPattern, '$1')
  return unit
}

const signAmount = amount => {
  if (isSignedStringNumber(amount)) return `${amount}`
  if (isStringNumber(amount)) amount = parseFloat(amount)
  if (amount === 0) return '0'
  return amount > 0 ? `+${amount}` : `${amount}`
}

const forceHttp = instance => instance.replace('https:', 'http:')

const validateNumber = (label, num) => {
  if (isString(num) && !isStringNumber(num)) {
    throw error_.new('invalid string number', { [label]: num })
  }
}
