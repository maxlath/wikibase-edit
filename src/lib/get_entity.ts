import { newError } from './error.js'
import WBK from './get_instance_wikibase_sdk.js'
import getJson from './request/get_json.js'
import type { SerializedConfig } from './types/config.js'
import type { EntityId, Props } from 'wikibase-sdk'

async function getEntity (id: EntityId, props: Props, config: SerializedConfig) {
  const { instance } = config
  const url = WBK(instance).getEntities({ ids: id, props })
  const headers = { 'user-agent': config.userAgent }
  const { entities } = await getJson(url, { headers })
  const entity = entities[id]
  if (!entity || entity.missing != null) {
    throw newError('entity not found', { id, props, instance: config.instance })
  }
  return entity
}

export async function getEntityClaims (id: EntityId, config: SerializedConfig) {
  const entity = await getEntity(id, 'claims', config)
  const { statementsKey } = config
  return entity[statementsKey]
}

export async function getEntitySitelinks (id: EntityId, config: SerializedConfig) {
  const entity = await getEntity(id, 'sitelinks', config)
  return entity.sitelinks
}
