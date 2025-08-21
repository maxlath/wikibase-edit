import { newError } from './error.js'

export default config => {
  if (!config) throw newError('missing config object')

  let { instance, wikibaseInstance } = config
  // Accept config.wikibaseInstance for legacy support
  instance = instance || wikibaseInstance

  if (!instance) throw newError('missing config parameter: instance', { config })

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
