const _ = require('../utils')
const wdk = require('wikidata-sdk')
const unitPrefix = 'http://www.wikidata.org/entity/'

module.exports = {
  parseQuantity: (amount, unit = '1') => {
    if (_.isPlainObject(amount)) {
      [ amount, unit ] = [ amount.amount, amount.unit ]
    }
    if (wdk.isItemId(unit)) unit = unitPrefix + unit
    if (_.isString(amount)) {
      if (!_.isStringNumber(amount)) throw new Error(`invalid string number: ${amount}`)
    }
    return { amount: signAmount(amount), unit }
  },
  parseUnit: unit => unit.replace(unitPrefix, '')
}

const signAmount = amount => {
  if (_.isSignedStringNumber(amount)) return amount
  if (_.isStringNumber(amount)) amount = parseInt(amount)
  if (amount === 0) return '0'
  return amount > 0 ? `+${amount}` : amount
}
