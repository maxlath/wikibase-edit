import { isArray } from '../utils.js'
import * as validate from '../validate.js'
import type { Guid, Hash } from 'wikibase-sdk'

export interface RemoveQualifierParams {
  guid: Guid
  hash?: Hash
}

export function removeQualifier (params: RemoveQualifierParams) {
  let { guid, hash } = params
  validate.guid(guid)

  if (isArray(hash)) {
    hash.forEach(validate.hash)
    hash = hash.join('|')
  } else {
    validate.hash(hash)
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
