import { newError } from './error.js'
import fetchUsedPropertiesDatatypes from './properties/fetch_used_properties_datatypes.js'
import { initializeConfigAuth } from './request/initialize_config_auth.js'
import { post } from './request/post.js'
import { resolveTitle } from './resolve_title.js'
import { isNonEmptyString } from './utils.js'
import { validateAndEnrichConfig } from './validate_and_enrich_config.js'
import validateParameters from './validate_parameters.js'
import type { addAlias } from './alias/add.js'
import type { removeAlias } from './alias/remove.js'
import type { setAlias } from './alias/set.js'
import type { removeClaim } from './claim/remove.js'
import type { setClaim } from './claim/set.js'
import type { setDescription } from './description/set.js'
import type { createEntity } from './entity/create.js'
import type { deleteEntity } from './entity/delete.js'
import type { _rawEditEntity, editEntity } from './entity/edit.js'
import type { mergeEntity } from './entity/merge.js'
import type { setLabel } from './label/set.js'
import type { removeQualifier } from './qualifier/remove.js'
import type { setQualifier } from './qualifier/set.js'
import type { removeReference } from './reference/remove.js'
import type { setReference } from './reference/set.js'
import type { setSitelink } from './sitelink/set.js'
import type { BaseRevId } from './types/common.js'
import type { GeneralConfig, RequestConfig, SerializedConfig } from './types/config.js'

type ActionFunction = typeof addAlias | typeof removeAlias | typeof setAlias | typeof removeClaim | typeof setClaim | typeof setDescription | typeof createEntity | typeof deleteEntity | typeof editEntity | typeof mergeEntity | typeof setLabel | typeof removeQualifier | typeof setQualifier | typeof removeReference | typeof setReference | typeof setSitelink | typeof _rawEditEntity

// Params could be captured with Parameters<ActionFunction>[0], but the resulting typing isn't great
export function requestWrapper <Params extends object, Response extends object, F extends ActionFunction = ActionFunction> (actionFn: F, generalConfig: GeneralConfig) {
  return async function request (params: Params, reqConfig?: RequestConfig) {
    const config = validateAndEnrichConfig(generalConfig, reqConfig)
    validateParameters(params)
    initializeConfigAuth(config)

    await fetchUsedPropertiesDatatypes(params, config)

    if (!config.properties) throw newError('properties not found', config)

    const { action, data } = await actionFn(params, config.properties, config.instance, config)

    const { summarySuffix } = config
    let summary = 'summary' in params ? params.summary : config.summary
    if (summarySuffix) {
      if (typeof summary === 'string') {
        summary = `${summary.trim()} ${summarySuffix.trim()}`
      } else {
        summary = summarySuffix
      }
    }

    const baserevid = 'baserevid' in params ? params.baserevid : config.baserevid

    const extraData: Partial<Pick<SerializedConfig, 'summary' | 'baserevid'>> = {}

    if (isNonEmptyString(summary)) {
      extraData.summary = summary.trim()
    }

    if (baserevid != null) extraData.baserevid = baserevid as BaseRevId

    if ('title' in data) {
      const title = await resolveTitle(data.title, config.instanceApiEndpoint)
      return post(action, { ...data, ...extraData, title }, config) as Response
    } else {
      return post(action, { ...data, ...extraData }, config) as Response
    }
  }
}
