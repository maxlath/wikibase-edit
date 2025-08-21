import { newError } from '../error.js'
import edit from './edit.js'

export default async (params, properties, instance, config) => {
  const { id } = params
  if (id) throw newError("a new entity can't already have an id", { id })
  params.create = true
  return edit(params, properties, instance, config)
}
