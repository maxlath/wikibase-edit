import { isArray } from '../utils.js'
import { validateGuid, validateHash } from '../validate.js'
import type { Guid, Hash } from 'wikibase-sdk'

export interface RemoveQualifierParams {
  guid: Guid
  hash?: Hash
}

export function removeQualifier (params: RemoveQualifierParams) {
  let { guid, hash } = params
  validateGuid(guid)

  if (isArray(hash)) {
    hash.forEach(validateHash)
    hash = hash.join('|')
  } else {
    validateHash(hash)
  }

  return {
    action: 'wbremovequalifiers',
    data: {
      claim: guid,
      qualifiers: hash,
    },
  }
}

export interface RemoveQualifierResponse {
  pageinfo: { lastrevid: number }
  success: 1
}
