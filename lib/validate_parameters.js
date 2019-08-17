const error_ = require('./error')

module.exports = params => {
  if (params == null) throw error_.new('missing parameters object', { params })
  if (!(params.id || params.guid || params.hash || params.labels)) {
    throw error_.new(`invalid params object`, { params })
  }
}
