import error_ from './error.js'

export default config => {
  if (!config) throw error_.new('missing config object')

  let { instance, wikibaseInstance } = config
  // Accept config.wikibaseInstance for legacy support
  instance = instance || wikibaseInstance

  if (!instance) throw error_.new('missing config parameter: instance', { config })

  let { wgScriptPath = 'w' } = config

  wgScriptPath = wgScriptPath.replace(/^\//, '')

  config.instance = instance
    .replace(/\/$/, '')
    .replace(`/${wgScriptPath}/api.php`, '')

  config.instanceApiEndpoint = `${config.instance}/${wgScriptPath}/api.php`
  config.statementsKey = getStatementsKey(instance)
}

export function getStatementsKey (instance) {
  return instance.includes('commons.wikimedia.org') ? 'statements' : 'claims'
}
