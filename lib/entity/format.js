const _ = require('../utils')
const validate = require('../validate')
const buildClaim = require('./build_claim')
const { forceArray } = require('../utils')

module.exports = {
  values: (name, values) => {
    const obj = {}
    Object.keys(values).forEach(lang => {
      let value = values[lang]
      validate.language(lang)
      if (name === 'alias') {
        value = forceArray(value)
        validate.aliases(value)
        obj[lang] = value.map(alias => buildLanguageValue(alias, lang))
      } else {
        validate.labelOrDescription(name, value)
        obj[lang] = buildLanguageValue(value, lang)
      }
    })
    return obj
  },
  claims: claims => {
    return Object.keys(claims).reduce(formatClaim(claims), {})
  },
  sitelinks: sitelinks => {
    const obj = {}
    Object.keys(sitelinks).forEach(site => {
      var title = sitelinks[site]
      validate.site(site)
      validate.siteTitle(title)
      obj[site] = buildSiteTitle(title, site)
    })
    return obj
  }
}

const formatClaim = claims => (obj, property) => {
  validate.property(property)
  const values = _.forceArray(claims[property])
  obj[property] = obj[property] || []
  obj[property] = values.map(value => buildClaim(property, value))
  return obj
}

const buildLanguageValue = (value, language) => {
  // Re-building an object to avoid passing any undesired key/value
  const valueObj = { language }
  if (_.isString(value)) {
    valueObj.value = value
  } else {
    valueObj.value = value.value || value.title
    if (value.remove === true) valueObj.remove = true
  }
  return valueObj
}

const buildSiteTitle = (title, site) => {
  // Re-building an object to avoid passing any undesired key/value
  const valueObj = { site }
  if (_.isString(title)) {
    valueObj.title = title
  } else {
    valueObj.title = title.title || title.value
    if (title.remove === true) valueObj.remove = true
  }
  return valueObj
}
