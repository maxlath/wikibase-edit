const requestWrapper = require('./request_wrapper')
const bundleWrapper = require('./bundle_wrapper')
const GetAuthData = require('./request/get_auth_data')
const validateAndEnrichConfig = require('./validate_and_enrich_config')
const error_ = require('./error')

module.exports = (generalConfig = {}) => {
  if (!generalConfig || typeof generalConfig !== 'object') {
    throw error_.new('missing general config object', { generalConfig })
  }

  // Primitives: sync functions that return an { action, params } object
  //             passed to request.post by requestWrapper
  const API = {
    label: {
      set: requestWrapper('label/set', generalConfig)
    },
    description: {
      set: requestWrapper('description/set', generalConfig)
    },
    alias: {
      set: requestWrapper('alias/set', generalConfig),
      add: requestWrapper('alias/add', generalConfig),
      remove: requestWrapper('alias/remove', generalConfig)
    },
    claim: {
      create: requestWrapper('claim/create', generalConfig),
      set: requestWrapper('claim/set', generalConfig),
      remove: requestWrapper('claim/remove', generalConfig)
    },
    qualifier: {
      set: requestWrapper('qualifier/set', generalConfig),
      remove: requestWrapper('qualifier/remove', generalConfig)
    },
    reference: {
      set: requestWrapper('reference/set', generalConfig),
      remove: requestWrapper('reference/remove', generalConfig)
    },
    entity: {
      create: requestWrapper('entity/create', generalConfig),
      edit: requestWrapper('entity/edit', generalConfig),
      merge: requestWrapper('entity/merge', generalConfig),
      delete: requestWrapper('entity/delete', generalConfig)
    }
  }

  // Legacy aliases
  API.claim.add = API.claim.create
  API.qualifier.add = API.qualifier.set
  API.reference.add = API.reference.set

  // Bundles: async functions that make use of the primitives to offer more sophisticated behaviors
  API.claim.update = bundleWrapper('claim/update', generalConfig, API)
  API.qualifier.update = bundleWrapper('qualifier/update', generalConfig, API)

  API.getAuthData = reqConfig => {
    const config = validateAndEnrichConfig(generalConfig, reqConfig)
    return GetAuthData(config)
  }

  return API
}
