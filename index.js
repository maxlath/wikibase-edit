const parseInstance = require('./lib/parse_instance')
const requestWrapper = require('./lib/request_wrapper')
const error_ = require('./lib/error')
const { name, version, homepage } = require('./package.json')

module.exports = (config = {}) => {
  if (!config || typeof config !== 'object') error_.new('missing config object', { config })

  config.userAgent = config.userAgent || `${name}/v${version} (${homepage})`

  return {
    label: {
      set: requestWrapper('label/set', config)
    },
    description: {
      set: requestWrapper('description/set', config)
    },
    alias: {
      set: requestWrapper('alias/set', config),
      add: requestWrapper('alias/add', config),
      remove: requestWrapper('alias/remove', config)
    },
    claim: {
      add: requestWrapper('claim/add', config),
      set: requestWrapper('claim/set', config),
      remove: requestWrapper('claim/remove', config)
    },
    qualifier: {
      add: requestWrapper('qualifier/add', config),
      remove: requestWrapper('qualifier/remove', config)
    },
    reference: {
      add: requestWrapper('reference/add', config),
      remove: requestWrapper('reference/remove', config)
    },
    entity: {
      create: requestWrapper('entity/create', config),
      edit: requestWrapper('entity/edit', config)
    }
  }
}
