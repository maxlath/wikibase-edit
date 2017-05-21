module.exports = function (config) {
  // Oauth config will be validated by wikidata-token
  if (!config.oauth) {
    if (!config.username) throw new Error('missing config parameter: username')
    if (!config.password) throw new Error('missing config parameter: password')
  }

  return {
    label: {
      set: require('./lib/label/set')(config)
    },
    description: {
      set: require('./lib/description/set')(config)
    },
    claim: {
      add: require('./lib/claim/add')(config),
      exists: require('./lib/claim/exists')(config),
      remove: require('./lib/claim/remove')(config)
    },
    reference: {
      add: require('./lib/reference/add')(config)
    },
    entity: {
      create: require('./lib/entity/create')(config),
      edit: require('./lib/entity/edit')(config)
    }
  }
}
