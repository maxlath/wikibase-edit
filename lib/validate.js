const wdk = require('wikidata-sdk')
const error_ = require('./error')
const _ = require('./utils')
const datatypeTests = require('./datatype_tests')
const findPropertyDataType = require('./properties/find_datatype')
const { hasSpecialSnaktype } = require('./claim/special_snaktype')
// For a list of valid languages
// see https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities
const langRegex = /^\w{2,3}(-[\w-]{2,10})?$/
const siteRegex = /^[a-z_]{2,20}$/
const possibleRanks = [ 'normal', 'preferred', 'deprecated' ]

const validateValue = label => (property, value) => {
  const datatype = findPropertyDataType(property)
  if (hasSpecialSnaktype(value)) return
  if (value == null) {
    throw error_.new(`missing ${label} value`, 400, property, value)
  }
  if (!(datatypeTests[datatype](value))) {
    throw error_.new(`invalid ${datatype} value`, 400, property, value)
  }
}

// Couldn't find the reference hash length range
// but it looks to be somewhere around 40 characters
const validateHash = label => hash => {
  if (!/^[0-9a-f]{20,80}$/.test(hash)) {
    throw error_.new(`invalid ${label} hash`, 400, hash)
  }
}

const validateStringValue = (name, str) => {
  // Required by entity/edit.js validation:
  // values can be passed as objects to allow for flags (ex: 'remove=true')
  if (str.value != null) str = str.value
  // title is the API key for sitelinks
  if (str.title != null) str = str.title
  if (!(_.isNonEmptyString(str))) {
    throw error_.new(`invalid ${name}`, 400, str)
  }
}

const validate = module.exports = {
  entity: entity => {
    if (!wdk.isEntityId(entity)) {
      throw error_.new('invalid entity', 400, entity)
    }
  },
  property: property => {
    if (!_.isNonEmptyString(property)) {
      throw error_.new('missing property', 400, property)
    }
    if (!wdk.isPropertyId(property)) {
      throw error_.new('invalid property', 400, property)
    }
  },
  language: language => {
    if (!(_.isNonEmptyString(language) && langRegex.test(language))) {
      throw error_.new('invalid language', 400, language)
    }
  },
  labelOrDescription: validateStringValue,
  aliases: value => {
    value = _.forceArray(value)
    if (value.length === 0) throw error_.new('empty alias array', 400, value)
    // Yes, it's not an label or a description, but it works the same
    value.forEach(validateStringValue.bind(null, 'alias'))
  },
  claimValue: validateValue('claim'),
  referenceValue: validateValue('reference'),
  qualifierValue: validateValue('qualifier'),
  site: site => {
    if (!(_.isNonEmptyString(site) && siteRegex.test(site))) {
      throw error_.new('invalid site', 400, site)
    }
  },
  siteTitle: validateStringValue.bind(null, 'title'),
  guid: guid => {
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
  },
  referenceHash: validateHash('reference'),
  qualifierHash: validateHash('qualifier'),
  rank: rank => {
    if (possibleRanks.indexOf(rank) === -1) {
      throw error_.new('invalid rank', 400, rank)
    }
  }
}
