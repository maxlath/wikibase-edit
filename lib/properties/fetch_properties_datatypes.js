const getJson = require('../request/get_json')
const error_ = require('../error')
const WBK = require('../get_instance_wikibase_sdk')
const { isPropertyId } = require('wikibase-sdk')

const propertiesByInstance = {}

module.exports = async (config, propertyIds = []) => {
  let { instance, properties } = config

  propertyIds.forEach(propertyId => {
    if (!isPropertyId(propertyId)) throw error_.new('invalid property id', { propertyId })
  })

  if (!properties) {
    propertiesByInstance[instance] = propertiesByInstance[instance] || {}
    config.properties = properties = propertiesByInstance[instance]
  }

  const missingPropertyIds = propertyIds.filter(notIn(properties))

  if (missingPropertyIds.length === 0) return

  const urls = WBK(instance).getManyEntities({ ids: missingPropertyIds, props: 'info' })

  const responses = await Promise.all(urls.map(getJson))
  const responsesEntities = responses.map(parseResponse)
  const allEntities = Object.assign(...responsesEntities)
  missingPropertyIds.forEach(addMissingProperty(allEntities, properties, instance))
}

const notIn = object => key => object[key] == null

const parseResponse = ({ entities, error }) => {
  if (error) throw error_.new(error.info, 400, error)
  return entities
}

const addMissingProperty = (entities, properties, instance) => propertyId => {
  const property = entities[propertyId]
  if (!(property && property.datatype)) throw error_.new('property not found', { propertyId, instance })
  properties[propertyId] = property.datatype
}
