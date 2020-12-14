const { claim: simplifyClaim, qualifier: simplifySnak } = require('wikibase-sdk').simplify
const _ = require('../utils')
const { parseUnit } = require('./quantity')
const error_ = require('../error')

module.exports = (property, datatype, propSnaks, value) => {
  if (!propSnaks) return

  const matchingSnaks = propSnaks.filter(isMatchingSnak(datatype, value))

  if (matchingSnaks.length === 0) return
  if (matchingSnaks.length === 1) return matchingSnaks[0]

  const context = { property, propSnaks, value }
  throw error_.new('snak not found: too many matching snaks', 400, context)
}

const isMatchingSnak = (datatype, value) => snak => {
  // Support both statements and qualifiers snaks
  const unwrappedSnak = snak.mainsnak ? snak.mainsnak : snak
  return sameValue(datatype, unwrappedSnak, value)
}

const sameValue = (datatype, snak, value) => {
  if (value.snaktype && value.snaktype !== 'value') {
    return snak.snaktype === value.snaktype
  }
  const snakValue = simplifyClaim(snak)
  const comparator = valueComparators[datatype]
  if (comparator) {
    return comparator(snak, snakValue, value)
  } else {
    return snakValue === value
  }
}

const valueComparators = {
  'globe-coordinate': (snak, snakValue, value) => {
    if (_.isPlainObject(value)) {
      const { latitude, longitude, altitude, precision, globe } = snak.datavalue.value
      if (latitude !== value.latitude) return false
      if (longitude !== value.longitude) return false
      if (precision !== value.precision) return false
      if (globe !== value.globe) return false
      if (!(altitude === null && value.altitude === undefined)) {
        if (altitude !== value.altitude) return false
      }
      return true
    } else {
      return snakValue[0] === value[0] && snakValue[1] === value[1]
    }
  },
  monolingualtext: (snak, snakValue, value) => {
    const { language } = snak.datavalue.value
    if (language !== value.language) return false
    return snakValue === value.text
  },
  quantity: (snak, snakValue, value) => {
    if (_.isPlainObject(value)) {
      if (value.unit !== getUnit(snak)) return false
      return parseAmount(value.amount) === parseAmount(snakValue)
    } else {
      return parseAmount(snakValue) === parseAmount(value)
    }
  },
  time: (snak, snakValue, value) => {
    if (value.time != null) {
      const snakRichValue = snak.datavalue.value
      if (value.time !== snakRichValue.time.replace(/-00/g, '-01')) return false
      if (value.timezone !== snakRichValue.timezone) return false
      if (value.before !== snakRichValue.before) return false
      if (value.after !== snakRichValue.after) return false
      if (value.precision !== snakRichValue.precision) return false
      if (value.calendarmodel !== snakRichValue.calendarmodel) return false
      return true
    } else {
      const simplifiedSnak = simplifySnak(snak, { timeConverter: 'simple-day' })
      return simplifiedSnak === value
    }
  }
}

const getUnit = snak => parseUnit(snak.datavalue.value.unit)

const parseAmount = amount => _.isString(amount) ? parseFloat(amount) : amount
