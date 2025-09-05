import { newError } from '../error.js'
import { isMatchingSnak } from './is_matching_snak.js'
import type { CustomSimplifiedSnak, PropertyClaims, PropertyId } from 'wikibase-sdk'

export function findSnak (property: PropertyId, propSnaks: PropertyClaims, searchedValue: CustomSimplifiedSnak['value']) {
  if (!propSnaks) return

  const matchingSnaks = propSnaks.filter(snak => isMatchingSnak(snak, searchedValue))

  if (matchingSnaks.length === 0) return
  if (matchingSnaks.length === 1) return matchingSnaks[0]

  const context = { property, propSnaks, searchedValue }
  throw newError('snak not found: too many matching snaks', 400, context)
}
