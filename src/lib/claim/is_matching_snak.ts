import { simplifySnak, type Claim, type GlobeCoordinateSnakDataValue, type MonolingualTextSnakDataValue, type QuantitySnakDataValue, type Snak, type SnakBase, type SnakBaseWithValue, type StringSnakDataValue, type TimeSnakDataValue, type WikibaseEntityIdSnakDataValue } from 'wikibase-sdk'
import { newError } from '../error.js'
import { inviteToOpenAFeatureRequest } from '../issues.js'
import { isPlainObject, isString } from '../utils.js'
import { parseUnit } from './quantity.js'
import type { SimplifiedEditableSnak } from '../types/edit_entity.js'

export type SearchedValue = SimplifiedEditableSnak | Snak

export function isMatchingSnak (_existingSnak: Claim | SnakBase, _searchedValue: SearchedValue) {
  const existingSnak: SnakBase = 'mainsnak' in _existingSnak ? _existingSnak.mainsnak : _existingSnak
  if (typeof _searchedValue === 'object' && 'snaktype' in _searchedValue && _searchedValue.snaktype && (_searchedValue.snaktype !== 'value' || existingSnak.snaktype !== 'value')) {
    return existingSnak.snaktype === _searchedValue.snaktype
  }
  let searchedValue: SimplifiedEditableSnak
  if (typeof _searchedValue === 'object' && 'datavalue' in _searchedValue) {
    searchedValue = _searchedValue.datavalue.value
  } else {
    searchedValue = _searchedValue as SnakBaseWithValue['datavalue']['value']
  }
  if (!('datavalue' in existingSnak)) return false
  const datavalueType = existingSnak.datavalue.type
  if (comparatorsByDatavalueType[datavalueType] == null) {
    const context = { datavalueType }
    const featureRequestMessage = inviteToOpenAFeatureRequest({
      title: `claim reconciliation: add support for ${datavalueType} datavalue type`,
      context,
    })
    throw newError(`unsupported datavalue type: ${datavalueType}\n${featureRequestMessage}`, context)
  }
  // @ts-expect-error
  return comparatorsByDatavalueType[datavalueType](existingSnak, searchedValue)
}

const comparatorsByDatavalueType = {
  globecoordinate: (snak: SnakBaseWithValue & { datavalue: GlobeCoordinateSnakDataValue }, searchedValue: GlobeCoordinateSnakDataValue['value'] | [ number, number ]) => {
    const value = snak.datavalue.value
    const { latitude, longitude, altitude, precision, globe } = value
    if (typeof searchedValue === 'object' && !(searchedValue instanceof Array)) {
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
  monolingualtext: (snak: SnakBaseWithValue & { datavalue: MonolingualTextSnakDataValue }, searchedValue: MonolingualTextSnakDataValue['value']) => {
    const value = snak.datavalue.value
    const { text, language } = value
    if (typeof searchedValue === 'string') {
      return text === searchedValue
    } else {
      return language === searchedValue.language && text === searchedValue.text
    }
  },
  quantity: (snak: (SnakBaseWithValue & { datavalue: QuantitySnakDataValue }), searchedValue: QuantitySnakDataValue['value'] | number) => {
    const value = snak.datavalue.value
    let { amount, lowerBound, upperBound } = value
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
  string: (snak: SnakBaseWithValue & { datavalue: StringSnakDataValue }, searchedValue: string) => {
    const value = snak.datavalue.value
    if (searchedValue.startsWith('http')) {
      return normalizeUrl(value) === normalizeUrl(searchedValue)
    } else {
      return value === searchedValue
    }
  },
  time: (snak: SnakBaseWithValue & { datavalue: TimeSnakDataValue }, searchedValue: TimeSnakDataValue['value'] | string) => {
    const value = snak.datavalue.value
    const { time, timezone, before, after, precision, calendarmodel } = value
    if (typeof searchedValue === 'object') {
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
  'wikibase-entityid': (snak: SnakBaseWithValue & { datavalue: WikibaseEntityIdSnakDataValue }, searchedValue: WikibaseEntityIdSnakDataValue['value'] | string) => {
    const value = snak.datavalue.value
    if (typeof searchedValue === 'string') {
      return value.id === searchedValue
    } else if (value.id != null && searchedValue.id != null) {
      return value.id === searchedValue.id
    } else {
      return value['entity-type'] === searchedValue['entity-type'] && value['numeric-id'] === searchedValue['numeric-id']
    }
  },
}

function getUnit (snak: SnakBaseWithValue & { datavalue: QuantitySnakDataValue }) {
  return parseUnit(snak.datavalue.value.unit)
}

const parseAmount = amount => isString(amount) ? parseFloat(amount) : amount

function normalizeTime (time, precison) {
  time = time.replace(/^\+/, '')
  if (precison <= 11) {
    time = time
      .replace(/-00/g, '-01')
      .split('T')[0]
  }
  return time
}

const normalizeUrl = url => url.replace(/\/$/, '').replace(/\/\/www\./, '//').toLowerCase()
