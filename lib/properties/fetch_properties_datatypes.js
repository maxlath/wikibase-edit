const WBK = require('wikibase-sdk')
const breq = require('bluereq')
const { forceArray } = require('../utils')
const error_ = require('../error')

module.exports = (config, propertyIds) => {
  config.properties = config.properties || {}
  const { properties, wbk } = config

  const missingPropertyIds = propertyIds.filter(notIn(properties))

  if (missingPropertyIds.length === 0) return Promise.resolve()

  const urls = wbk.getManyEntities({ ids: missingPropertyIds, props: 'info' })

  return Promise.all(urls.map(url => breq.get(url)))
  .then(mergeResponsesEntities)
  .then(entities => {
    missingPropertyIds.forEach(addMissingProperty(entities, properties))
  })
}

const notIn = object => key => object[key] == null

const mergeResponsesEntities = responses => {
  const responsesEntities = responses.map(res => res.body.entities)
  return Object.assign(...responsesEntities)
}

const addMissingProperty = (entities, properties) => propertyId => {
  const property = entities[propertyId]
  if (!property) throw error_.new('property not found', 500, { propertyId })
  properties[propertyId] = property.datatype
}
