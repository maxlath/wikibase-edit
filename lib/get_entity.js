const getJson = require('./request/get_json')
const WBK = require('./get_instance_wikibase_sdk')

const getEntity = async (id, props, config) => {
  const { instance } = config
  const url = WBK(instance).getEntities({ ids: id, props })
  const headers = { 'user-agent': config.userAgent }
  const { entities } = await getJson(url, { headers })
  return entities[id]
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
