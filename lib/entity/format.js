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
        obj[lang] = value.map(alias => buildValue(alias, lang))
      } else {
        validate.labelOrDescription(name, value)
        obj[lang] = buildValue(value, lang)
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
      const title = sitelinks[site]
      validate.site(site)
      validate.siteTitle(title)
      obj[site] = { site, title }
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

const buildValue = (value, language) => {
  // If the value is already an object value, simply complete it
  if (value.value != null) {
    value.language = language
    return value
  } else {
    return { language, value }
  }
}
