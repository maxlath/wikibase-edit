import { isEntityId, isPropertyId, isGuid, isItemId } from 'wikibase-sdk'
import { hasSpecialSnaktype } from './claim/special_snaktype.js'
import * as datatypeTests from './datatype_tests.js'
import { newError } from './error.js'
import { inviteToOpenAFeatureRequest } from './issues.js'
import { normalizeDatatype } from './properties/datatypes_to_builder_datatypes.js'
import { isPlainObject, isNonEmptyString, forceArray, isArray } from './utils.js'
// For a list of valid languages
// see https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities
const langRegex = /^\w{2,3}(-[\w-]{2,10})?$/
const siteRegex = /^[a-z_]{2,20}$/
const possibleRanks = [ 'normal', 'preferred', 'deprecated' ]

function validateStringValue (name, str) {
  if (str === null) return
  if (isPlainObject(str)) {
    if (str.remove === true) return
    // Required by entity/edit.js validation:
    // values can be passed as objects to allow for flags (ex: 'remove=true')
    if (str.value != null) str = str.value
    // title is the API key for sitelinks
    if (str.title != null) str = str.title
  }
  if (!(isNonEmptyString(str))) {
    throw newError(`invalid ${name}`, { str })
  }
}

export function validateEntity (entity) {
  if (!isEntityId(entity)) {
    throw newError('invalid entity', { entity })
  }
}
export function validateProperty (property) {
  if (!isNonEmptyString(property)) {
    throw newError('missing property', { property })
  }
  if (!isPropertyId(property)) {
    throw newError('invalid property', { property })
  }
}
export function validateLanguage (language) {
  if (!(isNonEmptyString(language) && langRegex.test(language))) {
    throw newError('invalid language', { language })
  }
}
export const validateLabelOrDescription = validateStringValue
export function validateAliases (value, options = {}) {
  const { allowEmptyArray = false } = options
  value = forceArray(value)
  if (!allowEmptyArray && value.length === 0) throw newError('empty alias array', { value })
  // Yes, it's not an label or a description, but it works the same
  value.forEach(validateStringValue.bind(null, 'alias'))
}
export function validateSnakValue (property, datatype, value) {
  if (hasSpecialSnaktype(value)) return
  if (value == null) {
    throw newError('missing snak value', { property, value })
  }
  if (value.value) value = value.value

  const builderDatatype = normalizeDatatype(datatype)

  // eslint-disable-next-line import-x/namespace
  if (datatypeTests[builderDatatype] == null) {
    const context = { property, value, datatype, builderDatatype }
    const featureRequestMessage = inviteToOpenAFeatureRequest({
      title: `add support for ${datatype} datatype`,
      context,
    })
    throw newError(`unsupported datatype: ${datatype}\n${featureRequestMessage}`, context)
  }

  // eslint-disable-next-line import-x/namespace
  if (!datatypeTests[builderDatatype](value)) {
    throw newError(`invalid ${builderDatatype} value`, { property, value })
  }
}
export function validateSite (site) {
  if (!(isNonEmptyString(site) && siteRegex.test(site))) {
    throw newError('invalid site', { site })
  }
}
export const validateSiteTitle = validateStringValue.bind(null, 'title')
export function validateBadges (badges) {
  if (!isArray(badges)) {
    throw newError('invalid badges', { badges })
  }
  for (const badge of badges) {
    if (!isItemId(badge)) {
      throw newError('invalid badge', { invalidBadge: badge, badges })
    }
  }
}
export function validateGuid (guid) {
  if (!isNonEmptyString(guid)) {
    throw newError('missing guid', { guid })
  }

  if (!isGuid(guid)) {
    throw newError('invalid guid', { guid })
  }
}
export function validateHash (hash) {
  // Couldn't find the hash length range
  // but it looks to be somewhere around 40 characters
  if (!/^[0-9a-f]{20,80}$/.test(hash)) {
    throw newError('invalid hash', { hash })
  }
}
export function validateRank (rank) {
  if (!possibleRanks.includes(rank)) {
    throw newError('invalid rank', { rank })
  }
}
