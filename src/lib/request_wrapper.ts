import { newError } from './error.js'
import fetchUsedPropertiesDatatypes from './properties/fetch_used_properties_datatypes.js'
import initializeConfigAuth from './request/initialize_config_auth.js'
import post from './request/post.js'
import resolveTitle from './resolve_title.js'
import { isNonEmptyString } from './utils.js'
import { validateAndEnrichConfig } from './validate_and_enrich_config.js'
import validateParameters from './validate_parameters.js'

export function requestWrapper (fn, generalConfig) {
  return async function request (params, reqConfig) {
    const config = validateAndEnrichConfig(generalConfig, reqConfig)
    validateParameters(params)
    initializeConfigAuth(config)

    await fetchUsedPropertiesDatatypes(params, config)

    if (!config.properties) throw newError('properties not found', config)

    const { action, data } = await fn(params, config.properties, config.instance, config)

    const { summarySuffix } = config
    let summary = params.summary || config.summary
    if (summarySuffix) {
      if (summary) {
        summary = `${summary.trim()} ${summarySuffix.trim()}`
      } else {
        summary = summarySuffix
      }
      summary = summary.trim()
    }

    const baserevid = params.baserevid || config.baserevid

    if (isNonEmptyString(summary)) data.summary = summary
    if (baserevid != null) data.baserevid = baserevid

    if (!data.title) return post(action, data, config)

    const title = await resolveTitle(data.title, config.instanceApiEndpoint)
    data.title = title
    return post(action, data, config)
  }
}
