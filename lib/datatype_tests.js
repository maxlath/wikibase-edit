const wdk = require('wikidata-sdk')
const _ = require('./utils')

module.exports = {
  string: (str) => /\w/.test(str),
  claim: wdk.isWikidataId,
  time: (year) => /^\d{4}$/.test(year.toString()),
  monolingualtext: (valueObj) => {
    const { text, language } = valueObj
    return _.isNonEmptyString(text) && _.isNonEmptyString(language)
  },
  quantity: (num) => _.isNumber(num)
}
