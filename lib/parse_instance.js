const error_ = require('./error')

module.exports = config => {
  if (!config) throw error_.new('missing config object')

  // The config has arealdy been parsed
  if (config._instanceRoot != null) return

  var { instance, wikibaseInstance } = config
  // Accept config.wikibaseInstance for legacy support
  instance = instance || wikibaseInstance

  if (!instance) throw error_.new('missing config parameter: instance', { config })

  const instanceRoot = instance
    .replace(/\/$/, '')
    .replace('/w/api.php', '')

  config.instance = `${instanceRoot}/w/api.php`
  config._instanceRoot = instanceRoot
}
