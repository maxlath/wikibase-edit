import error_ from './error.js'
import WBK from './get_instance_wikibase_sdk.js'
import getJson from './request/get_json.js'

const getEntity = async (id, props, config) => {
  const { instance } = config
  const url = WBK(instance).getEntities({ ids: id, props })
  const headers = { 'user-agent': config.userAgent }
  const { entities } = await getJson(url, { headers })
  const entity = entities[id]
  if (!entity || entity.missing != null) {
    throw error_.new('entity not found', { id, props, instance: config.instance })
  }
  return entity
}

export const getEntityClaims = async (id, config) => {
  const entity = await getEntity(id, 'claims', config)
  return entity.claims
}

export const getEntitySitelinks = async (id, config) => {
  const entity = await getEntity(id, 'sitelinks', config)
  return entity.sitelinks
}
