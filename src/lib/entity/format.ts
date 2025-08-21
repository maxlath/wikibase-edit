import { newError } from '../error.js'
import { isString, forceArray, isntEmpty, flatten } from '../utils.js'
import * as validate from '../validate.js'
import buildClaim from './build_claim.js'
import reconcileClaim from './reconcile_claim.js'

const formatBadgesArray = badges => {
  if (isString(badges)) {
    badges = badges.split('|')
  }
  validate.badges(badges)
  return badges
}

export const values = (name, values) => {
  const obj = {}
  Object.keys(values).forEach(lang => {
    let value = values[lang]
    validate.language(lang)
    if (name === 'alias') {
      value = forceArray(value)
      validate.aliases(value, { allowEmptyArray: true })
      obj[lang] = value.map(alias => buildLanguageValue(alias, lang))
    } else {
      validate.labelOrDescription(name, value)
      obj[lang] = buildLanguageValue(value, lang)
    }
  })
  return obj
}
export const claims = (claims, properties, instance, reconciliation, existingClaims) => {
  if (!properties) throw newError('expected properties')
  return Object.keys(claims)
  .reduce(formatClaim(claims, properties, instance, reconciliation, existingClaims), {})
}
export const sitelinks = sitelinks => {
  const obj = {}
  Object.keys(sitelinks).forEach(site => {
    validate.site(site)
    const title = sitelinks[site]
    if (title === null) {
      // Passing an empty string removes the sitelink
      obj[site] = buildSiteTitle('', site)
    } else {
      validate.siteTitle(title)
      obj[site] = buildSiteTitle(title, site)
    }
  })
  return obj
}
export const badges = formatBadgesArray

const formatClaim = (claims, properties, instance, reconciliation, existingClaims) => (obj, property) => {
  if (!properties) throw newError('expected properties')
  if (!instance) throw newError('expected instance')
  validate.property(property)
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

const buildLanguageValue = (value, language) => {
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

const buildSiteTitle = (title, site) => {
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

const validateReconciledClaims = propertyClaims => {
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
