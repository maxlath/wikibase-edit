const wdk = require('wikidata-sdk')
const error_ = require('../error')
const _ = require('../utils')
const validate = require('../validate')

module.exports = (guid, property, reference) => {
  if ((!_.isNonEmptyString(guid))) {
    return error_.reject('missing guid', 400, guid)
  }

  const [ entity, rest ] = guid.split('$')
  if (!wdk.isItemId(entity)) {
    return error_.reject('invalid guid', 400, guid)
  }

  if (!(_.isNonEmptyString(rest) && /[\w-]{36}/.test(rest))) {
    return error_.reject('invalid guid', 400, guid)
  }

  if ((!_.isNonEmptyString(property))) {
    return error_.reject('missing property', 400, property)
  }

  validate.property(property)

  if ((!_.isNonEmptyString(reference))) {
    return error_.reject('missing reference', 400, reference)
  }

  return Promise.resolve()
}
