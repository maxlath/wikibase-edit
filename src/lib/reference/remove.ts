import { isArray } from '../utils.js'
import { validateGuid, validateHash } from '../validate.js'
import type { Guid, Hash } from 'wikibase-sdk'

export interface RemoveReferenceParams {
  guid: Guid
  hash: Hash
}

export function removeReference (params) {
  let { guid, hash } = params
  validateGuid(guid)

  if (isArray(hash)) {
    hash.forEach(validateHash)
    hash = hash.join('|')
  } else {
    validateHash(hash)
  }

  return {
    action: 'wbremovereferences',
    data: {
      statement: guid,
      references: hash,
    },
  }
}

export interface RemoveReferenceResponse {
  pageinfo: { lastrevid: number }
  success: 1
}
