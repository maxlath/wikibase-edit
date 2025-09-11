import { simplifySnak } from 'wikibase-sdk'
import error_ from '../error.js'
import { inviteToOpenAFeatureRequest } from '../issues.js'
import { isPlainObject, isString } from '../utils.js'
import { parseUnit } from './quantity.js'

export default (existingSnak, searchedValue) => {
  // Support both statements and qualifiers snaks
  existingSnak = existingSnak.mainsnak ? existingSnak.mainsnak : existingSnak
  // Support both a full snak object or just the datavalue.value object
  searchedValue = searchedValue.datavalue ? searchedValue.datavalue.value : searchedValue
  const { datatype } = existingSnak
  if (searchedValue.snaktype && (searchedValue.snaktype !== 'value' || existingSnak.snaktype !== 'value')) {
    return existingSnak.snaktype === searchedValue.snaktype
  }
  if (comparatorsByDatatype[datatype] == null) {
    const context = { datatype }
    const featureRequestMessage = inviteToOpenAFeatureRequest({
      title: `claim reconciliation: add support for ${datatype} datatype`,
      context,
    })
    throw error_.new(`unsupported datatype: ${datatype}\n${featureRequestMessage}`, context)
  }
  return comparatorsByDatatype[datatype](existingSnak, searchedValue)
}

const simpleValueComparison = (snak, searchedValue) => snak.datavalue?.value === searchedValue
const entityValueComparison = (snak, searchedValue) => {
  const { value } = snak.datavalue
  if (typeof searchedValue === 'string') {
    return value.id === searchedValue
  } else if (value.id != null && searchedValue.id != null) {
    return value.id === searchedValue.id
  } else {
    return value['entity-type'] === searchedValue['entity-type'] && value['numeric-id'] === searchedValue['numeric-id']
  }
}

const comparatorsByDatatype = {
  commonsMedia: simpleValueComparison,
  edtf: simpleValueComparison,
  'external-id': simpleValueComparison,
  'geo-shape': simpleValueComparison,
  'globe-coordinate': (snak, searchedValue) => {
    const { latitude, longitude, altitude, precision, globe } = snak.datavalue.value
    if (isPlainObject(searchedValue)) {
      if (latitude !== searchedValue.latitude) return false
      if (longitude !== searchedValue.longitude) return false
      if (precision !== searchedValue.precision) return false
      if (globe !== searchedValue.globe) return false
      if (!(altitude === null && searchedValue.altitude === undefined)) {
        if (altitude !== searchedValue.altitude) return false
      }
      return true
    } else {
      return latitude === searchedValue[0] && longitude === searchedValue[1]
    }
  },
  math: simpleValueComparison,
  'musical-notation': simpleValueComparison,
  monolingualtext: (snak, searchedValue) => {
    const { text, language } = snak.datavalue.value
    return language === searchedValue.language && text === searchedValue.text
  },
  quantity: (snak, searchedValue) => {
    let { amount, lowerBound, upperBound } = snak.datavalue.value
    amount = parseAmount(amount)
    lowerBound = parseAmount(lowerBound)
    upperBound = parseAmount(upperBound)
    if (isPlainObject(searchedValue)) {
      const searchedAmount = parseAmount(searchedValue.amount)
      const searchedLowerBound = parseAmount(searchedValue.lowerBound)
      const searchedUpperBound = parseAmount(searchedValue.upperBound)
      const searchUnit = parseUnit(searchedValue.unit)
      const snakUnit = getUnit(snak)
      // Unspecified units do not prevent a match
      if (searchUnit !== '1' && snakUnit !== '1' && searchUnit !== snakUnit) {
        return false
      }
      if (lowerBound != null && searchedLowerBound != null && lowerBound !== searchedLowerBound) {
        return false
      }
      if (upperBound != null && searchedUpperBound != null && upperBound !== searchedUpperBound) {
        return false
      }
      return searchedAmount === amount
    } else {
      return amount === parseAmount(searchedValue)
    }
  },
  string: simpleValueComparison,
  'tabular-data': simpleValueComparison,
  time: (snak, searchedValue) => {
    const { time, timezone, before, after, precision, calendarmodel } = snak.datavalue.value
    if (searchedValue.time != null) {
      if (searchedValue.timezone != null && searchedValue.timezone !== timezone) return false
      if (searchedValue.before != null && searchedValue.before !== before) return false
      if (searchedValue.after != null && searchedValue.after !== after) return false
      if (searchedValue.precision != null && searchedValue.precision !== precision) return false
      if (searchedValue.calendarmodel != null && searchedValue.calendarmodel !== calendarmodel) return false
      const normalizedSnakTime = normalizeTime(time, searchedValue.precision)
      const normalizedInputValueTime = normalizeTime(searchedValue.time, searchedValue.precision)
      return normalizedSnakTime === normalizedInputValueTime
    } else {
      const simplifiedSnak = simplifySnak(snak, { timeConverter: 'simple-day' })
      return simplifiedSnak === searchedValue
    }
  },
  url: (snak, searchedValue) => normalizeUrl(snak.datavalue.value) === normalizeUrl(searchedValue),
  'wikibase-form': entityValueComparison,
  'wikibase-item': entityValueComparison,
  'wikibase-lexeme': entityValueComparison,
  'wikibase-property': entityValueComparison,
  'wikibase-sense': entityValueComparison,
}

const getUnit = snak => parseUnit(snak.datavalue.value.unit)

const parseAmount = amount => isString(amount) ? parseFloat(amount) : amount

const normalizeTime = (time, precison) => {
  time = time.replace(/^\+/, '')
  if (precison <= 11) {
    time = time
      .replace(/-00/g, '-01')
      .split('T')[0]
  }
  return time
}

const normalizeUrl = url => url.replace(/\/$/, '').replace(/\/\/www\./, '//').toLowerCase()
