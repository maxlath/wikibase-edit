import { newError } from './error.js'
import fetchUsedPropertiesDatatypes from './properties/fetch_used_properties_datatypes.js'
import { validateAndEnrichConfig } from './validate_and_enrich_config.js'

export function bundleWrapper (fn, generalConfig, API) {
  return async function (params, reqConfig) {
    validateParams(params)
    const config = validateAndEnrichConfig(generalConfig, reqConfig)
    await fetchUsedPropertiesDatatypes(params, config)
    return fn(params, config, API)
  }
}

function validateParams (params) {
  for (const parameter in params) {
    if (!validParametersKeysSet.has(parameter)) {
      throw newError(`invalid parameter: ${parameter}`, { parameter, validParametersKeys })
    }
  }
}

const validParametersKeys = [
  'baserevid',
  'guid',
  'hash',
  'id',
  'newProperty',
  'newValue',
  'oldProperty',
  'oldValue',
  'property',
  'propertyClaimsId',
  'qualifiers',
  'rank',
  'reconciliation',
  'references',
  'summary',
  'value',
  'site',
  'badges',
]

const validParametersKeysSet = new Set(validParametersKeys)
