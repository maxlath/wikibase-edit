const _ = require('../utils')
const validate = require('../validate')
const findPropertyDataType = require('../properties/find_datatype')
const { entityEditBuilders: builders } = require('../claim/builders')

module.exports = {
  values: (name, values) => {
    const obj = {}
    Object.keys(values).forEach(lang => {
      const value = values[lang]
      validate.language(lang)
      validate.labelOrDescription(name, value)
      obj[lang] = { language: lang, value }
    })
    return obj
  },
  claims: claims => {
    const obj = {}
    Object.keys(claims).forEach(property => {
      validate.property(property)
      const values = _.forceArray(claims[property])
      obj[property] = obj[property] || []
      obj[property] = values.map(value => buildStatement(property, value))
    })
    return obj
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

const buildStatement = (property, value) => {
  validate.claimValue(property, value)
  const datatype = findPropertyDataType(property)
  return builders[datatype](property, value)
}
