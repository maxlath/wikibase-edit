const _ = require('../utils')
const validate = require('../validate')
const buildClaim = require('./build_claim')

module.exports = {
  values: (name, values) => {
    const obj = {}
    Object.keys(values).forEach(lang => {
      const value = values[lang]
      validate.language(lang)
      if (name === 'alias') {
        validate.aliases(value)
        obj[lang] = value.map(alias => ({ language: lang, value: alias }))
      } else {
        validate.labelOrDescription(name, value)
        obj[lang] = { language: lang, value }
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
