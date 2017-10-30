const wdk = require('wikidata-sdk')
const _ = require('./utils')

module.exports = {
  string: _.isNonEmptyString,
  claim: wdk.isEntityId,
  // See https://www.mediawiki.org/wiki/Wikibase/DataModel#Dates_and_times
  // The positive years will be signed later
  time: time => {
    // Parsing as an ISO String should not throw an Invalid time value error
    try {
      (new Date(time)).toISOString()
    } catch (err) {
      return false
    }
    // Only precision up to the day is handled
    return /^(-|\+)?\d{1,16}(-\d{2}){0,2}$/.test(time.toString())
  },
  monolingualtext: value => {
    const [ text, language ] = value
    return _.isNonEmptyString(text) && _.isNonEmptyString(language)
  },
  quantity: num => _.isNumber(num)
}
