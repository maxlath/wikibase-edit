const wdk = require('wikidata-sdk')
const error_ = require('../error')
const _ = require('../utils')
const findPropertyDataType = require('../properties/find_datatype')
const { entityEditBuilders: builders } = require('../claim/builders')
const validate = require('../validate')

module.exports = data => {
  return new Promise((resolve, reject) => {
    try {
      const params = validateAndFormatData(data)
      resolve(params)
    } catch (err) {
      reject(err)
    }
  })
}

const validateAndFormatData = data => {
  const params = {}
  const { id, labels, aliases, descriptions, claims, summary } = data

  if (id === 'create') {
    params['new'] = 'item'
  } else if (wdk.isEntityId(id)) {
    params.id = id
  } else {
    throw error_.new('invalid entity id', 400, id)
  }

  if (_.isNonEmptyString(summary)) params.summary = summary

  params.data = {}
  if (labels) {
    params.data.labels = formatValues('label', labels)
  }
  if (aliases) {
    params.data.aliases = formatValues('alias', aliases)
  }
  if (descriptions) {
    params.data.descriptions = formatValues('description', descriptions)
  }
  if (claims) {
    params.data.claims = formatClaims(claims)
  }

  if (Object.keys(params.data).length === 0) {
    throw error_.new('no data was passed', 400, id)
  }

  // stringify as it will be passed as form data
  params.data = JSON.stringify(params.data)

  return params
}

const formatValues = (name, values) => {
  const obj = {}
  Object.keys(values).forEach(lang => {
    const value = values[lang]
    validate.language(lang)
    validate.labelOrDescription(name, value)
    obj[lang] = {
      language: lang,
      value: value
    }
  })
  return obj
}

const formatClaims = claims => {
  const obj = {}
  Object.keys(claims).forEach(property => {
    validate.property(property)
    const values = _.forceArray(claims[property])
    obj[property] = obj[property] || []
    obj[property] = values.map(value => buildStatement(property, value))
  })
  return obj
}

const buildStatement = (property, value) => {
  validate.claimValue(property, value)
  const datatype = findPropertyDataType(property)
  return builders[datatype](property, value)
}
