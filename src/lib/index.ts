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

// Primitives: sync or async functions that return an { action, params } object
//             passed to request.post by requestWrapper
const rawRequestBuilders = {
  label: {
    set: setLabel,
  },
  description: {
    set: setDescription,
  },
  alias: {
    set: setAlias,
    add: addAlias,
    remove: removeAlias,
  },
  claim: {
    set: setClaim,
    remove: removeClaim,
  },
  qualifier: {
    set: setQualifier,
    remove: removeQualifier,
  },
  reference: {
    set: setReference,
    remove: removeReference,
  },
  entity: {
    create: createEntity,
    edit: editEntity,
    merge: mergeEntity,
    delete: deleteEntity,
  },
  sitelink: {
    set: setSitelink,
  },
  badge: {},
}

// Bundles: async functions that make use of the primitives to offer more sophisticated behaviors
const bundledRequestsBuilders = {
  claim: {
    create: createClaim,
    update: updateClaim,
    move: moveClaim,
  },
  qualifier: {
    update: updateQualifier,
    move: moveQualifier,
  },
  badge: {
    add: addBadge,
    remove: removeBadge,
  },
}

export default function WBEdit (generalConfig = {}) {
  if (typeof generalConfig !== 'object') {
    throw newError('invalid general config object', { generalConfig, type: typeof generalConfig })
  }

  const API = {}

  for (const sectionKey in rawRequestBuilders) {
    API[sectionKey] = {}
    for (const functionName in rawRequestBuilders[sectionKey]) {
      const fn = rawRequestBuilders[sectionKey][functionName]
      API[sectionKey][functionName] = requestWrapper(fn, generalConfig)
    }
  }

  for (const sectionKey in bundledRequestsBuilders) {
    for (const functionName in bundledRequestsBuilders[sectionKey]) {
      const fn = bundledRequestsBuilders[sectionKey][functionName]
      API[sectionKey][functionName] = bundleWrapper(fn, generalConfig, API)
    }
  }

  API.getAuthData = reqConfig => {
    const config = validateAndEnrichConfig(generalConfig, reqConfig)
    return getAuthDataFactory(config)
  }

  // Legacy aliases
  API.claim.add = API.claim.create
  API.qualifier.add = API.qualifier.set
  API.reference.add = API.reference.set

  return API
}
