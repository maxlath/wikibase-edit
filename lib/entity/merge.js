const { isEntityId, isItemId } = require('wikibase-sdk')
const error_ = require('../error')

module.exports = params => {
  const { from, to } = params

  if (!isEntityId(from)) throw error_.new('invalid "from" entity id', params)
  if (!isEntityId(to)) throw error_.new('invalid "to" entity id', params)

  if (!isItemId(from)) throw error_.new('unsupported entity type', params)
  if (!isItemId(to)) throw error_.new('unsupported entity type', params)

  return {
    action: 'wbmergeitems',
    data: { fromid: from, toid: to }
  }
}
