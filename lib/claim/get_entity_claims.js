const fetch = require('../request/fetch')
const WBK = require('../get_instance_wikibase_sdk')

module.exports = async (id, config) => {
  const { instance } = config
  const url = WBK(instance).getEntities({ ids: id, props: 'claims' })
  const headers = { 'user-agent': config.userAgent }
  const { entities } = await fetch(url, { headers }).then(res => res.json())
  return entities[id].claims
}
