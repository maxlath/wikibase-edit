import { newError } from '../error.js'
import type { SimplifiedSnak, Snak } from 'wikibase-sdk'

export type SpecialSnak = Omit<Snak, 'datavalue' | 'snaktype'> & { snaktype: 'novalue' | 'somevalue' }

export function hasSpecialSnaktype (value: string | number | Snak | SimplifiedSnak): value is SpecialSnak {
  if (typeof value !== 'object') return false
  const { snaktype } = value
  if (snaktype == null || snaktype === 'value') return false
  if (snaktype === 'novalue' || snaktype === 'somevalue') return true
  else throw newError('invalid snaktype', { snaktype })
}
