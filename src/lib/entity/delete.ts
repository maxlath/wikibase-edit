import { isEntityId, type EntityId, type EntityPageTitle } from 'wikibase-sdk'
import { newError } from '../error.js'

export interface DeleteEntityParams {
  id: EntityId
}

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

export interface DeleteEntityResponse {
  title: EntityPageTitle
  reason: string
  logid: number
}
