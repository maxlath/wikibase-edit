module.exports = function (config, functionPath) {
  if (typeof config !== 'object') throw new Error('missing config object')

  // Oauth config will be validated by wikidata-token
  if (!config.oauth) {
    if (!config.username) throw new Error('missing config parameter: username')
    if (!config.password) throw new Error('missing config parameter: password')
  }

  if (typeof functionPath === 'string') {
    return require(`./lib/${functionPath}`)(config)
  } else {
    return {
      label: {
        set: require('./lib/label/set')(config)
      },
      alias: {
        set: require('./lib/alias/set')(config),
        add: require('./lib/alias/add')(config),
        remove: require('./lib/alias/remove')(config)
      },
      description: {
        set: require('./lib/description/set')(config)
      },
      claim: {
        add: require('./lib/claim/add')(config),
        exists: require('./lib/claim/exists')(config),
        update: require('./lib/claim/update')(config),
        remove: require('./lib/claim/remove')(config)
      },
      qualifier: {
        add: require('./lib/qualifier/add')(config),
        update: require('./lib/qualifier/update')(config)
      },
      reference: {
        add: require('./lib/reference/add')(config),
        remove: require('./lib/reference/remove')(config)
      },
      entity: {
        create: require('./lib/entity/create')(config),
        edit: require('./lib/entity/edit')(config)
      }
    }
  }
}
