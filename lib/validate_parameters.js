const error_ = require('./error')

module.exports = params => {
  if (params == null) throw error_.new('missing parameters object', { params })
  if (!(params.id || params.guid || params.hash || params.labels || (params.from && params.to))) {
    throw error_.new(`invalid params object`, { params })
  }
}
