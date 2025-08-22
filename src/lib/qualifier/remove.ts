import { isArray } from '../utils.js'
import * as validate from '../validate.js'

export function removeQualifier (params) {
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
