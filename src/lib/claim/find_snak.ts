import { newError } from '../error.js'
import { isMatchingSnak, type SearchedValue } from './is_matching_snak.js'
import type { Claim, PropertyId, SnakBase } from 'wikibase-sdk'

export function findSnak <T extends (Claim | SnakBase)> (property: PropertyId, propSnaks: T[], searchedValue: SearchedValue): T | void {
  if (!propSnaks) return

  const matchingSnaks = propSnaks.filter(snak => isMatchingSnak(snak, searchedValue))

  if (matchingSnaks.length === 0) return
  if (matchingSnaks.length === 1) return matchingSnaks[0]

  const context = { property, propSnaks, searchedValue }
  throw newError('snak not found: too many matching snaks', 400, context)
}
