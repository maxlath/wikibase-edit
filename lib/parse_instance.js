const error_ = require('./error')

module.exports = (config = {}) => {
  var { instance, wikibaseInstance } = config
  // Accept config.wikibaseInstance for legacy support
  instance = instance || wikibaseInstance

  if (!instance) throw error_.new('missing config parameter: instance', { config })

  instance = instance
    .replace(/\/$/, '')
    .replace('/w/api.php', '')

  config.instance = instance = `${instance}/w/api.php`

  return instance
}
