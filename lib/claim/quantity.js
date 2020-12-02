const _ = require('../utils')
const { isItemId } = require('wikibase-sdk')
const error_ = require('../error')
const itemUnitPattern = /^http.*\/entity\/(Q\d+)$/

module.exports = {
  parseQuantity: (amount, instance) => {
    let unit = '1'
    if (_.isPlainObject(amount)) ({ amount, unit } = amount)
    if (isItemId(unit)) unit = `${forceHttp(instance)}/entity/${unit}`
    if (_.isString(amount)) {
      if (!_.isStringNumber(amount)) throw error_.new('invalid string number', { amount, unit })
    }
    return { amount: signAmount(amount), unit }
  },
  parseUnit: unit => {
    if (unit.match(itemUnitPattern)) unit = unit.replace(itemUnitPattern, '$1')
    return unit
  }
}

const signAmount = amount => {
  if (_.isSignedStringNumber(amount)) return `${amount}`
  if (_.isStringNumber(amount)) amount = parseFloat(amount)
  if (amount === 0) return '0'
  return amount > 0 ? `+${amount}` : `${amount}`
}

const forceHttp = instance => instance.replace('https:', 'http:')
