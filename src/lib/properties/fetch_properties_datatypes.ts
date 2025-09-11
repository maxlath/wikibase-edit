import { isPropertyId } from 'wikibase-sdk'
import error_ from '../error.js'
import WBK from '../get_instance_wikibase_sdk.js'
import getJson from '../request/get_json.js'

const propertiesByInstance = {}

export default async (config, propertyIds = []) => {
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

  const headers = { 'user-agent': config.userAgent }
  const responses = await Promise.all(urls.map(url => getJson(url, { headers })))
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
