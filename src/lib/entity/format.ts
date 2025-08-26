import { newError } from '../error.js'
import { isString, forceArray, isntEmpty, flatten } from '../utils.js'
import { validateAliases, validateBadges, validateLabelOrDescription, validateLanguage, validateProperty, validateSite, validateSiteTitle } from '../validate.js'
import buildClaim from './build_claim.js'
import reconcileClaim from './reconcile_claim.js'
import type { SitelinkBadges } from 'wikibase-sdk'

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
  Object.keys(values).forEach(lang => {
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

export function formatClaims (claims, properties, instance, reconciliation, existingClaims) {
  if (!properties) throw newError('expected properties')
  return Object.keys(claims)
  .reduce(formatClaimFactory(claims, properties, instance, reconciliation, existingClaims), {})
}

export function formatSitelinks (sitelinks) {
  const obj = {}
  Object.keys(sitelinks).forEach(site => {
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

function formatClaimFactory (claims, properties, instance, reconciliation, existingClaims) {
  return function formatClaim (obj, property) {
    if (!properties) throw newError('expected properties')
    if (!instance) throw newError('expected instance')
    validateProperty(property)
    const values = forceArray(claims[property])
    obj[property] = obj[property] || []
    obj[property] = values.map(value => buildClaim(property, properties, value, instance))
    if (existingClaims?.[property] != null) {
      obj[property] = obj[property]
      .map(reconcileClaim(reconciliation, existingClaims[property]))
      .filter(isntEmpty)
      obj[property] = flatten(obj[property])
      validateReconciledClaims(obj[property])
    }
    return obj
  }
}

function buildLanguageValue (value, language) {
  // Re-building an object to avoid passing any undesired key/value
  const valueObj = { language }
  if (isString(value)) {
    valueObj.value = value
  } else if (value === null) {
    valueObj.remove = true
  } else {
    valueObj.value = value.value || value.title
    if (value.remove === true) valueObj.remove = true
    if (value.add != null) valueObj.add = ''
  }
  return valueObj
}

function buildSiteTitle (title, site) {
  // Re-building an object to avoid passing any undesired key/value
  const valueObj = { site }
  if (isString(title)) {
    valueObj.title = title
  } else {
    valueObj.title = title.title || title.value
    if (title.badges) {
      valueObj.badges = formatBadgesArray(title.badges)
    }
    if (title.remove === true) valueObj.remove = true
  }
  return valueObj
}

function validateReconciledClaims (propertyClaims) {
  const claimsByGuid = {}
  for (const claim of propertyClaims) {
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
