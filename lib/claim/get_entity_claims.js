module.exports = (id, config) => {
  const { get } = require('../request/request')(config)
  const url = config.wbk.getEntities({ ids: id, props: 'claims' })
  return get(url)
  .then(res => res.entities[id].claims)
}
