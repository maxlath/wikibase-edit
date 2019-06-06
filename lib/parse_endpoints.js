module.exports = (config = {}) => {
  var { instance, wikibaseInstance, sparqlEndpoint } = config
  // Accept config.wikibaseInstance for legacy support
  instance = instance || wikibaseInstance

  if (!instance) throw new Error('missing config parameter: instance')
  if (!sparqlEndpoint) throw new Error('missing config parameter: sparqlEndpoint')

  instance = instance
    .replace(/\/$/, '')
    .replace('/w/api.php', '')

  config.instance = instance = `${instance}/w/api.php`

  return { instance, sparqlEndpoint }
}
