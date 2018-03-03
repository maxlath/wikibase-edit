module.exports = (time, precision) => {
  const precisionIndex = (precision === undefined) ? getPrecisionIndex(time) : timePrecisions[precision]
  return timePrecisionObjectBuilders[precisionIndex](time)
}

// See https://www.wikidata.org/wiki/Help:Dates#Precision
const timePrecisions = [
  'billion', null, null, 'million', 'hundredsK', 'tensK',
  'millenium', 'century', 'decade', 'year', 'month', 'day'
]

const compatPrecisionOffset = 9
const getPrecisionIndex = time => timePrecisions[time.split('-').length - 1 + compatPrecisionOffset]

const timePrecisionObjectBuilders = {
  billion: years => getPrecisionTimeObject(0, `${years}-00-00${isoTimeRest}`),
  million: years => getPrecisionTimeObject(3, `${years}-01-01${isoTimeRest}`),
  hundredsK: years => getPrecisionTimeObject(4, `${years}-01-01${isoTimeRest}`),
  tensK: years => getPrecisionTimeObject(5, `${years}-00-00${isoTimeRest}`),
  millenium: year => getPrecisionTimeObject(6, `${year}-00-00${isoTimeRest}`),
  century: year => getPrecisionTimeObject(7, `${year}-00-00${isoTimeRest}`),
  decade: year => getPrecisionTimeObject(8, `${year}-00-00${isoTimeRest}`),
  year: year => getPrecisionTimeObject(9, `${year}-00-00${isoTimeRest}`),
  month: month => getPrecisionTimeObject(10, `${month}-00${isoTimeRest}`),
  day: day => getPrecisionTimeObject(11, `${day}${isoTimeRest}`)
}

const getPrecisionTimeObject = (precision, time) => {
  const sign = time[0]
  // The Wikidata API expects signed years
  // Default to a positive year sign
  if (sign !== '-' && sign !== '+') time = `+${time}`
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
