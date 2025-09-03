import { newError } from '../error.js'
import { isString, forceArray, isntEmpty, flatten, objectKeys } from '../utils.js'
import { validateAliases, validateBadges, validateLabelOrDescription, validateLanguage, validateProperty, validateSite, validateSiteTitle } from '../validate.js'
import { buildClaim } from './build_claim.js'
import { reconcileClaimFactory } from './reconcile_claim.js'
import type { Reconciliation } from './validate_reconciliation_object.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { CustomSimplifiedClaim, PropertyId, SimplifiedClaim, SimplifiedClaims, SimplifiedPropertyClaims, SimplifiedSitelinks, SimplifiedTerm, Sitelink, SitelinkBadges, SitelinkTitle, Term, WikimediaLanguageCode } from 'wikibase-sdk'

type CustomSimplifiedClaims = Record<PropertyId, SimplifiedPropertyClaims | SimplifiedClaim | CustomSimplifiedClaim[] | CustomSimplifiedClaim>

function formatBadgesArray (badges: SitelinkBadges | string) {
  let badgeArray: SitelinkBadges
  if (isString(badges)) {
    badgeArray = badges.split('|') as SitelinkBadges
  } else {
    badgeArray = badges
  }
  validateBadges(badgeArray)
  return badgeArray
}

export function formatValues (name: string, values: string | string) {
  const obj = {}
  objectKeys(values).forEach(lang => {
    let value = values[lang]
    validateLanguage(lang)
    if (name === 'alias') {
      value = forceArray(value)
      validateAliases(value, { allowEmptyArray: true })
      obj[lang] = value.map(alias => buildLanguageValue(alias, lang))
    } else {
      validateLabelOrDescription(name, value)
      obj[lang] = buildLanguageValue(value, lang)
    }
  })
  return obj
}

export function formatClaims (claims: CustomSimplifiedClaims, properties: PropertiesDatatypes, instance: AbsoluteUrl, reconciliation: Reconciliation, existingClaims: SimplifiedClaims) {
  if (!properties) throw newError('expected properties')
  return objectKeys(claims)
  .reduce(formatClaimFactory(claims, properties, instance, reconciliation, existingClaims), {})
}

export function formatSitelinks (sitelinks: SimplifiedSitelinks) {
  const obj = {}
  objectKeys(sitelinks).forEach(site => {
    validateSite(site)
    const title = sitelinks[site]
    if (title === null) {
      // Passing an empty string removes the sitelink
      obj[site] = buildSiteTitle('', site)
    } else {
      validateSiteTitle(title)
      obj[site] = buildSiteTitle(title, site)
    }
  })
  return obj
}
export const formatBadges = formatBadgesArray

function formatClaimFactory (claims: CustomSimplifiedClaims, properties: PropertiesDatatypes, instance: AbsoluteUrl, reconciliation: Reconciliation, existingClaims: SimplifiedClaims) {
  return function formatClaim (obj, property) {
    if (!properties) throw newError('expected properties')
    if (!instance) throw newError('expected instance')
    validateProperty(property)
    const values = forceArray(claims[property])
    obj[property] = obj[property] || []
    obj[property] = values.map(value => buildClaim(property, properties, value, instance))
    if (existingClaims?.[property] != null) {
      obj[property] = obj[property]
      .map(reconcileClaimFactory(reconciliation, existingClaims[property]))
      .filter(isntEmpty)
      obj[property] = flatten(obj[property])
      validateReconciledClaims(obj[property])
    }
    return obj
  }
}

interface EditedTerm {
  language: WikimediaLanguageCode
  value: string
  add?: boolean | string
  remove?: boolean
}

function buildLanguageValue (value: SimplifiedTerm | Term, language) {
  // Re-building an object to avoid passing any undesired key/value
  const valueObj: Partial<EditedTerm> = { language }
  if (isString(value)) {
    valueObj.value = value
  } else if (value === null) {
    valueObj.remove = true
  } else {
    valueObj.value = value.value
    if ('remove' in value && value.remove === true) valueObj.remove = true
    if ('add' in value && value.add != null) valueObj.add = ''
  }
  return valueObj as EditedTerm
}

interface EditedSitelink {
  // Not using Wikimedia Site type to accept non-Wikimedia sitelinks
  site: string
  title: SitelinkTitle
  badges: SitelinkBadges
  url?: AbsoluteUrl
  remove?: boolean
}

function buildSiteTitle (title: SitelinkTitle | Sitelink, site: string) {
  // Re-building an object to avoid passing any undesired key/value
  const valueObj: Partial<EditedSitelink> = { site }
  if (isString(title)) {
    valueObj.title = title
  } else {
    valueObj.title = title.title
    if (title.badges) {
      valueObj.badges = formatBadgesArray(title.badges)
    }
    if ('remove' in title && title.remove === true) valueObj.remove = true
  }
  return valueObj
}

function validateReconciledClaims (propertyClaims: SimplifiedClaim[] | CustomSimplifiedClaim[]) {
  const claimsByGuid = {}
  for (const claim of propertyClaims) {
    if (typeof claim === 'object' && 'id' in claim) {
      const { id } = claim
      if (id) {
        if (claimsByGuid[id] != null) {
          throw newError('can not match several times the same claim', { claim })
        } else {
          claimsByGuid[id] = claim
        }
      }
    }
  }
}
