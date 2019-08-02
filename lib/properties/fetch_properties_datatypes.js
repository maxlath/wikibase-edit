const breq = require('bluereq')
const error_ = require('../error')
const propertiesByInstance = {}

module.exports = (config, propertyIds = []) => {
  var { instance, properties, wbk } = config

  if (!properties) {
    propertiesByInstance[instance] = propertiesByInstance[instance] || {}
    config.properties = properties = propertiesByInstance[instance]
  }

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
