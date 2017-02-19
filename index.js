module.exports = function (config) {
  if (!config.username) throw new Error('missing config parameter: username')
  if (!config.password) throw new Error('missing config parameter: password')

  return {
    claim: {
      exists: require('./lib/claim/exists')(config)
    }
  }
}
