const wdUrlBase = 'http://www.wikidata.org/entity/'
const gregorian = `${wdUrlBase}Q1985727`
const julian = `${wdUrlBase}Q1985786`
const calendarAliases = {
  julian,
  gregorian,
  Q1985727: gregorian,
  Q1985786: julian,
} as const

export type CalendarAlias = keyof typeof calendarAliases

export function parseCalendar (calendar: string, wikidataTimeString: string) {
  if (!calendar) return getDefaultCalendar(wikidataTimeString)
  const normalizedCalendar = calendar.replace(wdUrlBase, '')
  return calendarAliases[normalizedCalendar]
}

function getDefaultCalendar (wikidataTimeString: string) {
  if (wikidataTimeString.startsWith('-')) return julian
  const [ year ] = wikidataTimeString
    .replace('+', '')
    .split('-')
    .map(num => parseInt(num))

  if (year > 1582) return gregorian
  else return julian
}
