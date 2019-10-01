const requestWrapper = require('./lib/request_wrapper')
const bundleWrapper = require('./lib/bundle_wrapper')
const error_ = require('./lib/error')
const { name, version, homepage } = require('./package.json')

module.exports = (initConfig = {}) => {
  if (!initConfig || typeof initConfig !== 'object') error_.new('missing init config object', { initConfig })

  initConfig.userAgent = initConfig.userAgent || `${name}/v${version} (${homepage})`

  // Primitives: sync functions that return an { action, params } object
  //             passed to request.post by requestWrapper
  const API = {
    label: {
      set: requestWrapper('label/set', initConfig)
    },
    description: {
      set: requestWrapper('description/set', initConfig)
    },
    alias: {
      set: requestWrapper('alias/set', initConfig),
      add: requestWrapper('alias/add', initConfig),
      remove: requestWrapper('alias/remove', initConfig)
    },
    claim: {
      create: requestWrapper('claim/create', initConfig),
      set: requestWrapper('claim/set', initConfig),
      remove: requestWrapper('claim/remove', initConfig)
    },
    qualifier: {
      set: requestWrapper('qualifier/set', initConfig),
      remove: requestWrapper('qualifier/remove', initConfig)
    },
    reference: {
      set: requestWrapper('reference/set', initConfig),
      remove: requestWrapper('reference/remove', initConfig)
    },
    entity: {
      create: requestWrapper('entity/create', initConfig),
      edit: requestWrapper('entity/edit', initConfig),
      merge: requestWrapper('entity/merge', initConfig),
      delete: requestWrapper('entity/delete', initConfig)
    }
  }

  // Legacy aliases
  API.claim.add = API.claim.create
  API.qualifier.add = API.qualifier.set

  // Bundles: async functions that make use of the primitives to offer more sophisticated behaviors
  API.claim.update = bundleWrapper('claim/update', initConfig, API)
  API.qualifier.update = bundleWrapper('qualifier/update', initConfig, API)

  return API
}
