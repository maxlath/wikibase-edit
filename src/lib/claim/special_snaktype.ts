import { newError } from '../error.js'

export interface SpecialSnak {
  // snaktype: 'novalue' | 'somevalue'
  // Using a looser type, as literal values then required to set readonly flags to be valid
  // ex: { snaktype: 'novalue } as const
  snaktype: string
}

export function hasSpecialSnaktype (value: unknown): value is SpecialSnak {
  if (typeof value !== 'object') return false
  if (!('snaktype' in value)) return false
  const { snaktype } = value
  if (snaktype == null || snaktype === 'value') return false
  if (snaktype === 'novalue' || snaktype === 'somevalue') return true
  else throw newError('invalid snaktype', { snaktype })
}
