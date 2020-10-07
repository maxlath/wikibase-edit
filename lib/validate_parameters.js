const error_ = require('./error')

module.exports = params => {
  if (params == null) {
    const err = error_.new('missing parameters object', { params })
    // Expected by wikibase-cli
    err.code = 'EMPTY_PARAMS'
    throw err
  }

  if (!(params.id || params.guid || params.hash || params.labels || (params.from && params.to))) {
    throw error_.new('invalid params object', { params })
  }
}
