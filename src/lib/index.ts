import { merge } from 'lodash-es'
import { addAlias } from './alias/add.js'
import { removeAlias } from './alias/remove.js'
import { setAlias } from './alias/set.js'
import { addBadge, type AddBadgeParams, type AddBadgeResponse } from './badge/add.js'
import { removeBadge, type RemoveBadgeParams, type RemoveBadgeResponse } from './badge/remove.js'
import { bundleWrapper } from './bundle_wrapper.js'
import { createClaim, type CreateClaimParams, type CreateClaimResponse } from './claim/create.js'
import { moveClaims, type MoveClaimParams, type MoveClaimResponse } from './claim/move.js'
import { removeClaim, type RemoveClaimParams, type RemoveClaimResponse } from './claim/remove.js'
import { setClaim, type SetClaimParams, type SetClaimResponse } from './claim/set.js'
import { updateClaim, type UpdateClaimParams, type UpdateClaimResponse } from './claim/update.js'
import { setDescription } from './description/set.js'
import { createEntity, type CreateEntityParams, type CreateEntityResponse } from './entity/create.js'
import { deleteEntity, type DeleteEntityParams, type DeleteEntityResponse } from './entity/delete.js'
import { editEntity, type EditEntityParams, type EditEntityResponse } from './entity/edit.js'
import { mergeEntity, type MergeEntityParams, type MergeEntityResponse } from './entity/merge.js'
import { newError } from './error.js'
import { setLabel } from './label/set.js'
import { moveQualifier, type MoveQualifierParams, type MoveQualifierResponse } from './qualifier/move.js'
import { removeQualifier, type RemoveQualifierParams, type RemoveQualifierResponse } from './qualifier/remove.js'
import { setQualifier, type SetQualifierParams, type SetQualifierResponse } from './qualifier/set.js'
import { updateQualifier, type UpdateQualifierParams, type UpdateQualifierResponse } from './qualifier/update.js'
import { removeReference, type RemoveReferenceParams, type RemoveReferenceResponse } from './reference/remove.js'
import { setReference, type SetReferenceParams, type SetReferenceResponse } from './reference/set.js'
import { getAuthDataFactory } from './request/get_auth_data.js'
import { requestWrapper } from './request_wrapper.js'
import { setSitelink, type SetSitelinkParams, type SetSitelinkResponse } from './sitelink/set.js'
import { validateAndEnrichConfig } from './validate_and_enrich_config.js'
import type { AliasActionParams, AliasActionResponse } from './alias/action.js'
import type { TermActionParams, TermActionResponse } from './label_or_description/set.js'
import type { GeneralConfig, RequestConfig } from './types/config.js'

/**
 * See https://github.com/maxlath/wikibase-edit/blob/main/docs/how_to.md#config
 */
export default function WBEdit (generalConfig: GeneralConfig = {}) {
  if (typeof generalConfig !== 'object') {
    throw newError('invalid general config object', { generalConfig, type: typeof generalConfig })
  }

  // Primitives: sync or async functions that return an { action, params } object
  //             passed to request.post by requestWrapper
  const primaryAPI = {
    label: {
      set: requestWrapper<TermActionParams, TermActionResponse>(setLabel, generalConfig),
    },
    description: {
      set: requestWrapper<TermActionParams, TermActionResponse>(setDescription, generalConfig),
    },
    alias: {
      set: requestWrapper<AliasActionParams, AliasActionResponse>(setAlias, generalConfig),
      add: requestWrapper<AliasActionParams, AliasActionResponse>(addAlias, generalConfig),
      remove: requestWrapper<AliasActionParams, AliasActionResponse>(removeAlias, generalConfig),
    },
    claim: {
      set: requestWrapper<SetClaimParams, SetClaimResponse>(setClaim, generalConfig),
      remove: requestWrapper<RemoveClaimParams, RemoveClaimResponse>(removeClaim, generalConfig),
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
      create: bundleWrapper<CreateClaimParams, CreateClaimResponse>(createClaim, generalConfig, primaryAPI),
      update: bundleWrapper<UpdateClaimParams, UpdateClaimResponse>(updateClaim, generalConfig, primaryAPI),
      move: bundleWrapper<MoveClaimParams, MoveClaimResponse>(moveClaims, generalConfig, primaryAPI),
    },
    qualifier: {
      update: bundleWrapper<UpdateQualifierParams, UpdateQualifierResponse>(updateQualifier, generalConfig, primaryAPI),
      move: bundleWrapper<MoveQualifierParams, MoveQualifierResponse>(moveQualifier, generalConfig, primaryAPI),
    },
    badge: {
      add: bundleWrapper<AddBadgeParams, AddBadgeResponse>(addBadge, generalConfig, primaryAPI),
      remove: bundleWrapper<RemoveBadgeParams, RemoveBadgeResponse>(removeBadge, generalConfig, primaryAPI),
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
