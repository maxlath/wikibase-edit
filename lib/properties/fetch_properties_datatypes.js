const fetch = require('cross-fetch')
const error_ = require('../error')
const propertiesByInstance = {}

module.exports = (config, propertyIds = []) => {
  var { instance, properties, wbk } = config

  propertyIds.forEach(propertyId => {
    if (!wbk.isPropertyId(propertyId)) throw error_.new('invalid property id', { propertyId })
  })

  if (!properties) {
    propertiesByInstance[instance] = propertiesByInstance[instance] || {}
    config.properties = properties = propertiesByInstance[instance]
  }

  const missingPropertyIds = propertyIds.filter(notIn(properties))

  if (missingPropertyIds.length === 0) return Promise.resolve()

  const urls = wbk.getManyEntities({ ids: missingPropertyIds, props: 'info' })

  return Promise.all(urls.map(getJson))
  .then(mergeResponsesEntities)
  .then(entities => {
    missingPropertyIds.forEach(addMissingProperty(entities, properties))
  })
}

const getJson = url => fetch(url).then(res => res.json())

const notIn = object => key => object[key] == null

const mergeResponsesEntities = responses => {
  const responsesEntities = responses.map(res => res.entities)
  return Object.assign(...responsesEntities)
}

const addMissingProperty = (entities, properties) => propertyId => {
  const property = entities[propertyId]
  if (!(property && property.datatype)) throw error_.new('property not found', { propertyId })
  properties[propertyId] = property.datatype
}
