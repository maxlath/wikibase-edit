const parseInstance = require('./lib/parse_instance')
const requestWrapper = require('./lib/request_wrapper')
const error_ = require('./lib/error')
const { name, version, homepage } = require('./package.json')

module.exports = (initConfig = {}) => {
  if (!initConfig || typeof initConfig !== 'object') error_.new('missing init config object', { initConfig })

  initConfig.userAgent = initConfig.userAgent || `${name}/v${version} (${homepage})`

  return {
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
      add: requestWrapper('claim/add', initConfig),
      set: requestWrapper('claim/set', initConfig),
      remove: requestWrapper('claim/remove', initConfig)
    },
    qualifier: {
      add: requestWrapper('qualifier/add', initConfig),
      remove: requestWrapper('qualifier/remove', initConfig)
    },
    reference: {
      add: requestWrapper('reference/add', initConfig),
      remove: requestWrapper('reference/remove', initConfig)
    },
    entity: {
      create: requestWrapper('entity/create', initConfig),
      edit: requestWrapper('entity/edit', initConfig)
    }
  }
}
