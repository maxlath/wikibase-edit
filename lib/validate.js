const { isEntityId, isPropertyId, isGuid } = require('wikibase-sdk')
const error_ = require('./error')
const _ = require('./utils')
const datatypeTests = require('./datatype_tests')
const { hasSpecialSnaktype } = require('./claim/special_snaktype')
const { inviteToOpenAFeatureRequest } = require('./issues')
const datatypesToBuilderDatatypes = require('./properties/datatypes_to_builder_datatypes')
// For a list of valid languages
// see https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities
const langRegex = /^\w{2,3}(-[\w-]{2,10})?$/
const siteRegex = /^[a-z_]{2,20}$/
const possibleRanks = [ 'normal', 'preferred', 'deprecated' ]

const validateStringValue = (name, str) => {
  if (str === null) return
  if (typeof str === 'object') {
    if (str.remove === true) return
    // Required by entity/edit.js validation:
    // values can be passed as objects to allow for flags (ex: 'remove=true')
    if (str.value != null) str = str.value
    // title is the API key for sitelinks
    if (str.title != null) str = str.title
  }
  if (!(_.isNonEmptyString(str))) {
    throw error_.new(`invalid ${name}`, { str })
  }
}

module.exports = {
  entity: entity => {
    if (!isEntityId(entity)) {
      throw error_.new('invalid entity', { entity })
    }
  },
  property: property => {
    if (!_.isNonEmptyString(property)) {
      throw error_.new('missing property', { property })
    }
    if (!isPropertyId(property)) {
      throw error_.new('invalid property', { property })
    }
  },
  language: language => {
    if (!(_.isNonEmptyString(language) && langRegex.test(language))) {
      throw error_.new('invalid language', { language })
    }
  },
  labelOrDescription: validateStringValue,
  aliases: (value, options = {}) => {
    const { allowEmptyArray = false } = options
    value = _.forceArray(value)
    if (!allowEmptyArray && value.length === 0) throw error_.new('empty alias array', { value })
    // Yes, it's not an label or a description, but it works the same
    value.forEach(validateStringValue.bind(null, 'alias'))
  },
  snakValue: (property, datatype, value) => {
    if (hasSpecialSnaktype(value)) return
    if (value == null) {
      throw error_.new('missing snak value', { property, value })
    }
    if (value.value) value = value.value

    const builderDatatype = datatypesToBuilderDatatypes(datatype)

    if (datatypeTests[builderDatatype] == null) {
      const context = { property, value, datatype, builderDatatype }
      const featureRequestMessage = inviteToOpenAFeatureRequest({
        title: `add support for ${datatype} datatype`,
        context
      })
      throw error_.new(`unsupported datatype: ${datatype}\n${featureRequestMessage}`, context)
    }

    if (!datatypeTests[builderDatatype](value)) {
      throw error_.new(`invalid ${builderDatatype} value`, { property, value })
    }
  },
  site: site => {
    if (!(_.isNonEmptyString(site) && siteRegex.test(site))) {
      throw error_.new('invalid site', { site })
    }
  },
  siteTitle: validateStringValue.bind(null, 'title'),
  guid: guid => {
    if (!_.isNonEmptyString(guid)) {
      throw error_.new('missing guid', { guid })
    }

    if (!isGuid(guid)) {
      throw error_.new('invalid guid', { guid })
    }
  },
  hash: hash => {
    // Couldn't find the hash length range
    // but it looks to be somewhere around 40 characters
    if (!/^[0-9a-f]{20,80}$/.test(hash)) {
      throw error_.new('invalid hash', { hash })
    }
  },
  rank: rank => {
    if (possibleRanks.indexOf(rank) === -1) {
      throw error_.new('invalid rank', { rank })
    }
  }
}
