import { newError } from '../error.js'
import * as validate from '../validate.js'
import type { EntityId, WikimediaLanguageCode } from 'wikibase-sdk'

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

    validate.entity(id)
    validate.language(language)
    if (value === undefined) throw newError(`missing ${name}`, params)
    if (value === null) value = ''

    return {
      action,
      data: { id, language, value },
    }
  }
}
