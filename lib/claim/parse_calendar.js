const wdUrlBase = 'http://www.wikidata.org/entity/'
const gregorian = `${wdUrlBase}Q1985727`
const julian = `${wdUrlBase}Q1985786`
const calendarAliases = {
  julian,
  gregorian,
  Q1985727: gregorian,
  Q1985786: julian
}

module.exports = calendar => {
  if (!calendar) return gregorian
  const normalizedCalendar = calendar.replace(wdUrlBase, '')
  return calendarAliases[normalizedCalendar]
}
