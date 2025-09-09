import { newError } from '../error.js'
import { editEntity, type EditEntityParams } from './edit.js'
import type { PropertiesDatatypes } from '../properties/fetch_properties_datatypes.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { SerializedConfig } from '../types/config.js'
import type { Item, Lexeme, Property } from 'wikibase-sdk'

export type CreateEntityParams = Omit<EditEntityParams, 'id'>

export async function createEntity (params: CreateEntityParams, properties: PropertiesDatatypes, instance: AbsoluteUrl, config: SerializedConfig) {
  if ('id' in params && params.id) {
    throw newError("a new entity can't already have an id", { id: params.id })
  }
  // @ts-expect-error
  return editEntity({ create: true, ...params }, properties, instance, config)
}

export interface CreateEntityResponse {
  // Leaving MediaInfo aside to not have to deal with claims/statements inconsistencies
  // (see https://phabricator.wikimedia.org/T149410) but it should still work for MediaInfo
  entity: Item | Property | Lexeme
  success: 1
}
