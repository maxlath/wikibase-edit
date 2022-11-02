const getJson = require('./request/get_json')
const WBK = require('./get_instance_wikibase_sdk')
const error_ = require('./error')

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

const getEntityClaims = async (id, config) => {
  const entity = await getEntity(id, 'claims', config)
  return entity.claims
}

const getEntitySitelinks = async (id, config) => {
  const entity = await getEntity(id, 'sitelinks', config)
  return entity.sitelinks
}

module.exports = {
  getEntityClaims,
  getEntitySitelinks,
}
