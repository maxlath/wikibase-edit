import error_ from '../error.js'
import edit from './edit.js'

export default async (params, properties, instance) => {
  const { id } = params
  if (id) throw error_.new("a new entity can't already have an id", { id })
  params.create = true
  return edit(params, properties, instance)
}
