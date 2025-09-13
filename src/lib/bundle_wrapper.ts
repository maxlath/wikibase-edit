import { newError } from './error.js'
import { fetchUsedPropertiesDatatypes } from './properties/fetch_used_properties_datatypes.js'
import { validateAndEnrichConfig } from './validate_and_enrich_config.js'
import type { addBadge } from './badge/add.js'
import type { removeBadge } from './badge/remove.js'
import type { createClaim } from './claim/create.js'
import type { moveClaims } from './claim/move.js'
import type { updateClaim } from './claim/update.js'
import type { moveQualifier } from './qualifier/move.js'
import type { updateQualifier } from './qualifier/update.js'
import type { GeneralConfig, RequestConfig } from './types/config.js'

type ActionFunction = typeof createClaim | typeof updateClaim | typeof moveClaims | typeof updateQualifier | typeof moveQualifier | typeof addBadge | typeof removeBadge

// Can't use API type definition, as that would trigger "TS2502 API is referenced directly or indirectly in its own type annotation"
export function bundleWrapper <Params extends object, Response extends object> (fn: ActionFunction, generalConfig: GeneralConfig, API) {
  return async function (params: Params, reqConfig?: RequestConfig): Promise<Response> {
    validateParams(params)
    const config = validateAndEnrichConfig(generalConfig, reqConfig)
    await fetchUsedPropertiesDatatypes(params, config)
    // @ts-expect-error
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
