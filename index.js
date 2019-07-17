const parseInstance = require('./lib/parse_instance')
const requestWrapper = require('./lib/request_wrapper')
const error_ = require('./lib/error')

module.exports = function (config, functionPath) {
  if (typeof config !== 'object') error_.new('missing config object', { config })

  const instance = parseInstance(config)
  config.wbk = require('wikibase-sdk')({ instance })

  // Oauth config will be validated by wikidata-token
  if (!config.oauth) {
    if (!config.username) error_.new('missing config parameter: username', { config })
    if (!config.password) error_.new('missing config parameter: password', { config })
  }

  return {
    label: {
      set: requestWrapper('label/set')
    },
    description: {
      set: requestWrapper('description/set')
    },
    alias: {
      set: requestWrapper('alias/set'),
      add: requestWrapper('alias/add'),
      remove: requestWrapper('alias/remove')
    },
    claim: {
      add: requestWrapper('claim/add'),
      remove: requestWrapper('claim/remove')
    },
    qualifier: {
      add: requestWrapper('qualifier/add'),
      remove: requestWrapper('qualifier/remove')
    },
    reference: {
      add: requestWrapper('reference/add'),
      remove: requestWrapper('reference/remove')
    },
    entity: {
      create: requestWrapper('entity/create'),
      edit: requestWrapper('entity/edit')
    }
  }
}
