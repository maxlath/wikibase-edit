import * as validate from '../validate.js'
import type { Aliases, EntityId, EntityType, WikimediaLanguageCode } from 'wikibase-sdk'

export interface AliasActionParams {
  id: EntityId
  language: WikimediaLanguageCode
  value: string | string[]
}

export function actionFactory (action: 'add' | 'remove' | 'set') {
  return function (params: AliasActionParams) {
    const { id, language, value } = params

    validate.entity(id)
    validate.language(language)
    validate.aliases(value)

    const data = { id, language }

    data[action] = value instanceof Array ? value.join('|') : value

    return { action: 'wbsetaliases', data }
  }
}

export interface AliasActionResponse {
  entity: {
    aliases: Aliases
    id: EntityId
    type: EntityType
    lastrevid: number
    nochange?: ''
  }
  success: 1
}
