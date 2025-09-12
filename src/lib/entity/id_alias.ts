import { WBK, isPropertyId } from 'wikibase-sdk'
import { newError } from '../error.js'
import { request } from '../request/request.js'
import { isNonEmptyString } from '../utils.js'
import type { AbsoluteUrl } from '../types/common.js'

export function isIdAliasPattern (str: string) {
  if (typeof str !== 'string') return false
  const [ property, id ] = str.split(/[=:]/)
  return isPropertyId(property) && isNonEmptyString(id)
}

export async function resolveIdAlias (idAlias: string, instance: AbsoluteUrl) {
  const wbk = WBK({ instance })
  if (!idAlias.includes('=')) {
    // Accept both ':' and '=' as separators (as the Wikidata Hub uses one and haswbstatement the other)
    // but only replace the first instance of ':' to avoid corrupting valid ids containing ':'
    idAlias = idAlias.replace(':', '=')
  }
  const url = wbk.cirrusSearchPages({ haswbstatement: idAlias }) as AbsoluteUrl
  const res = await request('get', { url })
  const ids = res.query.search.map(result => result.title)
  if (ids.length === 1) return ids[0]
  else throw newError('id alias could not be resolved', 400, { idAlias, instance, foundIds: ids })
}
