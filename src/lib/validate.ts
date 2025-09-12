import { isEntityId, isPropertyId, isGuid, isItemId, type CustomSimplifiedClaim, type Sitelink, type EntityId, type PropertyId, type WikimediaLanguageCode, wikimediaLanguageCodes, ranks, type Datatype, type Guid, type Hash, type Rank } from 'wikibase-sdk'
import { hasSpecialSnaktype } from './claim/special_snaktype.js'
import * as datatypeTests from './datatype_tests.js'
import { newError } from './error.js'
import { inviteToOpenAFeatureRequest } from './issues.js'
import { normalizeDatatype } from './properties/datatypes_to_builder_datatypes.js'
import { isNonEmptyString, forceArray, isArray, setHas, arrayIncludes } from './utils.js'
import type { EditableClaim, SimplifiedEditableSnak } from './types/edit_entity.js'

const siteRegex = /^[a-z_]{2,20}$/
const wikimediaLanguageCodesSet = new Set(wikimediaLanguageCodes)

function validateStringValue (name: string, str: string | EditableClaim | CustomSimplifiedClaim | Sitelink | null) {
  if (str === null) return
  if (typeof str === 'object') {
    if ('remove' in str && str.remove === true) return
    // Required by entity/edit.js validation:
    // values can be passed as objects to allow for flags (ex: 'remove=true')
    if ('value' in str && str.value != null) str = str.value as string
    // title is the API key for sitelinks
    else if ('title' in str && str.title != null) str = str.title
  }
  if (!(isNonEmptyString(str))) {
    throw newError(`invalid ${name}`, { str })
  }
}

export function validateEntityId (entityId: string): asserts entityId is EntityId {
  if (!isEntityId(entityId)) {
    throw newError('invalid entity id', { entityId })
  }
}
export function validatePropertyId (propertyId: unknown): asserts propertyId is PropertyId {
  if (!isNonEmptyString(propertyId)) {
    throw newError('missing property id', { propertyId })
  }
  if (!isPropertyId(propertyId)) {
    throw newError('invalid property id', { propertyId })
  }
}
export function validateLanguage (language: unknown): asserts language is WikimediaLanguageCode {
  if (!(isNonEmptyString(language) && setHas(wikimediaLanguageCodesSet, language))) {
    throw newError('invalid language', { language })
  }
}
export const validateLabelOrDescription = validateStringValue

export function validateAliases (value: string | string[], options: { allowEmptyArray?: boolean } = {}) {
  const { allowEmptyArray = false } = options
  value = forceArray(value)
  if (!allowEmptyArray && value.length === 0) throw newError('empty alias array', { value })
  // Yes, it's not an label or a description, but it works the same
  value.forEach(validateStringValue.bind(null, 'alias'))
}
export function validateSnakValue (property: PropertyId, datatype: Datatype, value: SimplifiedEditableSnak) {
  if (hasSpecialSnaktype(value)) return
  if (value == null) {
    throw newError('missing snak value', { property, value })
  }
  if (typeof value === 'object' && 'value' in value) {
    value = value.value
  }

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
export function validateGuid (guid: unknown): asserts guid is Guid {
  if (!isNonEmptyString(guid)) {
    throw newError('missing guid', { guid })
  }

  if (!isGuid(guid)) {
    throw newError('invalid guid', { guid })
  }
}
export function validateHash (hash: string): asserts hash is Hash {
  // Couldn't find the hash length range
  // but it looks to be somewhere around 40 characters
  if (!/^[0-9a-f]{20,80}$/.test(hash)) {
    throw newError('invalid hash', { hash })
  }
}
export function validateRank (rank: string): asserts rank is Rank {
  if (!arrayIncludes(ranks, rank)) {
    throw newError('invalid rank', { rank })
  }
}
