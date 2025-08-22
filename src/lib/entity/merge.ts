import { isEntityId, isItemId } from 'wikibase-sdk'
import { newError } from '../error.js'

export function mergeEntity (params) {
  const { from, to } = params

  if (!isEntityId(from)) throw newError('invalid "from" entity id', params)
  if (!isEntityId(to)) throw newError('invalid "to" entity id', params)

  if (!isItemId(from)) throw newError('unsupported entity type', params)
  if (!isItemId(to)) throw newError('unsupported entity type', params)

  return {
    action: 'wbmergeitems',
    data: { fromid: from, toid: to },
  }
}
