import { newError, type ErrorContext } from '../error.js'
import datatypesToBuilderDatatypes from '../properties/datatypes_to_builder_datatypes.js'
import { singleClaimBuilders as builders } from './builders.js'
import { hasSpecialSnaktype } from './special_snaktype.js'
import type { AbsoluteUrl } from '../types/common.js'
import type { Guid, Hash, PropertyId, Snak, SnakType } from 'wikibase-sdk'

export interface SnakPostDataParams {
  action: 'wbsetqualifier'
  data: {
    claim: Guid
    property: PropertyId
    snakhash?: Hash
    snaktype?: SnakType
    value?: unknown
  }
  datatype: string
  value: string | number | Snak
  instance: AbsoluteUrl
}

export function snakPostData (params: SnakPostDataParams) {
  const { action, data, datatype, value, instance } = params

  if (!datatype) throw newError('missing datatype', params as unknown as ErrorContext)

  if (hasSpecialSnaktype(value)) {
    data.snaktype = value.snaktype
  } else {
    data.snaktype = 'value'
    const builderDatatype = datatypesToBuilderDatatypes(datatype) || datatype
    data.value = builders[builderDatatype](value, instance)
  }

  return { action, data }
}
