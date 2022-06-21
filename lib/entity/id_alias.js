const request = require('../request/request')
const error_ = require('../error')
const WBK = require('wikibase-sdk')
const { isNonEmptyString } = require('../utils')
const { isPropertyId } = require('wikibase-sdk/lib/helpers/helpers')

const isIdAliasPattern = str => {
  if (typeof str !== 'string') return false
  const [ property, id ] = str.split(/[=:]/)
  return isPropertyId(property) && isNonEmptyString(id)
}

const resolveIdAlias = async (idAlias, instance) => {
  const wbk = WBK({ instance })
  if (!idAlias.includes('=')) {
    // Accept both ':' and '=' as separators (as the Wikidata Hub uses one and haswbstatement the other)
    // but only replace the first instance of ':' to avoid corrupting valid ids containing ':'
    idAlias = idAlias.replace(':', '=')
  }
  const url = wbk.cirrusSearchPages({ haswbstatement: idAlias })
  const res = await request('get', { url })
  const ids = res.query.search.map(result => result.title)
  if (ids.length === 1) return ids[0]
  else throw error_.new('id alias could not be resolved', 400, { idAlias, instance, foundIds: ids })
}

module.exports = {
  isIdAliasPattern,
  resolveIdAlias,
}
