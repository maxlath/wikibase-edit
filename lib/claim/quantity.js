const _ = require('../utils')
const { isItemId } = require('wikibase-sdk')
const unitPrefix = 'http://www.wikidata.org/entity/'
const error_ = require('../error')

module.exports = {
  parseQuantity: (amount, unit = '1') => {
    if (_.isPlainObject(amount)) ({ amount, unit } = amount)
    if (isItemId(unit)) unit = unitPrefix + unit
    if (_.isString(amount)) {
      if (!_.isStringNumber(amount)) throw error_.new('invalid string number', { amount, unit })
    }
    return { amount: signAmount(amount), unit }
  },
  parseUnit: unit => unit.replace(unitPrefix, '')
}

const signAmount = amount => {
  if (_.isSignedStringNumber(amount)) return `${amount}`
  if (_.isStringNumber(amount)) amount = parseFloat(amount)
  if (amount === 0) return '0'
  return amount > 0 ? `+${amount}` : `${amount}`
}
