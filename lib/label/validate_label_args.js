const wdk = require('wikidata-sdk')
const error_ = require('../error')
const _ = require('../utils')
const langRegex = /\w{2}(-\w{2})?/

module.exports = (entity, language, label) => {
  if (!wdk.isWikidataEntityId(entity)) {
    return error_.reject('invalid entity', 400, entity)
  }

  if (!(_.isNonEmptyString(language) && langRegex.test(language))) {
    return error_.reject('invalid language', 400, language)
  }

  if (!(_.isNonEmptyString(label))) {
    return error_.reject('invalid label', 400, label)
  }

  return Promise.resolve()
}
