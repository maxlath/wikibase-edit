const getJson = require('../request/get_json')
const WBK = require('../get_instance_wikibase_sdk')

module.exports = async (id, config) => {
  const { instance } = config
  const url = WBK(instance).getEntities({ ids: id, props: 'claims' })
  const headers = { 'user-agent': config.userAgent }
  const { entities } = await getJson(url, { headers })
  return entities[id].claims
}
