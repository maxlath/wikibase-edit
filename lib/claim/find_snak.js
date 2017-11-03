const wdk = require('wikidata-sdk')
const _ = require('../utils')
const findPropertyDataType = require('../properties/find_datatype')
const { parseUnit } = require('./quantity')

module.exports = (property, propSnaks, value) => {
  const datatype = findPropertyDataType(property)
  if (!propSnaks) return
  for (let snak of propSnaks) {
    // Support both statements and qualifiers snaks
    let unwrappedSnak = snak.mainsnak ? snak.mainsnak : snak
    if (sameValue(datatype, unwrappedSnak, value)) return snak
  }
}

const sameValue = (datatype, snak, value) => {
  const snakValue = wdk.simplifyClaim(snak)
  const comparator = valueComparators[datatype]
  if (comparator) {
    return comparator(snak, snakValue, value)
  } else {
    return snakValue === value
  }
}

const valueComparators = {
  time: (snak, snakValue, value) => cleanTime(snakValue) === value,
  quantity: (snak, snakValue, value) => {
    if (_.isPlainObject(value)) {
      if (value.unit !== getUnit(snak)) return false
      return parseAmount(value.amount) === snakValue
    } else {
      return snakValue === value
    }
  },
  monolingualtext: (snak, snakValue, value) => {
    const { language } = snak.datavalue.value
    if (language !== value.language) return false
    return snakValue === value.text
  }
}

const cleanTime = time => {
  // Turn '+1802-00-00T00:00:00Z' into '1802'
  return time
  // Remove T00:00:00.000Z or T00:00:00Z
  .replace(/T[0:.]+Z/, '')
  // Remove empty month or day values
  .replace(/-00/g)
  // Remove positive signs
  .replace(/^\+/)
}

const getUnit = snak => parseUnit(snak.datavalue.value.unit)

const parseAmount = amount => _.isString(amount) ? parseFloat(amount) : amount
