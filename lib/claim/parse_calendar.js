const wdUrlBase = 'http://www.wikidata.org/entity/'
const gregorian = `${wdUrlBase}Q1985727`
const julian = `${wdUrlBase}Q1985786`
const calendarAliases = {
  julian,
  gregorian,
  Q1985727: gregorian,
  Q1985786: julian,
}

export default (calendar, wikidataTimeString) => {
  if (!calendar) return getDefaultCalendar(wikidataTimeString)
  const normalizedCalendar = calendar.replace(wdUrlBase, '')
  return calendarAliases[normalizedCalendar]
}

const getDefaultCalendar = wikidataTimeString => {
  if (wikidataTimeString[0] === '-') return julian
  const [ year ] = wikidataTimeString
    .replace('+', '')
    .split('-')
    .map(num => parseInt(num))

  if (year > 1582) return gregorian
  else return julian
}
