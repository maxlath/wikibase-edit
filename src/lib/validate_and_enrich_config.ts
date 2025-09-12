import { name, version, homepage } from '../assets/metadata.js'
import { newError } from './error.js'
import parseInstance from './parse_instance.js'
import { forceArray } from './utils.js'
import type { GeneralConfig, RequestConfig, SerializedConfig } from './types/config.js'

export function validateAndEnrichConfig (generalConfig: GeneralConfig, requestConfig?: RequestConfig): SerializedConfig {
  generalConfig.userAgent = generalConfig.userAgent || `${name}/v${version} (${homepage})`

  let config
  if (requestConfig) {
    config = Object.assign({}, generalConfig, requestConfig)
  } else {
    config = generalConfig
    if (config._validatedAndEnriched) return config
  }

  parseInstance(config)
  if (config.instance == null) throw newError('invalid config object', { config })

  config.anonymous = config.anonymous === true

  if (!config.credentials && !config.anonymous) throw newError('missing credentials', { config })

  if (config.credentials) {
    if (!config.credentials.oauth && !config.credentials.browserSession && (!config.credentials.username || !config.credentials.password)) {
      throw newError('missing credentials')
    }

    if (config.credentials.oauth && (config.credentials.username || config.credentials.password)) {
      throw newError('credentials can not be both oauth tokens, and a username and password')
    }

    // Making sure that the 'bot' flag was explicitly set to true
    config.bot = config.bot === true
  }

  let { summary, tags, baserevid } = config

  if (summary != null) checkType('summary', summary, 'string')

  // on wikidata.org: set tag to wikibase-edit by default
  if (config.instance === 'https://www.wikidata.org') {
    tags = tags || 'WikibaseJS-edit'
  }

  if (tags != null) {
    tags = forceArray(tags)
    tags.forEach(tag => checkType('tags', tag, 'string'))
    config.tags = tags
  }

  if (baserevid != null) checkType('baserevid', baserevid, 'number')

  config._validatedAndEnriched = true

  return config
}

function checkType (name: string, value: string | number, type: 'string' | 'number') {
  if (typeof value !== type) {
    throw newError(`invalid config ${name}`, { [name]: value, type: typeof value })
  }
}
