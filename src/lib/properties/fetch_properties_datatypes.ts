import { isPropertyId, type DataType, type PropertyId } from 'wikibase-sdk'
import { newError } from '../error.js'
import WBK from '../get_instance_wikibase_sdk.js'
import getJson from '../request/get_json.js'
import type { AbsoluteUrl } from '../types/common.js'

export type PropertiesDatatypes = Record<PropertyId, DataType>

const propertiesByInstance: Record<AbsoluteUrl, PropertiesDatatypes> = {}

export default async (config, propertyIds = []) => {
  let { instance, properties } = config

  propertyIds.forEach(propertyId => {
    if (!isPropertyId(propertyId)) throw newError('invalid property id', { propertyId })
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
  if (error) throw newError(error.info, 400, error)
  return entities
}

const addMissingProperty = (entities, properties, instance) => propertyId => {
  const property = entities[propertyId]
  if (!(property?.datatype)) throw newError('property not found', { propertyId, instance })
  properties[propertyId] = property.datatype
}
