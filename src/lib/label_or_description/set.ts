import { newError } from '../error.js'
import { validateEntityId, validateLanguage } from '../validate.js'
import type { BaseRevId } from '../types/common.js'
import type { EntityId, EntityWithLabels, WikimediaLanguageCode } from 'wikibase-sdk'

export interface TermActionParams {
  id: EntityId
  language: WikimediaLanguageCode
  value: string
  summary?: string
  baserevid?: BaseRevId
}

export function setLabelOrDescriptionFactory (name: string) {
  return function setLabelOrDescription (params: TermActionParams) {
    const { id, language } = params
    let { value } = params
    const action = `wbset${name}`

    validateEntityId(id)
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
  entity: EntityWithLabels
  success: 1
}
