import { newError } from './error.js'

export default params => {
  if (params == null) {
    const err = newError('missing parameters object', { params })
    // Expected by wikibase-cli
    err.code = 'EMPTY_PARAMS'
    throw err
  }

  if (!(params.id || params.guid || params.hash || params.labels || (params.from && params.to))) {
    throw newError('invalid params object', { params })
  }
}
