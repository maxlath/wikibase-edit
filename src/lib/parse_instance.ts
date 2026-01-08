import { getStatementsKey } from 'wikibase-sdk'
import { newError } from './error.js'
import type { AbsoluteUrl } from './types/common.js'
import type { RequestConfig } from './types/config.js'

export function parseInstance (config: RequestConfig) {
  if (!config) throw newError('missing config object')

  let { instance, wikibaseInstance } = config
  // Accept config.wikibaseInstance for legacy support
  instance = instance || wikibaseInstance

  if (!instance) throw newError('missing config parameter: instance', { config })

  let { wgScriptPath = 'w' } = config

  wgScriptPath = wgScriptPath.replace(/^\//, '')

  config.instance = instance
    .replace(/\/$/, '')
    .replace(`/${wgScriptPath}/api.php`, '') as AbsoluteUrl

  // @ts-expect-error preparing SerializedConfig
  config.instanceApiEndpoint = `${config.instance}/${wgScriptPath}/api.php` as AbsoluteUrl
  // @ts-expect-error preparing SerializedConfig
  config.statementsKey = getStatementsKey(instance)
}
