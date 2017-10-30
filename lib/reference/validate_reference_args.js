const wdk = require('wikidata-sdk')
const error_ = require('../error')
const _ = require('../utils')
const validate = require('../validate')

module.exports = (guid, property, reference) => {
  // Wrapping the validation in a promise chain to make sure
  // that we return a promise
  return Promise.resolve()
  .then(() => validateReferenceArgs(guid, property, reference))
}

const validateReferenceArgs = (guid, property, reference) => {
  if (!_.isNonEmptyString(guid)) {
    throw error_.new('missing guid', 400, guid)
  }

  const [ entity, rest ] = guid.split('$')
  if (!wdk.isItemId(entity)) {
    throw error_.new('invalid guid', 400, guid)
  }

  if (!(_.isNonEmptyString(rest) && /[\w-]{36}/.test(rest))) {
    throw error_.new('invalid guid', 400, guid)
  }

  if (!_.isNonEmptyString(property)) {
    throw error_.new('missing property', 400, property)
  }

  validate.property(property)
  validate.referenceValue(property, reference)
}
