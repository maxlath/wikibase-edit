import { isEntityId } from 'wikibase-sdk'
import error_ from '../error.js'

export default params => {
  const { id } = params

  if (!isEntityId(id)) throw error_.new('invalid entity id', params)

  return {
    action: 'delete',
    data: {
      // The title will be prefixified if needed by ./lib/resolve_title.js
      title: id,
    },
  }
}
