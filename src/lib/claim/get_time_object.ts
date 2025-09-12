import { isPlainObject } from '../utils.js'
import { parseCalendar } from './parse_calendar.js'
import type { CustomEditableTimeSnakValue } from '../types/snaks.js'

export function getTimeObject (value: CustomEditableTimeSnakValue | string | number) {
  let time, precision, calendar, calendarmodel, timezone, before, after
  if (isPlainObject(value)) {
    ({ time, precision, calendar, calendarmodel, timezone, before, after } = value)
    calendarmodel = calendarmodel || calendar
  } else {
    time = value
  }
  time = time
    // It could be a year passed as an integer
    .toString()
    // Drop milliseconds from ISO time strings as those aren't represented in Wikibase anyway
    // ex: '2019-04-01T00:00:00.000Z' -> '2019-04-01T00:00:00Z'
    .replace('.000Z', 'Z')
    .replace(/^\+/, '')
  if (precision == null) precision = getPrecision(time)
  const timeStringBase = getTimeStringBase(time, precision)
  return getPrecisionTimeObject(timeStringBase, precision, calendarmodel, timezone, before, after)
}

function getTimeStringBase (time: string, precision: number) {
  if (precision > 10) return time
  if (precision === 10) {
    if (time.match(/^-?\d+-\d+$/)) return time + '-00'
    else return time
  }
  // From the year (9) to the billion years (0)
  // See https://www.wikidata.org/wiki/Help:Dates#Precision
  const yearMatch = time.match(/^(-?\d+)/)
  if (yearMatch == null) throw new Error(`couldn't identify year: ${time}`)
  const year = yearMatch[0]
  return year + '-00-00'
}

// Guess precision from time string
// 2018 (year): 9
// 2018-03 (month): 10
// 2018-03-03 (day): 11
function getPrecision (time: string) {
  const unsignedTime = time.replace(/^-/, '')
  return unsignedTime.split('-').length + 8
}

function getPrecisionTimeObject (time: string, precision: number, calendarmodel?: string, timezone = 0, before = 0, after = 0) {
  const sign = time[0]

  // The Wikidata API expects signed years
  // Default to a positive year sign
  if (sign !== '-' && sign !== '+') time = `+${time}`

  if (precision <= 11 && !time.match('T')) time += 'T00:00:00Z'

  return {
    time,
    timezone,
    before,
    after,
    precision,
    calendarmodel: parseCalendar(calendarmodel, time),
  }
}
