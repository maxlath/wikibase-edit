import { newError } from '../error.js'
import { editEntity } from './edit.js'

export async function createEntity (params, properties, instance, config) {
  const { id } = params
  if (id) throw newError("a new entity can't already have an id", { id })
  params.create = true
  return editEntity(params, properties, instance, config)
}
