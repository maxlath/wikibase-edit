const _ = require('../utils')

module.exports = (time, precision) => {
  if (_.isPlainObject(time)) ({ time, precision } = time)
  if (precision == null) precision = getPrecision(time)
  const timeStringBase = getTimeStringBase(time, precision)
  return getPrecisionTimeObject(precision, timeStringBase)
}

const getTimeStringBase = (time, precision) => {
  if (precision === 11) return time
  if (precision === 10) return time + '-00'
  // From the year (9) to the billion years (0)
  // See https://www.wikidata.org/wiki/Help:Dates#Precision
  return time + '-00-00'
}

// Guess precision from time string
// 2018 (year): 9
// 2018-03 (month): 10
// 2018-03-03 (day): 11
const getPrecision = time => {
  const unsignedTime = time.replace(/^-/, '')
  return unsignedTime.split('-').length + 8
}

const getPrecisionTimeObject = (precision, time) => {
  const sign = time[0]

  // The Wikidata API expects signed years
  // Default to a positive year sign
  if (sign !== '-' && sign !== '+') time = `+${time}`

  return {
    time: time + 'T00:00:00Z',
    timezone: 0,
    before: 0,
    after: 0,
    precision,
    calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
  }
}
