import { isEntityId } from 'wikibase-sdk'
import { newError } from '../error.js'

export function deleteEntity (params) {
  const { id } = params

  if (!isEntityId(id)) throw newError('invalid entity id', params)

  return {
    action: 'delete',
    data: {
      // The title will be prefixified if needed by ./lib/resolve_title.js
      title: id,
    },
  }
}
