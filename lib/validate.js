const wdk = require('wikidata-sdk')
const error_ = require('./error')
const _ = require('./utils')
const datatypeTests = require('./datatype_tests')
const findPropertyDataType = require('./properties/find_datatype')
const langRegex = /\w{2}(-\w{2})?/

module.exports = {
  entity: (entity) => {
    if (!wdk.isItemId(entity)) {
      throw error_.new('invalid entity', 400, entity)
    }
  },
  property: (property) => {
    if (!wdk.isPropertyId(property)) {
      throw error_.new('invalid property', 400, property)
    }
  },
  language: (language) => {
    if (!(_.isNonEmptyString(language) && langRegex.test(language))) {
      throw error_.new('invalid language', 400, language)
    }
  },
  labelOrDescription: (name, str) => {
    if (!(_.isNonEmptyString(str))) {
      throw error_.new(`invalid ${name}`, 400, str)
    }
  },
  claimValue: (property, value) => {
    const datatype = findPropertyDataType(property)
    if (value == null) {
      throw error_.new('missing claim value', 400, property, value)
    }
    if (!(datatypeTests[datatype](value))) {
      throw error_.new(`invalid ${datatype} value`, 400, property, value)
    }
  }
}
