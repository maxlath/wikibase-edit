import { isEntityId, isItemId } from 'wikibase-sdk'
import { parseCalendar } from './claim/parse_calendar.js'
import { parseUnit } from './claim/quantity.js'
import { newError } from './error.js'
import { isNonEmptyString, isNumber, isPlainObject, isStringNumber } from './utils.js'

export const string = isNonEmptyString
export const entity = isEntityId
// See https://www.mediawiki.org/wiki/Wikibase/DataModel#Dates_and_times
// The positive years will be signed later
export const time = time => {
  time = time.value || time
  let precision, calendar, calendarmodel
  if (isPlainObject(time)) {
    const dateObject = time;
    ({ precision, calendar, calendarmodel, time } = time)
    if (typeof precision === 'number' && (precision < 0 || precision > 14)) {
      return false
    }
    if (precision > 11) throw newError('time precision not supported by the Wikibase API', dateObject)
    calendarmodel = calendarmodel || calendar
    if (calendarmodel && !parseCalendar(calendarmodel, time)) {
      throw newError('invalid calendar', dateObject)
    }
  }
  time = time.toString()
  const sign = time[0] === '-' ? '-' : '+'
  const year = time.replace(/^(-|\+)/, '').split('-')[0]
  // Parsing as an ISO String should not throw an Invalid time value error
  // Only trying to parse 5-digit years or below, as higher years
  // will fail, even when valid Wikibase dates
  // Excluding negative years as the format expected by Wikibase
  // doesn't have the padding zeros expected by ISO
  if (sign === '+' && year.length <= 5) {
    try {
      time = time.replace(/^\+/, '')
      let isoTime = time
      // ISO validation would fail if either date or month are 0
      // Replace date or date and month digits with 01
      // if precision is less than 11 or 10, respectively
      if (precision != null) {
        if (precision < 10) {
          isoTime = isoTime.replace(/^(\d{4})-\d{1,2}-\d{1,2}/, '$1-01-01')
        } else if (precision < 11) {
          isoTime = isoTime.replace(/^(\d{4}-\d{1,2})-\d{1,2}/, '$1-01')
        }
      }
      new Date(isoTime).toISOString()
    } catch (err) {
      if (err.name === 'RangeError') return false
      else throw err
    }
  }
  if (precision != null && precision > 11) {
    return /^(-|\+)?\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2,3}Z$/.test(time)
  } else if (time.match('T')) {
    return /^(-|\+)?\d{4,16}-\d{2}-\d{2}T00:00:00(\.000)?Z$/.test(time)
  } else {
    return /^(-|\+)?\d{4,16}(-\d{2}){0,2}$/.test(time)
  }
}
export const monolingualtext = value => {
  value = value.value || value
  const { text, language } = value
  return isNonEmptyString(text) && isNonEmptyString(language)
}
// cf https://www.mediawiki.org/wiki/Wikibase/DataModel#Quantities
export const quantity = amount => {
  amount = amount.value || amount
  if (isPlainObject(amount)) {
    let unit
    ;({ unit, amount } = amount)
    if (unit && !isItemId(parseUnit(unit)) && unit !== '1') return false
  }
  // Accepting both numbers or string numbers as the amount will be
  // turned as a string lib/claim/builders.js signAmount function anyway
  return isNumber(amount) || isStringNumber(amount)
}
export const globecoordinate = obj => {
  obj = obj.value || obj
  if (!isPlainObject(obj)) return false
  const { latitude, longitude, precision } = obj
  return isNumber(latitude) && isNumber(longitude) && isNumber(precision)
}
