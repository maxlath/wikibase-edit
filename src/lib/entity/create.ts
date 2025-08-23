import { newError } from '../error.js'
import { editEntity } from './edit.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'
import type { DataType, Entity, EntityType, SimplifiedAliases, SimplifiedClaims, SimplifiedDescriptions, SimplifiedLabels, SimplifiedSitelinks } from 'wikibase-sdk'

export interface CreateEntityParams {
  type: EntityType
  datatype?: DataType
  labels?: SimplifiedLabels
  descriptions?: SimplifiedDescriptions
  aliases?: SimplifiedAliases
  claims?: SimplifiedClaims
  statements?: SimplifiedClaims
  sitelinks?: SimplifiedSitelinks
}

export async function createEntity (params: CreateEntityParams, properties: PropertiesDatatypes, instance: AbsoluteUrl, config: SerializedConfig) {
  if ('id' in params && params.id) {
    throw newError("a new entity can't already have an id", { id: params.id })
  }
  return editEntity({ create: true, ...params }, properties, instance, config)
}

export interface CreateEntityResponse {
  entity: Entity
  success: 1
}
