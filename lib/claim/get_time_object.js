module.exports = time => {
  const precision = getPrecisionIndex(time)
  return timePrecisionObjectBuilders[precision](time)
}

const timePrecisions = [ 'year', 'month', 'day' ]

const getPrecisionIndex = time => timePrecisions[time.split('-').length - 1]

const timePrecisionObjectBuilders = {
  year: year => getPrecisionTimeObject(9, `${year}-00-00${isoTimeRest}`),
  month: month => getPrecisionTimeObject(10, `${month}-00${isoTimeRest}`),
  day: day => getPrecisionTimeObject(11, `${day}${isoTimeRest}`)
}

const getPrecisionTimeObject = (precision, time) => {
  const sign = time[0]
  // The Wikidata API expects signed years
  // Default to a positive year sign
  if (sign !== '-' || sign !== '+') time = `+${time}`
  return {
    time,
    timezone: 0,
    before: 0,
    after: 0,
    precision,
    calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
  }
}

const isoTimeRest = 'T00:00:00Z'
