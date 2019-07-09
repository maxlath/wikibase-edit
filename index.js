const parseInstance = require('./lib/parse_instance')
const requestWrapper = require('./lib/request_wrapper')

module.exports = function (config, functionPath) {
  if (typeof config !== 'object') throw new Error('missing config object')

  const instance = parseInstance(config)
  config.wbk = require('wikibase-sdk')({ instance })

  // Oauth config will be validated by wikidata-token
  if (!config.oauth) {
    if (!config.username) throw new Error('missing config parameter: username')
    if (!config.password) throw new Error('missing config parameter: password')
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
      // update: requestWrapper('claim/update'),
      remove: requestWrapper('claim/remove')
    },
    // qualifier: {
    //   add: requestWrapper('qualifier/add'),
    //   update: requestWrapper('qualifier/update'),
    //   remove: requestWrapper('qualifier/remove')
    // },
    // reference: {
    //   add: requestWrapper('reference/add'),
    //   remove: requestWrapper('reference/remove')
    // },
    entity: {
      create: requestWrapper('entity/create'),
      edit: requestWrapper('entity/edit')
    }
  }
}
