const fetch = require('../request/fetch')

module.exports = async (id, config) => {
  const url = config.wbk.getEntities({ ids: id, props: 'claims' })
  const headers = { 'user-agent': config.userAgent }
  const { entities } = await fetch(url, { headers }).then(res => res.json())
  return entities[id].claims
}
