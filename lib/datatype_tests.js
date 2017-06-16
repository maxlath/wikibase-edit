const wdk = require('wikidata-sdk')
const _ = require('./utils')

module.exports = {
  string: _.isNonEmptyString,
  claim: wdk.isEntityId,
  time: (year) => /^\d{4}$/.test(year.toString()),
  monolingualtext: (valueObj) => {
    const { text, language } = valueObj
    return _.isNonEmptyString(text) && _.isNonEmptyString(language)
  },
  quantity: (num) => _.isNumber(num)
}
