import { newError } from '../error.js'
import { validateEntity, validateLanguage } from '../validate.js'
import type { Entity, EntityId, WikimediaLanguageCode } from 'wikibase-sdk'

export interface TermActionParams {
  id: EntityId
  language: WikimediaLanguageCode
  value: string
}

export function setLabelOrDescriptionFactory (name: string) {
  return function setLabelOrDescription (params: TermActionParams) {
    const { id, language } = params
    let { value } = params
    const action = `wbset${name}`

    validateEntity(id)
    validateLanguage(language)
    if (value === undefined) throw newError(`missing ${name}`, params)
    if (value === null) value = ''

    return {
      action,
      data: { id, language, value },
    }
  }
}

export interface TermActionResponse {
  entity: Entity
  success: 1
}
