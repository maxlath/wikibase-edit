const wdk = require('wikidata-sdk')

module.exports = (config, id) => {
  const { get } = require('../request')(config)
  const url = wdk.getEntities({ ids: id, props: 'claims' })
  return get(url)
  .then(res => res.entities[id].claims)
}
