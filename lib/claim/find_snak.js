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
  globecoordinate: (snak, snakValue, value) => {
    if (_.isPlainObject(value)) {
      const { latitude, longitude, altitude, precision, globe } = snak.datavalue.value
      if (latitude !== value.latitude) return false
      if (longitude !== value.longitude) return false
      if (precision !== value.precision) return false
      if (globe !== value.globe) return false
      // Accept if one is undefined and the other is null
      if (altitude != value.altitude) return false
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
      return parseAmount(value.amount) === snakValue
    } else {
      return snakValue === value
    }
  },
  time: (snak, snakValue, value) => cleanTime(snakValue) === value
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
