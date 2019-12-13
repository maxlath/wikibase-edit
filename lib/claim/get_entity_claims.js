const fetch = require('cross-fetch')

module.exports = (id, config) => {
  const url = config.wbk.getEntities({ ids: id, props: 'claims' })
  const headers = { 'user-agent': config.userAgent }
  return fetch(url, { headers })
  .then(res => res.json())
  .then(res => res.entities[id].claims)
}
