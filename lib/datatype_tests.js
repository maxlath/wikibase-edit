const wdk = require('wikidata-sdk')
const _ = require('./utils')

module.exports = {
  string: _.isNonEmptyString,
  claim: wdk.isEntityId,
  time: year => /^\d{4}$/.test(year.toString()),
  monolingualtext: value => {
    const [ text, language ] = value
    return _.isNonEmptyString(text) && _.isNonEmptyString(language)
  },
  quantity: num => _.isNumber(num)
}
