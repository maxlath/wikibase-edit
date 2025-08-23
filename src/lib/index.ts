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
import { createEntity, type CreateEntityParams, type CreateEntityResponse } from './entity/create.js'
import { deleteEntity, type DeleteEntityParams, type DeleteEntityResponse } from './entity/delete.js'
import { editEntity, type EditEntityParams, type EditEntityResponse } from './entity/edit.js'
import { mergeEntity, type MergeEntityParams, type MergeEntityResponse } from './entity/merge.js'
import { newError } from './error.js'
import { setLabel } from './label/set.js'
import { moveQualifier } from './qualifier/move.js'
import { removeQualifier, type RemoveQualifierParams, type RemoveQualifierResponse } from './qualifier/remove.js'
import { setQualifier, type SetQualifierParams, type SetQualifierResponse } from './qualifier/set.js'
import { updateQualifier } from './qualifier/update.js'
import { removeReference, type RemoveReferenceParams, type RemoveReferenceResponse } from './reference/remove.js'
import { setReference, type SetReferenceParams, type SetReferenceResponse } from './reference/set.js'
import { getAuthDataFactory } from './request/get_auth_data.js'
import { requestWrapper } from './request_wrapper.js'
import { setSitelink, type SetSitelinkParams, type SetSitelinkResponse } from './sitelink/set.js'
import { validateAndEnrichConfig } from './validate_and_enrich_config.js'
import type { AliasActionResponse } from './alias/action.js'
import type { GeneralConfig, RequestConfig } from './types/config.js'

/**
 * See https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#config
 */
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
      set: requestWrapper<AliasActionResponse>(setAlias, generalConfig),
      add: requestWrapper<AliasActionResponse>(addAlias, generalConfig),
      remove: requestWrapper<AliasActionResponse>(removeAlias, generalConfig),
    },
    claim: {
      set: requestWrapper(setClaim, generalConfig),
      remove: requestWrapper(removeClaim, generalConfig),
    },
    qualifier: {
      set: requestWrapper<SetQualifierParams, SetQualifierResponse>(setQualifier, generalConfig),
      remove: requestWrapper<RemoveQualifierParams, RemoveQualifierResponse>(removeQualifier, generalConfig),
    },
    reference: {
      set: requestWrapper<SetReferenceParams, SetReferenceResponse>(setReference, generalConfig),
      remove: requestWrapper<RemoveReferenceParams, RemoveReferenceResponse>(removeReference, generalConfig),
    },
    entity: {
      create: requestWrapper<CreateEntityParams, CreateEntityResponse>(createEntity, generalConfig),
      edit: requestWrapper<EditEntityParams, EditEntityResponse>(editEntity, generalConfig),
      merge: requestWrapper<MergeEntityParams, MergeEntityResponse>(mergeEntity, generalConfig),
      delete: requestWrapper<DeleteEntityParams, DeleteEntityResponse>(deleteEntity, generalConfig),
    },
    sitelink: {
      set: requestWrapper<SetSitelinkParams, SetSitelinkResponse>(setSitelink, generalConfig),
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

export type WikibaseEditAPI = ReturnType<typeof WBEdit>
