import { merge } from 'lodash-es'
import { addAlias } from './alias/add.js'
import { removeAlias } from './alias/remove.js'
import { setAlias } from './alias/set.js'
import { addBadge } from './badge/add.js'
import { removeBadge } from './badge/remove.js'
import { bundleWrapper } from './bundle_wrapper.js'
import { createClaim } from './claim/create.js'
import { moveClaim } from './claim/move.js'
import { removeClaim } from './claim/remove.js'
import { setClaim } from './claim/set.js'
import { updateClaim } from './claim/update.js'
import { setDescription } from './description/set.js'
import { createEntity } from './entity/create.js'
import { deleteEntity } from './entity/delete.js'
import { editEntity } from './entity/edit.js'
import { mergeEntity } from './entity/merge.js'
import { newError } from './error.js'
import { setLabel } from './label/set.js'
import { moveQualifier } from './qualifier/move.js'
import { removeQualifier } from './qualifier/remove.js'
import { setQualifier } from './qualifier/set.js'
import { updateQualifier } from './qualifier/update.js'
import { removeReference } from './reference/remove.js'
import { setReference } from './reference/set.js'
import { getAuthDataFactory } from './request/get_auth_data.js'
import { requestWrapper } from './request_wrapper.js'
import { setSitelink } from './sitelink/set.js'
import { validateAndEnrichConfig } from './validate_and_enrich_config.js'
import type { GeneralConfig, RequestConfig } from './types/config.js'

export default function WBEdit (generalConfig: GeneralConfig) {
  if (typeof generalConfig !== 'object') {
    throw newError('invalid general config object', { generalConfig, type: typeof generalConfig })
  }

  // Primitives: sync or async functions that return an { action, params } object
  //             passed to request.post by requestWrapper
  const primaryAPI = {
    label: {
      set: requestWrapper(setLabel, generalConfig),
    },
    description: {
      set: requestWrapper(setDescription, generalConfig),
    },
    alias: {
      set: requestWrapper(setAlias, generalConfig),
      add: requestWrapper(addAlias, generalConfig),
      remove: requestWrapper(removeAlias, generalConfig),
    },
    claim: {
      set: requestWrapper(setClaim, generalConfig),
      remove: requestWrapper(removeClaim, generalConfig),
    },
    qualifier: {
      set: requestWrapper(setQualifier, generalConfig),
      remove: requestWrapper(removeQualifier, generalConfig),
    },
    reference: {
      set: requestWrapper(setReference, generalConfig),
      remove: requestWrapper(removeReference, generalConfig),
    },
    entity: {
      create: requestWrapper(createEntity, generalConfig),
      edit: requestWrapper(editEntity, generalConfig),
      merge: requestWrapper(mergeEntity, generalConfig),
      delete: requestWrapper(deleteEntity, generalConfig),
    },
    sitelink: {
      set: requestWrapper(setSitelink, generalConfig),
    },
    badge: {},
  } as const

  // Bundles: async functions that make use of the primitives to offer more sophisticated behaviors
  const secondaryAPI = {
    claim: {
      create: bundleWrapper(createClaim, generalConfig, primaryAPI),
      update: bundleWrapper(updateClaim, generalConfig, primaryAPI),
      move: bundleWrapper(moveClaim, generalConfig, primaryAPI),
    },
    qualifier: {
      update: bundleWrapper(updateQualifier, generalConfig, primaryAPI),
      move: bundleWrapper(moveQualifier, generalConfig, primaryAPI),
    },
    badge: {
      add: bundleWrapper(addBadge, generalConfig, primaryAPI),
      remove: bundleWrapper(removeBadge, generalConfig, primaryAPI),
    },
  } as const

  return {
    ...merge(primaryAPI, secondaryAPI),

    getAuthData (reqConfig: RequestConfig) {
      const config = validateAndEnrichConfig(generalConfig, reqConfig)
      return getAuthDataFactory(config)
    },
  }
}
