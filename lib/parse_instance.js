const error_ = require('./error')

module.exports = config => {
  if (!config) throw error_.new('missing config object')

  let { instance, wikibaseInstance } = config
  // Accept config.wikibaseInstance for legacy support
  instance = instance || wikibaseInstance

  if (!instance) throw error_.new('missing config parameter: instance', { config })

  config.instance = instance
    .replace(/\/$/, '')
    .replace('/w/api.php', '')

  config.instanceApiEndpoint = `${config.instance}/w/api.php`
}
