import { newError } from '../error.js'

export const hasSpecialSnaktype = value => {
  if (typeof value !== 'object') return false
  const { snaktype } = value
  if (snaktype == null || snaktype === 'value') return false
  if (snaktype === 'novalue' || snaktype === 'somevalue') return true
  else throw newError('invalid snaktype', { snaktype })
}
